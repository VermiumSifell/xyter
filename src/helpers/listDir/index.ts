import fs from "fs";
const fsPromises = fs.promises;

export default async (path: string) => {
  try {
    return await fsPromises.readdir(path);
  } catch (err) {
    console.error("Error occurred while reading directory!", err);
  }
};
