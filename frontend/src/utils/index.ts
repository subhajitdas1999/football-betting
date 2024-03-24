export const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit", // '2-digit' or 'numeric'
    month: "short", // 'numeric', '2-digit', 'narrow', 'short', or 'long'
    year: "numeric", // '2-digit' or 'numeric'
    hour: "2-digit", // '2-digit' or 'numeric'
    minute: "2-digit", // '2-digit' or 'numeric'
    hour12: false,
  };

  // Split the date and time to remove the comma after the year
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};
