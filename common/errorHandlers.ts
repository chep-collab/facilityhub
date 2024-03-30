import { AxiosError } from "axios";

export const handleErrorMessages = (
  error: string | string[] | AxiosError
): string => {
  if (typeof error === "string") {
    return error || "An error occurred";
  } else if (Array.isArray(error)) {
    return error.join(", ") || "An error occurred";
  } else if (error.isAxiosError) {
    const axiosError = error as AxiosError;
    if (
      axiosError.response &&
      axiosError.response.data &&
      axiosError.response.data.message
    ) {
      return axiosError.response.data.message;
    } else {
      return "An error occurred";
    }
  } else {
    return "An error occurred";
  }
};
