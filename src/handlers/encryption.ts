import crypto from "crypto";

// @ts-ignore
import { secretKey, algorithm } from "@config/encryption";

const iv = crypto.randomBytes(16);

interface IEncrypt {
  iv: string;
  content: string;
}

const encrypt = (text: crypto.BinaryLike): IEncrypt => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

const decrypt = (hash: IEncrypt) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
};

export default {
  encrypt,
  decrypt,
};
