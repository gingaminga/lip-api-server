/* eslint-disable @typescript-eslint/no-var-requires */
import admin from "firebase-admin";

const config = require("../firebase-config.json");

export const FcmAdmin = admin.initializeApp({
  credential: admin.credential.cert(config),
});
