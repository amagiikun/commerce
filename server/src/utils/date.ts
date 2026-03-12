function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function parseDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function parseDateTime(value: string) {
  return new Date(value.includes('T') ? value : value.replace(' ', 'T'));
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDateTime(date: Date) {
  return `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function roundTo(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
