import { apiRequest } from "./api";
import type { PolicyResource } from "../data/policy";

let cachedPolicies: Promise<PolicyResource[]> | null = null;

export function getPolicies(): Promise<PolicyResource[]> {
  if (!cachedPolicies) {
    cachedPolicies = apiRequest<PolicyResource[]>("/policies").catch((error) => {
      cachedPolicies = null; // 실패 시 다음 호출에서 재시도 가능하도록 무효화
      throw error;
    });
  }
  return cachedPolicies;
}
