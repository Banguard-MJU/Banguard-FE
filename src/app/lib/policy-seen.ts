const SEEN_KEY_PREFIX = "banguard_seen_policy_ids";

function keyFor(userId: string): string {
  return `${SEEN_KEY_PREFIX}_${userId}`;
}

export function hasSeenRecord(userId: string): boolean {
  try {
    return localStorage.getItem(keyFor(userId)) !== null;
  } catch {
    return true; // localStorage 사용 불가 시 팝업을 띄우지 않음
  }
}

export function getSeenPolicyIds(userId: string): string[] {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markPoliciesSeen(userId: string, ids: string[]): void {
  try {
    const merged = Array.from(new Set([...getSeenPolicyIds(userId), ...ids]));
    localStorage.setItem(keyFor(userId), JSON.stringify(merged));
  } catch {
    // 저장 실패는 무시 (팝업이 다음에 다시 뜰 뿐)
  }
}
