const SEEN_KEY = "banguard_seen_policy_ids";

export function hasSeenRecord(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) !== null;
  } catch {
    return true; // localStorage 사용 불가 시 팝업을 띄우지 않음
  }
}

export function getSeenPolicyIds(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markPoliciesSeen(ids: string[]): void {
  try {
    const merged = Array.from(new Set([...getSeenPolicyIds(), ...ids]));
    localStorage.setItem(SEEN_KEY, JSON.stringify(merged));
  } catch {
    // 저장 실패는 무시 (팝업이 다음에 다시 뜰 뿐)
  }
}
