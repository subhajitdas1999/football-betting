export const currentTime = () => {
  // Get current date/time
  const now = new Date();

  // Extract hours, minutes, seconds, and milliseconds
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Format the time components
  const formattedTime = `${hours}:${minutes}:${seconds}:${milliseconds}`;
  return formattedTime;
};
