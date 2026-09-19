const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function shortDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function clockTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Inbox column: "Now", "5m", "2h", "Yesterday", "Mon", "Sep 3". */
export function formatInboxTime(timestamp: number, now = Date.now()): string {
  const elapsed = now - timestamp;
  if (elapsed < MINUTE) return "Now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`;
  if (elapsed < DAY && startOfDay(now) === startOfDay(timestamp)) {
    return `${Math.floor(elapsed / HOUR)}h`;
  }
  const daysAgo = Math.round((startOfDay(now) - startOfDay(timestamp)) / DAY);
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return WEEKDAY[new Date(timestamp).getDay()];
  return shortDate(timestamp);
}

/** Under a message: "Today 9:12 AM", "Yesterday 9:12 AM", "Mon 9:12 AM", "Sep 3, 9:12 AM". */
export function formatMessageTime(timestamp: number, now = Date.now()): string {
  const daysAgo = Math.round((startOfDay(now) - startOfDay(timestamp)) / DAY);
  const time = clockTime(timestamp);
  if (daysAgo === 0) return `Today ${time}`;
  if (daysAgo === 1) return `Yesterday ${time}`;
  if (daysAgo < 7) return `${WEEKDAY[new Date(timestamp).getDay()]} ${time}`;
  return `${shortDate(timestamp)}, ${time}`;
}
