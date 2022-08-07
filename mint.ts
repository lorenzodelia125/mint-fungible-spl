import { Transaction, Keypair, Connection } from "@solana/web3.js";
import secret from "./keypair.json";
import { createNewMintTransaction } from "./utils/createNewMintTransaction";
import { uploadMetadata } from "./utils/uploadMetadata";
import {
  endpoint,
  MINT_CONFIG,
  ON_CHAIN_METADATA,
  TOKEN_METADATA,
} from "./common/constants";

const connection = new Connection(endpoint);

const main = async () => {
  console.log("STEP 1: Uploading MetaData");
  const userWallet = Keypair.fromSecretKey(new Uint8Array(secret));
  let metadataUri = await uploadMetadata(
    endpoint,
    connection,
    userWallet,
    TOKEN_METADATA
  );
  ON_CHAIN_METADATA.uri = metadataUri;

  console.log("\nSTEP 2: Creating Mint Transaction");
  let mintKeypair = Keypair.generate();
  console.log("New Token Mint Address: " + mintKeypair.publicKey.toString());

  const newMintTransaction: Transaction = await createNewMintTransaction(
    connection,
    userWallet,
    mintKeypair,
    userWallet.publicKey,
    MINT_CONFIG,
    ON_CHAIN_METADATA
  );

  console.log("\nSTEP 3: Executing Mint Transaction");
  const transactionId = await connection.sendTransaction(newMintTransaction, [
    userWallet,
    mintKeypair,
  ]);
  console.log(`Transaction ID: ` + transactionId + " \n");
  console.log(
    `Succesfully minted ${MINT_CONFIG.numberTokens} ${
      ON_CHAIN_METADATA.symbol
    } to ${userWallet.publicKey.toString()}. \n`
  );
  console.log(
    `View Transaction: https://explorer.solana.com/tx/${transactionId}?cluster=devnet \n`
  );
  console.log(
    `View Token Mint: https://explorer.solana.com/address/${mintKeypair.publicKey.toString()}?cluster=devnet`
  );
};

main();
