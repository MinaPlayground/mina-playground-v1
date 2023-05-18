import dynamic from "next/dynamic";

export const dynamicComponents = {
  C0S0: dynamic(
    () =>
      import("src/tutorials/01-introduction/01-smart-contracts/tutorial.mdx")
  ),
  C0S1: dynamic(
    () => import("src/tutorials/01-introduction/02-private-inputs/tutorial.mdx")
  ),
  C0S2: dynamic(
    () => import("src/tutorials/01-introduction/03-private-output/tutorial.mdx")
  ),
};
