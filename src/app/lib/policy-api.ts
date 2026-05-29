import { apiRequest } from "./api";
import type { PolicyResource } from "../data/policy";

export async function getPolicies(): Promise<PolicyResource[]> {
  return apiRequest<PolicyResource[]>("/policies");
}
