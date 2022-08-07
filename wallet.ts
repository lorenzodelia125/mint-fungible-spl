import * as web3 from "@solana/web3.js";
import * as fs from "fs";

// connessione all'endpoint di solana tramite RPC
const endpoint = "https://api.devnet.solana.com";
const connection = new web3.Connection(endpoint);

// creazione di un nuovo keypair
const keypair = web3.Keypair.generate();
console.log("New account public key: " + keypair.publicKey + " \n");

// salvataggio della secret key in un file json
const secret_array = keypair.secretKey
  .toString()
  .split(",")
  .map((value) => Number(value));

const secret = JSON.stringify(secret_array);

fs.writeFile("keypair.json", secret, "utf8", function (err) {
  if (err) throw err;
  console.log("Wrote secret key to keypair.json. \n");
});

(async () => {
  try {
    const txId = await connection.requestAirdrop(
      keypair.publicKey,
      1 * web3.LAMPORTS_PER_SOL
    );
    console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet \n`);
  } catch (err) {
    console.log(err);
  }
})();
