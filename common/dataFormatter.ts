import moment from "moment";

export const formatDate = (date: string) => {
  return moment(date).format("ll");
};

export const formatDateAddDay = (date: string) => {
  return moment(date).format("ddd, MMM D, YYYY");
};
