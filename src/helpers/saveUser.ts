import sleep from "./sleep";
import logger from "../logger";
import Chance from "chance";

export default async function saveUser(data: any, data2: any) {
  process.nextTick(
    async () => {
      // Chance module
      const chance = new Chance();

      await sleep(
        chance.integer({
          min: 0,
          max: 1,
        }) *
          10 +
          1 * 100
      ); // 100 - 1000 random  Number generator
      data.save((_: any) =>
        _
          ? logger.error(
              `ERROR Occurred while saving data (saveUser) \n${"=".repeat(
                50
              )}\n${`${_}\n${"=".repeat(50)}`}`
            )
          : "No Error"
      );
      if (data2) {
        data2.save((_: any) =>
          _
            ? logger.error(
                `ERROR Occurred while saving data (saveUser) \n${"=".repeat(
                  50
                )}\n${`${_}\n${"=".repeat(50)}`}`
              )
            : "No Error"
        );
      }
    },
    data,
    data2
  );
}
