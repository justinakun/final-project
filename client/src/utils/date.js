export const formatDate = (date) => {
  const formattedDate = date.split("T")[0];
  const formattedTime = date.split("T")[1].split(".")[0];
  return formattedDate + " " + formattedTime;
};
