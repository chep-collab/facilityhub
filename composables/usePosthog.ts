import posthog from "posthog-js";

export const usePosthog = () => {
  enum ALLOWED_EVENT_NAMES {
    SIGNUP = "signup",
    LOGIN = "login",
    FETCH_COMPANY_SERVICES = "Fetch Company Services",
    COMPANY_CREATE_SERVICE = "Created A Service",
    COMPANY_UPDATE_SERVICE = "Updated A Service",
    COMPANY_UPDATE_SERVICE_STATUS = "Updated A Service Status",
    COMPANY_DELETE_SERVICE = "Delete A Service",

    FETCH_JOINED_COMPANIES = "Fetched Joined Companies",
    FETCH_COMPANY_DETAIL = "Fetched Company Details",
    FETCH_COMPANIES = "Fetched Companies",
    JOINED_A_COMPANY = "Joined A Company",
    FETCHED_SUBSCRIPTIONS = "Fetched Subscriptions",
    UPLOADED_SUBSCRIPTION_RECEIPT = "Uploaded Subscription Receipt",
    SUBSCRIBED_TO_A_SERVICE = "Subscribed To A Service",
    ACTIVATED_A_SUBSCRIPTION = "Activated A Subscription",

    FETCHED_FACILITY_USERS = "Fetched Facility Users",
    COMPANY_REQUESTED_PASSWORD_RESET = "Company Requested Password Reset",
    COMPANY_CHANGED_PASSWORD = "Company Changed Password",
    USER_REQUESTED_PASSWORD_RESET = "User Requested Password Reset",
    USER_CHANGED_PASSWORD = "User Changed Password",
  }
  const { $posthog } = useNuxtApp();
  if ($posthog) {
    const posthog = $posthog();
  }

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
