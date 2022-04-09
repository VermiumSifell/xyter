export default (amount: number) =>
  `${amount <= 1 ? `${amount} credit` : `${amount} credits`}`;
