const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {FieldValue, getFirestore} = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");
const {ThirdwebSDK} = require("@thirdweb-dev/sdk");
const {defineString, defineSecret} = require("firebase-functions/params");
const {onSchedule} = require("firebase-functions/v2/scheduler");

initializeApp();

const token = defineString("TOKEN_ADDRESS");
const wldEnd = defineString("PUBLIC_WLD_API_BASE_URL");
const appEnd = defineString("PUBLIC_WLD_APP_ID");
const verifyEndpoint = `${wldEnd.value()}/api/v1/verify/${appEnd.value()}`;
const thirdSecret = defineString("THIRDWEB_SECRET_KEY");
const chain = defineString("CHAIN_STRING");
const secretKey = defineSecret("SECRET_KEY");

const verifyOptions = {
  cors: [/theiristoken\.com$/, /theiristoken\.web\.app$/, "http://localhost:3000"],
};
const claimOptions = {
  cors: [/theiristoken\.com$/, /theiristoken\.web\.app$/, "http://localhost:3000"],
  secrets: [secretKey],
};

const sign = async (secret, address, now) =>{
  const third = ThirdwebSDK.fromPrivateKey(
      secret,
      chain.value(),
      {secretKey: thirdSecret.value()},
  );
  const contract = await third.getContract(token.value());
  const start = 1692100800000;
  const amount = evaluate(now-start);
  const signature = await contract.erc20.signature.generate({
    to: address,
    quantity: amount.toFixed(18),
    price: 0,
    mintEndTime: now + 7*24*3600*1000,
  }).catch((e)=>console.log(e));
  console.log("sig", signature);
  return signature;
};

const evaluate = (d)=>{
  const p = 10262.502185213996;
  const a = 3600*24;
  const value = 1000 + 10000000*(Math.log((d/a)+p)/((d/a)+p));
  return value;
};

exports.verify = onRequest(verifyOptions, async (req, res) => {
  console.log("body", req.body, "proof babes", req.body.proof);
  const reqBody = {
    nullifier_hash: req.body.nullifier_hash,
    merkle_root: req.body.merkle_root,
    proof: req.body.proof,
    credential_type: req.body.credential_type,
    action: req.body.action,
    signal: req.body.signal,
  };
  logger.info("Sending request to World ID /verify endpoint:\n", reqBody);
  logger.info("verification endpoint\n", verifyEndpoint);
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
          wldResponse,
      );
      if (verifyRes.status == 200) {
        const iviDoc = await getFirestore()
            .collection("ivis")
            .doc(reqBody.signal)
            .get();
        if (!iviDoc.exists) {
          await getFirestore()
              .collection("ivis")
              .doc(reqBody.signal)
              .set({
                wallet: reqBody.signal,
                nullifier_hash: reqBody.nullifier_hash,
                merkle_root: reqBody.merkle_root,
                proof: reqBody.proof,
                credential_type: reqBody.credential_type,
                verification_time: FieldValue.serverTimestamp(),
                reserved: false,
                minted: false,
              });
          res.status(200).send({
            code: "success",
            detail: "This user is verified correctly!",
          });
        } else {
          console.log(
              "User already verified",
              wldResponse.nullifier_hash,
          );
          res.status(201).send({
            code: "already",
            detail: "This user has already verified!",
          });
        }
      } else {
        res.status(verifyRes.status)
            .send({code: wldResponse.code, detail: wldResponse.detail});
      }
    });
  });
});

