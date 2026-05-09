export const MIN_PASSWORD_LENGTH = 8;

export function getPasswordMinLengthMessage(label = "비밀번호") {
  return `${label}는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다`;
}
