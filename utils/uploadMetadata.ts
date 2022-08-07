import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
  UploadMetadataInput,
} from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";

export const uploadMetadata = async (
  endpoint: string,
  connection: Connection,
  keypair: Keypair,
  tokenMetadata: UploadMetadataInput
): Promise<string> => {
  // creazione di un'istanza di metaplex (?)
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypair)) // serve a metaplex per prendersi le fee di upload da pagare
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: endpoint,
        timeout: 60000,
      })
    );

  // upload dei metadati su arweave
  const { uri } = await metaplex.nfts().uploadMetadata(tokenMetadata).run();
  console.log("Arweave URL: " + uri);
  return uri;
};
