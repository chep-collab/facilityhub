export function formatToNaira(amount: number): string {
  return amount.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
}
