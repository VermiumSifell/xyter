export default async (numOfSeconds: number | undefined, date = new Date()) => {
  if (!numOfSeconds) throw new Error("numOfSeconds is required");

  date.setSeconds(date.getSeconds() + numOfSeconds);

  return date;
};
