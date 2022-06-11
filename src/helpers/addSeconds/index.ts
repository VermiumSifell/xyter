export default async (seconds: number, date: Date) => {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
};
