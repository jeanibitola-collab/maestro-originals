// One place to format prices. Change the symbol or style here and it updates everywhere.
export function formatPrice(amount: number): string {
  const hasDecimals = Math.round(amount * 100) % 100 !== 0;
  return (
    "₦" +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    })
  );
}