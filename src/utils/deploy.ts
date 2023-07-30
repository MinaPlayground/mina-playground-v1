export const findSmartContractMatches = (code: string | undefined) => {
  if (!code) return [];
  return [...code.matchAll(/class (\w*) extends SmartContract/gi)];
};
