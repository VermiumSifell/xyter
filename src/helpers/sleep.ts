import logger from "@logger";

export default function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
    logger?.silly(`Sleeping for ${milliseconds} milliseconds`);
  });
}
