export default function sleep(milliseconds: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
