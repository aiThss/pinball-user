export function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s().-]/g, "");
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^(0\d{8,10}|\+84\d{8,10})$/.test(normalized);
}

export const ACTIVE_STATUS = "Đang gửi";
export const CARD_WITHDRAW = "Lấy thẻ";
export const BALL_WITHDRAW = "Lấy bi";
