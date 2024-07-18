const admin = require("firebase-admin");

const serviceAccount = require("./file-cloud-fast-flow-firebase-adminsdk-sf88s-eb357ead3e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://file-cloud-fast-flow.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = bucket;
