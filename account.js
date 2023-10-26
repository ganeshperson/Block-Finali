const StellarSdk = require("stellar-sdk");

const keyPair = StellarSdk.Keypair.random();

console.log("Public Key:", keyPair.publicKey());
console.log("Secret Key:", keyPair.secret());
