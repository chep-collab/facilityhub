export type TabsItem = {
  label: string;
  icon?: string;
  value: string;
};
export type formState =
  | Record<string, string | number | boolean | null>
  | never[];
export type baseEndpointPayload = Record<string, string | number | boolean>;
