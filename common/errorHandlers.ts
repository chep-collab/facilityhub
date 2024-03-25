export const handleErrorMessages = (
  errorMessage: string | string[]
): string => {
  if (typeof errorMessage === "string") {
    return errorMessage;
  } else if (Array.isArray(errorMessage)) {
    return errorMessage.join(", ");
  } else {
    return "An error occurred";
  }
};
