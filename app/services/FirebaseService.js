const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore/lite");

const firebaseConfig = {
  apiKey: "AIzaSyBfl8oVNNZhgd369V2xuXeQDZuf0gd5A80",
  authDomain: "email-tracker-1b98e.firebaseapp.com",
  projectId: "email-tracker-1b98e",
  storageBucket: "email-tracker-1b98e.appspot.com",
  messagingSenderId: "283614079692",
  appId: "1:283614079692:web:4311e6e31917ad0676b069"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
  app: app,
  db: db
};