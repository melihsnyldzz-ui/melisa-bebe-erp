const dateFormatterTR = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function getTodayISO() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export function formatDateTR(value) {
  if (!value) return "-";
  return dateFormatterTR.format(new Date(value));
}

export function isWithinLastDays(value, days) {
  if (!value) return false;

  const targetDate = new Date(value);
  const today = new Date(getTodayISO());
  const diffInDays = (today - targetDate) / (1000 * 60 * 60 * 24);

  return diffInDays >= 0 && diffInDays <= days;
}
