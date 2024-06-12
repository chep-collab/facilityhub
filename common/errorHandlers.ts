import { AxiosError } from "axios";

export const handleErrorMessages = (
  error: string | string[] | Error | AxiosError
): string => {
  if (typeof error === "string") {
    return error || "An error occurred";
  } else if (Array.isArray(error)) {
    return error.join(", ") || "An error occurred";
  } else if ((error as AxiosError).isAxiosError) {
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
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "An error occurred";
  }
};
