const FALLBACK_ERROR_MESSAGE = "요청 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";

const ENGLISH_ERROR_PATTERNS: Array<[RegExp, string]> = [
  [/failed to fetch|networkerror|load failed|network request failed/i, "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."],
  [/unauthorized|not authenticated|authentication credentials|invalid token|token.*expired/i, "로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요."],
  [/forbidden|permission denied/i, "이 작업을 수행할 권한이 없습니다."],
  [/not found/i, "요청한 정보를 찾을 수 없습니다."],
  [/internal server error|server error/i, "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."],
  [/field required|missing/i, "필수 입력값을 확인해주세요."],
  [/value is not a valid email|valid email/i, "올바른 이메일 형식을 입력해주세요."],
  [/string should have at least 8 characters|at least 8 characters|min_length.*8|minimum.*8/i, "비밀번호는 8자 이상이어야 합니다."],
  [/string should have at least 2 characters|at least 2 characters|min_length.*2|minimum.*2/i, "입력값은 2자 이상이어야 합니다."],
  [/password/i, "비밀번호를 확인해주세요."],
  [/email/i, "이메일을 확인해주세요."],
];

function hasKorean(text: string) {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
}

export function normalizeErrorMessage(message: unknown, fallback = FALLBACK_ERROR_MESSAGE) {
  if (typeof message !== "string" || !message.trim()) {
    return fallback;
  }

  const trimmed = message.trim();
  if (hasKorean(trimmed)) {
    return trimmed;
  }

  for (const [pattern, koreanMessage] of ENGLISH_ERROR_PATTERNS) {
    if (pattern.test(trimmed)) {
      return koreanMessage;
    }
  }

  return fallback;
}

export function getDisplayErrorMessage(error: unknown, fallback = FALLBACK_ERROR_MESSAGE) {
  if (error instanceof Error) {
    return normalizeErrorMessage(error.message, fallback);
  }

  return normalizeErrorMessage(error, fallback);
}
