const express = require("express");
const bodyParser = require("body-parser");
const StellarSdk = require("stellar-sdk");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

app.get("/balance", async (req, res) => {
  try {
    const publicKey = req.query.publicKey;
    const account = await server.loadAccount(publickey);
    const balances = account.balances;
    balances.map((bal) => {
      if (bal.asset_code === "block") {
        res.json({ balance: bal.balance });
      } else {
      }
    });

    // Check for the balance of the custom token (asset with code "BLOCK")458
    // const balance = account.balances.find((b) => b.asset_code === "BLOCK");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching balance" });
  }
});

app.post("/transfer", async (req, res) => {
  try {
    const { senderSecretKey, receiverPublicKey, amount } = req.body;
    const senderAccount = await server.loadAccount(senderSecretKey);
    // Create a payment operation with the custom token (asset with code "BLOCK")
    const transaction = new StellarSdk.TransactionBuilder(senderAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: receiverPublicKey,
          asset: new StellarSdk.Asset("BLOCK", senderSecretKey), // Specify custom token asset
          amount: amount.toString(),
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(StellarSdk.Keypair.fromSecret(senderSecretKey));
    const result = await server.submitTransaction(transaction);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error transferring tokens" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to Custom Token Management API");
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
