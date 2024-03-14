import { expose } from "comlink";

const generateKeys = async (customKeyValue: string | undefined) => {
  const { PrivateKey } = await import("o1js");
  const key = customKeyValue
    ? PrivateKey.fromBase58(customKeyValue)
    : PrivateKey.random();
  const publicKey = key.toPublicKey().toBase58();
  const privateKey = key.toBase58();
  return { publicKey, privateKey };
};

expose({ generateKeys });
