const firebase = require("firebase/app");
require("firebase/analytics");

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC8YcDgyqBnsL0YP_UhGTaDy1UpmXrtbmE",
  authDomain: "file-cloud-fast-flow.firebaseapp.com",
  projectId: "file-cloud-fast-flow",
  storageBucket: "file-cloud-fast-flow.appspot.com",
  messagingSenderId: "407545187448",
  appId: "1:407545187448:web:29e6d7d6f1a0c3e038f18d",
  measurementId: "G-88KR1Q325M",
};

// Khởi tạo Firebase
const app = firebase.initializeApp(firebaseConfig);

// Kích hoạt Analytics
if ("measurementId" in firebaseConfig) {
  firebase.analytics();
}

module.exports = app;
