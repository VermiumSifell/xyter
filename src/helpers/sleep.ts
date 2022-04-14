import logger from "@logger";

export default function sleep(milliseconds: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
    logger?.verbose(`Sleeping for ${milliseconds} milliseconds`);
  });
}
