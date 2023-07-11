import constants from "@/utils/constants";
import logger from "@/utils/logger";
import admin from "firebase-admin";
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";

const FcmAdmin = admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: constants.FIREBASE.CLIENT_EMAIL,
    privateKey: constants.FIREBASE.PRIVATE_KEY,
    projectId: constants.FIREBASE.PROJECT_ID,
  }),
});

export const FirebaseMessaging = FcmAdmin.messaging();

export const sendMessageFromFirebase = async (message: MulticastMessage) => {
  try {
    await FirebaseMessaging.sendEachForMulticast(message);
  } catch (error) {
    logger.error(error);
  }
};
