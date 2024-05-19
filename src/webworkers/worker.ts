import { expose } from "comlink";
import { PrivateKey } from "o1js";

const MinaWorker = () => {
  return {
    generateKeys: async (customKeyValue: string | undefined) => {
      const key = customKeyValue
        ? PrivateKey.fromBase58(customKeyValue)
        : PrivateKey.random();
      const publicKey = key.toPublicKey().toBase58();
      const privateKey = key.toBase58();
      return { publicKey, privateKey };
    },
  };
};

expose(MinaWorker());
