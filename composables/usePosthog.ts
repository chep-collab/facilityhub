import posthog from "posthog-js";

export const usePosthog = () => {
  enum ALLOWED_EVENT_NAMES {
    SIGNUP = "signup",
    LOGIN = "login",
    FETCH_COMPANY_SERVICES = "Fetch Company Services",
    COMPANY_CREATE_SERVICE = "Company Create Service",
    COMPANY_UPDATE_SERVICE = "Company Update Service",
    COMPANY_UPDATE_SERVICE_STATUS = "Company Update Service Status",
    COMPANY_DELETE_SERVICE_STATUS = "Company Delete Service",
  }
  const { $posthog } = useNuxtApp();
  const posthog = $posthog();

  const identifyUser = (user: {
    type: string;
    email: string;
    full_name: string;
  }) => {
    posthog.identify(user.email, {
      type: user.type,
      email: user.email,
      name: user.full_name,
    });
  };
  const captureEvent = (
    event_name: ALLOWED_EVENT_NAMES,
    properties: { [key: string]: any }
  ) => {
    posthog.capture(event_name, { ...properties });
  };

  return {
    posthog: {
      captureEvent,
      ALLOWED_EVENT_NAMES,
      identifyUser,
    },
  };
};
