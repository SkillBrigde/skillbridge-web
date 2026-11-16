import type { Result } from "./domain";

export const UNAVAILABLE_MESSAGE =
  "Tính năng này đang được hoàn thiện. Vui lòng quay lại sau.";

/** Until a server endpoint exists, never create transactions or balances locally. */
export function unavailableAction(
  ...args: unknown[]
): Result<{ bookingId?: string; disputeId?: string; code?: string }> {
  void args;
  return { ok: false, error: UNAVAILABLE_MESSAGE };
}
