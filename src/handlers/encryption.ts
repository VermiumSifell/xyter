import crypto from 'crypto';
import config from '../../config.json';

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

const encrypt = (text: any) => {
  const cipher = crypto.createCipheriv(algorithm, config.secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

const decrypt = (hash: any) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    config.secretKey,
    Buffer.from(hash.iv, 'hex')
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString();
};

export default {
  encrypt,
  decrypt,
};
