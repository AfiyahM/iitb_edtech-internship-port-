export function formatRelativeDate(dateString: string): string {
  if (!dateString) return "";

  const postedDate = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - postedDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}
