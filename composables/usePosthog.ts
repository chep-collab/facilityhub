import posthog from "posthog-js";

export const usePosthog = () => {
  enum ALLOWED_EVENT_NAMES {
    SIGNUP = "signup",
    LOGIN = "login",
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
