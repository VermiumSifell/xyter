// Encryption algorithm
export const algorithm = "aes-256-ctr";

// Encryption secret (strictly 32 length)
export const secretKey =
  process.env["SECRET_KEY"] || "h/f#Ts8w5sch5L:J*_gPW)]$'!4K.K.-";
