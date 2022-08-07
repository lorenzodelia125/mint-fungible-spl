import { UploadMetadataInput } from "@metaplex-foundation/js";
import { DataV2 } from "@metaplex-foundation/mpl-token-metadata";
import { MintConfig } from "../../types";

export const endpoint = "https://api.devnet.solana.com";

export const MINT_CONFIG: MintConfig = {
  numDecimals: 6,
  numberTokens: 150,
};

// metadati off-chain
export const TOKEN_METADATA: UploadMetadataInput = {
  name: "<NOME TOKEN>",
  symbol: "<SYMBOL>",
  description: "<DESCRIZIONE>",
  image: "<IMAGE URL>",
};

// metadati on-chain
export const ON_CHAIN_METADATA: DataV2 = {
  name: TOKEN_METADATA.name!,
  symbol: TOKEN_METADATA.symbol!,
  uri: "", // url json off-chain
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};
