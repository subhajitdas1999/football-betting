import { createConfig, http } from "wagmi";
import { polygonMumbai } from "wagmi/chains";

export const defaultWagmiConfig = createConfig({
  chains: [polygonMumbai],
  transports: {
    [polygonMumbai.id]: http(),
  },
});
