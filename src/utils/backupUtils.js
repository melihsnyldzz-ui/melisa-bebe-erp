import { formatDateTR } from "./dateUtils.js";

export function formatBackupDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return `${formatDateTR(value)} ${date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
}

export function getBackupStatusLabel(status) {
  if (status === "success") return "Başarılı";
  if (status === "failed") return "Başarısız";
  return "Henüz yedek yok";
}

export function getBackupStatusClass(status) {
  if (status === "success") return "status-active";
  if (status === "failed") return "status-canceled";
  return "status-warning";
}