exports.claim = onRequest(claimOptions, async (req, res)=> {
  const address = req.body.address;
  if (!address) {
    res.status(403).send({
      code: "forbidden",
      detail: "Wallet problem, try again!",
    });
    return;
  }
  const now = Date.now();
  const start = 1692100800000;
  if (now<start) {
    res.status(403).send({
      code: "too-early",
      detail: "Too early, come back later!",
    });
    return;
  }
  const iviSnap = await getFirestore()
      .collection("ivis")
      .doc(address)
      .get();
  if (iviSnap.exists) {
    const minted = iviSnap.data().minted;
    const reserved = iviSnap.data().reserved;
    const reserveEnd = iviSnap.data().reserve_end;
    const signature = iviSnap.data().signature;
    const preFail = minted === undefined ||
    reserved === undefined ||
    ((reserved === false) && minted === true) ||
    ((reserved === true) && (!reserveEnd || !signature));
    const validReserve = (reserved === true) &&
    (reserveEnd > now) &&
    (minted === false);
    if (preFail) {
      res.status(400).send({
        code: "unknown",
        detail: "Oops! Your status is unknown. Contact support.",
      });
    } else if (minted === true) {
      res.status(401).send({
        code: "already",
        detail: "You already minted TiTs",
      });
    } else if (validReserve) {
      res.status(200).send({signature: JSON.parse(signature)});
    } else {
      const secret = secretKey.value();
      const newSig = await sign(secret, address, now);
      if (!newSig) {
        res.status(403).send({
          code: "no-sig",
          detail: "Oops! There was an error. Try again.",
        });
      } else {
        let reservePossible;
        try {
          const tallyRef = getFirestore().collection("admin").doc("tally");
          reservePossible = await getFirestore()
              .runTransaction(async (t) => {
                const tallySnap = await t.get(tallyRef);
                const mints = tallySnap.data().mints;
                const reserves = tallySnap.data().reserves;
                const reservePossible = (mints+reserves)<1000000;
                if (reservePossible) {
                  t.update(tallyRef, {
                    reserves: FieldValue.increment(1),
                  });
                }
                return reservePossible;
              });
          console.log("trans success", reservePossible);
        } catch (e) {
          res.status(407).send({
            code: "failed-transaction",
            detail: "Oops! There was an error. Try again.",
          });
        }
        if (reservePossible) {
          iviSnap.ref.update({
            signature: JSON.stringify(newSig),
            reserved: true,
            reserve_time: FieldValue.serverTimestamp(),
            reserve_end: now + 7*24*3600*1000,
          }).then(()=>{
            res.status(201).send({signature: newSig});
          }).catch((e)=>{
            console.log("failed to update", e);
            res.status(403).send({
              code: "update-failed",
              detail: "Oops! There was an error. Try again.",
            });
          });
        } else {
          res.status(406).send({
            code: "overbooked",
            detail: "Oops! We are fully reserved. Try again later.",
          });
        }
      }
    }
  } else {
    res.status(404).send({
      code: "not-found",
      detail: "Oops! you're not an iVI.",
    });
  }
});

exports.tally = onSchedule("0 * * * *", async (event) => {
  const tallySnap = await getFirestore()
      .collection("admin")
      .doc("tally")
      .get();
  const tallyBlock = tallySnap.data().latest_block;
  const tallyExp = tallySnap.data().latest_expiry;
  console.log(tallyBlock, tallyExp);
  const readOnly = new ThirdwebSDK(
      chain.value(),
      {secretKey: thirdSecret.value()},
  );
  const contract = await readOnly.getContract(token.value());
  const eventName = "TokensMintedWithSignature";
  const options = {
    fromBlock: tallyBlock + 1,
    toBlock: "latest",
    order: "desc",
  };
  const events = await contract.events.getEvents(eventName, options);
  const newMints = events.length;
  if (newMints<1) {
    console.log("no new events");
    return;
  }
  const latestBlock = events[0].transaction.blockNumber;
  console.log(newMints, latestBlock);
  console.log("events", events[0]);
  for (let i = 0; i < newMints; i++) {
    const mintedTo = events[i].data.mintedTo;
    const iviSnap = await getFirestore()
        .collection("ivis")
        .doc(mintedTo)
        .get();
    if (iviSnap.exists) {
      await iviSnap.ref.update({
        minted: true,
        mint_time: FieldValue.serverTimestamp(),
      });
    } else {
      await getFirestore()
          .collection("admin")
          .doc("tally")
          .collection("issues")
          .add({
            adress: mintedTo,
            timestamp: FieldValue.serverTimestamp(),
          });
    }
  }
  const now = Date.now();
  const expiredSnap = await getFirestore()
      .collection("ivis")
      .where("minted", "==", false)
      .where("reserve_end", "<=", now)
      .where("reserve_end", ">", tallyExp)
      .get();
  const expiredReserves = expiredSnap.docs.length;
  await tallySnap.ref.update({
    latest_block: latestBlock,
    latest_expiry: now,
    reserves: FieldValue.increment((newMints + expiredReserves)*(-1)),
    mints: FieldValue.increment(newMints),
  });
});
