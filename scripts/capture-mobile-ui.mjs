import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const baseUrl = process.env.BASE_URL ?? "http://localhost:5173";
const outputDir = process.env.OUTPUT_DIR ?? "artifacts/mobile-ui";
const port = Number(process.env.CDP_PORT ?? 9333);
const viewport = { width: 390, height: 844, deviceScaleFactor: 1, mobile: true };

const routes = [
  ["01-home", "/"],
  ["02-contract-analysis", "/contract-analysis"],
  ["03-chatbot", "/chatbot"],
  ["04-listings", "/listings"],
  ["05-community", "/community"],
  ["06-login", "/login"],
  ["07-signup", "/signup"],
  ["08-onboarding", "/onboarding"],
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForChrome() {
  const endpoint = `http://127.0.0.1:${port}/json/list`;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const targets = await response.json();
        const page = targets.find((target) => target.type === "page" && target.webSocketDebuggerUrl);
        if (page) {
          return page;
        }
      }
    } catch {
      await delay(100);
    }
  }

  throw new Error(`Chrome DevTools endpoint did not start on ${endpoint}`);
}

function createCdpClient(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  let nextId = 1;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id) {
      return;
    }

    const request = pending.get(message.id);
    if (!request) {
      return;
    }

    pending.delete(message.id);
    if (message.error) {
      request.reject(new Error(message.error.message));
    } else {
      request.resolve(message.result ?? {});
    }
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = nextId;
          nextId += 1;

          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((requestResolve, requestReject) => {
            pending.set(id, { resolve: requestResolve, reject: requestReject });
          });
        },
        close() {
          socket.close();
        },
      });
    });

    socket.addEventListener("error", reject);
  });
}

async function capture() {
  await mkdir(outputDir, { recursive: true });

  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    "--user-data-dir=/tmp/banguard-mobile-capture-profile",
    `--window-size=${viewport.width},${viewport.height}`,
    `${baseUrl}/`,
  ]);

  chrome.stderr.on("data", (chunk) => {
    const line = chunk.toString();
    if (!line.includes("DevTools listening") && !line.includes("ERROR:")) {
      process.stderr.write(line);
    }
  });

  try {
    const { webSocketDebuggerUrl } = await waitForChrome();
    const cdp = await createCdpClient(webSocketDebuggerUrl);

    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", viewport);

    for (const [name, route] of routes) {
      const url = `${baseUrl}${route}`;

      await cdp.send("Page.navigate", { url });
      await cdp.send("Page.loadEventFired").catch(() => {});
      await delay(700);

      await cdp.send("Runtime.evaluate", {
        expression: "sessionStorage.setItem('banguard_onboarding_seen_session', 'true')",
      });

      if (route !== "/onboarding") {
        await cdp.send("Page.navigate", { url });
        await delay(900);
      }

      const result = await cdp.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });

      const filePath = `${outputDir}/${name}.png`;
      await writeFile(filePath, Buffer.from(result.data, "base64"));
      console.log(filePath);
    }

    cdp.close();
  } finally {
    chrome.kill("SIGTERM");
  }
}

capture().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
