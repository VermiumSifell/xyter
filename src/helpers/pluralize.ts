export default (count: number, noun: string, suffix?: string) =>
  `${count} ${noun}${count === 1 || suffix || "s"}`;
