import crypto from "crypto";

import { secretKey, algorithm } from "../../config/encryption";

import { IEncryptionData } from "../../interfaces/EncryptionData";

const iv = crypto.randomBytes(16);

const encrypt = (text: crypto.BinaryLike): IEncryptionData => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

const decrypt = (hash: IEncryptionData) => {
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
