export const formatLastSeen = (date: Date | string): string => {
  const lastSeen = new Date(date);
  const now = new Date();

  const diffMs = now.getTime() - lastSeen.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Just now
  if (seconds < 60) {
    return "last seen just now";
  }

  // Minutes ago
  if (minutes < 60) {
    return `last seen ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  // Hours ago
  if (hours < 24) {
    return `last seen ${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  // Yesterday
  if (days === 1) {
    return `last seen yesterday at ${lastSeen.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Within 7 days
  if (days < 7) {
    return `last seen ${days} days ago`;
  }

  // Full date
  return `last seen on ${lastSeen.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};