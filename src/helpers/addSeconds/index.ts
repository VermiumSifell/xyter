export default async (numOfSeconds: number, date: Date) => {
  if (!numOfSeconds) throw new Error("numOfSeconds is required");

  date.setSeconds(date.getSeconds() + numOfSeconds);

  return date;
};
