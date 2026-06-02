import type { CSSProperties } from "react";

type BanggadiLoadingProps = {
  progress?: number;
  text?: string;
};

type BanggadiLoadingStyle = CSSProperties & {
  "--banggadi-progress": number;
};

const DEFAULT_LOADING_TEXT = "계약서를 안전하게 분석하는 중...";

function clampProgress(progress: number) {
  return Math.min(100, Math.max(0, progress));
}

export function BanggadiLoading({ progress, text = DEFAULT_LOADING_TEXT }: BanggadiLoadingProps) {
  const hasProgress = typeof progress === "number" && Number.isFinite(progress);
  const safeProgress = hasProgress ? clampProgress(progress) : 60;
  const style: BanggadiLoadingStyle = {
    "--banggadi-progress": safeProgress,
  };

  return (
    <div
      className={`banggadi-loading${hasProgress ? " is-determinate" : " is-indeterminate"}`}
      style={style}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="banggadi-loading-stage" aria-hidden="true">
        <div className="banggadi-runner">
          <svg
            className="banggadi-runner-svg"
            width="72"
            height="72"
            viewBox="0 0 300 300"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <ellipse className="runner-shadow" cx="150" cy="270" rx="70" ry="12" fill="#cbd5e1" />

            <g className="runner-character">
              <path
                className="runner-ear left-ear"
                d="M 80 110 C 50 90 30 140 60 180 C 70 190 90 170 80 140 Z"
                fill="#1E3A8A"
              />
              <path
                className="runner-ear right-ear"
                d="M 220 110 C 250 90 270 140 240 180 C 230 190 210 170 220 140 Z"
                fill="#1E3A8A"
              />

              <path
                d="M 150 40 C 220 40 240 90 240 160 C 240 230 190 260 150 260 C 110 260 60 230 60 160 C 60 90 80 40 150 40 Z"
                fill="#1E3A8A"
              />
              <path
                d="M 150 85 C 200 85 210 120 210 170 C 210 220 180 250 150 250 C 120 250 90 220 90 170 C 90 120 100 85 150 85 Z"
                fill="#FFFFFF"
              />
              <ellipse cx="100" cy="65" rx="15" ry="6" fill="#FFFFFF" opacity="0.3" transform="rotate(-20 100 65)" />

              <circle cx="120" cy="135" r="12" fill="#1E3A8A" />
              <circle cx="117" cy="131" r="4" fill="#FFFFFF" />
              <circle cx="180" cy="135" r="12" fill="#1E3A8A" />
              <circle cx="177" cy="131" r="4" fill="#FFFFFF" />

              <ellipse cx="100" cy="150" rx="12" ry="7" fill="#F472B6" opacity="0.5" />
              <ellipse cx="200" cy="150" rx="12" ry="7" fill="#F472B6" opacity="0.5" />

              <path
                d="M 140 148 Q 145 155 150 148 Q 155 155 160 148"
                fill="none"
                stroke="#1E3A8A"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <ellipse cx="150" cy="140" rx="6" ry="4" fill="#1E3A8A" />

              <path
                d="M 135 190 L 145 200 L 170 175"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                className="runner-arm left-arm"
                d="M 90 180 Q 70 200 50 180"
                fill="none"
                stroke="#1E3A8A"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                className="runner-arm right-arm"
                d="M 210 180 Q 230 200 250 180"
                fill="none"
                stroke="#1E3A8A"
                strokeWidth="16"
                strokeLinecap="round"
              />

              <rect
                x="25"
                y="150"
                width="30"
                height="40"
                rx="3"
                fill="#FFFFFF"
                stroke="#1E3A8A"
                strokeWidth="3"
                transform="rotate(-15 40 170)"
              />
              <line
                x1="30"
                y1="160"
                x2="45"
                y2="160"
                stroke="#1E3A8A"
                strokeWidth="2"
                transform="rotate(-15 40 170)"
              />
              <line
                x1="30"
                y1="168"
                x2="45"
                y2="168"
                stroke="#1E3A8A"
                strokeWidth="2"
                transform="rotate(-15 40 170)"
              />

              <circle cx="265" cy="165" r="16" fill="#E0F2FE" stroke="#F59E0B" strokeWidth="5" />
              <line x1="255" y1="175" x2="245" y2="185" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        <div className="banggadi-loading-track">
          <div className="banggadi-loading-fill" />
        </div>
      </div>

      <p className="banggadi-loading-text">{text}</p>
    </div>
  );
}

