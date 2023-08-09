/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {initializeApp} from "firebase-admin/app";
import {FieldValue, getFirestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {EventQueryOptions, ThirdwebSDK} from "@thirdweb-dev/sdk";
import {AwsSecretsManagerWallet} from
  "@thirdweb-dev/wallets/evm/wallets/aws-secrets-manager";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export type VerifyResponse = {
  code?: string;
  message?: string;
  detail?: string;
  status?: number;
};

initializeApp();

const wallet = new AwsSecretsManagerWallet({
  secretId: "{{secret-id}}", // ID of the secret value
  secretKeyName: "{{secret-key-name}}", // Name of the secret value
  awsConfig: {
    region: "us-east-1", // Region where your secret is stored
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
});

const tokenAddress = "0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B";
const wldEndpoint = process.env.NEXT_PUBLIC_WLD_API_BASE_URL;
const appEndpoint = process.env.NEXT_PUBLIC_WLD_APP_ID;
const verifyEndpoint = `${wldEndpoint}/api/v1/verify/${appEndpoint}`;
const thirdSecreKey = process.env.THIRDWEB_SECRET_KEY;

export const verify = onCall(async (req) => {
  if (!req.auth) {
    throw new HttpsError("failed-precondition", "The function must be " +
            "called while authenticated.");
  }
  const reqBody = {
    nullifier_hash: req.data.nullifier_hash,
    merkle_root: req.data.merkle_root,
    proof: req.data.proof,
    credential_type: req.data.credential_type,
    action: req.data.action,
    signal: req.data.signal,
  };
  logger.info("Sending request to World ID /verify endpoint:\n", reqBody);
  fetch(verifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  }).then((verifyRes) => {
    verifyRes.json().then(async (wldResponse) => {
      console.log(
        `Received ${verifyRes.status} response from /verify endpoint:\n`,
        wldResponse
      );
      if (verifyRes.status == 200) {
        const iviSnap = await getFirestore()
          .collection("ivis")
          .where("wallet", "==", reqBody.signal)
          .get();
        if (iviSnap.empty) {
          await getFirestore()
            .collection("ivis")
            .add({
              wallet: reqBody.signal,
              nullifier_hash: reqBody.nullifier_hash,
              merkle_root: reqBody.merkle_root,
              proof: reqBody.proof,
              credential_type: reqBody.credential_type,
              vTime: FieldValue.serverTimestamp(),
              authorised: false,
              minted: false,
            })
          ;
        }
        console.log(
          "Credential verified! This user's nullifier hash is: ",
          wldResponse.nullifier_hash
        );
        return ({
          status: 200,
          message: "Verified",
          detail: "This action verified correctly!",
        });
      } else {
        throw new HttpsError(wldResponse.code, "Not", wldResponse.detail);
      }
    });
  });
});

export const claim = onCall(async (req)=> {
  if (!req.auth) {
    throw new HttpsError("failed-precondition", "The function must be " +
            "called while authenticated.");
  }
  const address = req.data.address;
  const iviSnap = await getFirestore()
    .collection("ivis")
    .where("wallet", "==", address)
    .where("minted", "==", false)
    .get();
  if (!iviSnap.empty) {
    const authorised = iviSnap.docs[0].data().authorised;
    if (authorised) {
      return {signature: iviSnap.docs[0].data().signature};
    } else {
      const sdk = await ThirdwebSDK.fromWallet(wallet, "optimism", {
        secretKey: thirdSecreKey,
      });
      const contract = await sdk.getContract(tokenAddress);
      try {
        const mintSignature = await contract.erc20.signature.generate({
          to: address,
          quantity: 1000,
          price: 0,
          mintStartTime: new Date(0),
        });
        await iviSnap.docs[0].ref
          .update({signature: mintSignature, authorised: true});
        return {signature: mintSignature};
      } catch (err) {
        throw new HttpsError("invalid-argument", "Was unable to sign");
      }
    }
  } else {
    throw new HttpsError("permission-denied", "Not verified or minted already");
  }
});

exports.tally = onSchedule("0 * * * *", async () => {
  const tally = await getFirestore()
    .collection("admin")
    .doc("tally")
    .get();
  const startBlock = tally.data()?.latest + 1;
  const eventName = "TokensMinted";
  const sdk = await ThirdwebSDK.fromWallet(wallet, "optimism", {
    secretKey: thirdSecreKey,
  });
  const contract = await sdk.getContract(tokenAddress);
  const options: EventQueryOptions = {
    fromBlock: startBlock,
    toBlock: "latest",
    order: "desc",
    filters: {
      to: ";o",
      foid: "dz",
    }
  };
  const events = await contract.events.getEvents(eventName, options);
  const latestBlock = events[0].transaction.blockNumber;
  const newClaims = events.length;
  await tally.ref.update({
    latest: latestBlock, claims: FieldValue.increment(newClaims),
  });
  logger.log("Finished daily tally");
});
