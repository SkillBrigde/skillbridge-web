import {
  vnd,
  fmtFullDate,
  fmtDateTime,
  slotDateLabel,
  slotTimeLabel,
  bookingTimeLabel,
} from "@/lib/domain";

export { vnd, vnd as formatVND, slotDateLabel, slotTimeLabel, bookingTimeLabel };

export function formatDateVN(dateStringOrTimestamp: string | number): string {
  const ms = typeof dateStringOrTimestamp === "number"
    ? dateStringOrTimestamp
    : new Date(dateStringOrTimestamp).getTime();
  return isNaN(ms) ? "" : fmtFullDate(ms);
}

export function formatDateTimeVN(dateStringOrTimestamp: string | number): string {
  const ms = typeof dateStringOrTimestamp === "number"
    ? dateStringOrTimestamp
    : new Date(dateStringOrTimestamp).getTime();
  return isNaN(ms) ? "" : fmtDateTime(ms);
}
