// crypto.randomUUID()는 보안 컨텍스트(https/localhost)에서만 동작.
// 비-보안 환경(사설 IP 등) dev 서버에서도 안전하게 ID를 생성하기 위한 폴백.
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      // 폴백으로 진행
    }
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
