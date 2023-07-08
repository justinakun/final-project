export const getFormattedDate = (date) => {
  const formattedDate = date.split("T")[0];
  return formattedDate;
};

export const getFormattedTime = (date) => {
  const formattedTime = date.split("T")[1].split(".")[0];
  return formattedTime;
};
