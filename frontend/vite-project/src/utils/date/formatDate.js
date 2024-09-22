const formatDate = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);

  const diffMs = now - createdDate; // Difference in milliseconds
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes}min ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    // For older dates, return a formatted date
    return createdDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};
export default formatDate;
