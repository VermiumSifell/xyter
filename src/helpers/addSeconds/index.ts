export default async (numOfSeconds: number, date = new Date()) => {
  date.setSeconds(date.getSeconds() + numOfSeconds);

  return date;
};
