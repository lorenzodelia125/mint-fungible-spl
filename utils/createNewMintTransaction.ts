import {
  Transaction,
  SystemProgram,
  Keypair,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import {
  createCreateMetadataAccountV2Instruction,
  DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import { findMetadataPda, UploadMetadataInput } from "@metaplex-foundation/js";
import { MintConfig } from "../mint";

export const createNewMintTransaction = async (
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  destinationWallet: PublicKey,
  mintConfig: MintConfig,
  onChainMetadata: DataV2
) => {
  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  // PDA che contiene i metadati del token, il seed del PDA è la public key
  // del Token Mint Account
  const metadataPDA = findMetadataPda(mintKeypair.publicKey);

  // l'associated token account in cui saranno mintati i token
  // derivato dal mint e dall'account di destinazione
  const destinationATA = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    destinationWallet
  );

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      mintConfig.numDecimals,
      payer.publicKey,
      payer.publicKey,
      TOKEN_PROGRAM_ID
    ),
    createAssociatedTokenAccountInstruction(
      payer.publicKey,
      destinationATA,
      payer.publicKey,
      mintKeypair.publicKey
    ),
    createMintToInstruction(
      mintKeypair.publicKey,
      destinationATA,
      payer.publicKey,
      mintConfig.numberTokens * Math.pow(10, mintConfig.numDecimals)
    ),
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPDA,
        mint: mintKeypair.publicKey,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
      },
      {
        createMetadataAccountArgsV2: {
          data: onChainMetadata,
          isMutable: true,
        },
      }
    )
  );

  return transaction;
};
