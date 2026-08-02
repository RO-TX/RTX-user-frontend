/**
 * Prices are INR — the extended mockups price the purifiers at ₹24,900 /
 * ₹19,900 and the copy reads "every Indian home", "All India delivery".
 * No decimals: Indian retail quotes whole rupees.
 */
export const money = (n: number) =>
  n.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
