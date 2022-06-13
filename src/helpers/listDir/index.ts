import fs from "fs";
const fsPromises = fs.promises;

export default async (path: string) => {
  return fsPromises.readdir(path).catch(async (err) => {
    throw new Error(`Could not list directory: ${path}`, err);
  });
};
