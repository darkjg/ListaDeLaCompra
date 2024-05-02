// Import the functions you need from the SDKs you need

//import { initializeApp } from "firebase/app";

const {initializeApp} = require("firebase/app")
const {getAuth} = require("firebase/auth")
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app"s Firebase configuration
const path = require("path");
require("dotenv").config( {path:path.resolve( ".env")} );

const firebaseConfig = {
  projectId: process.env.PROJECTID,
  apiKey: process.env.APIKEY,

  authDomain: process.env.AUTHDOMAIN,

 

  storageBucket: process.env.STORAGEBUCKET,

  messagingSenderId: process.env.MESSAGINGSENDERID,

  appId: process.env.APPID,

  client_email: "261334464898-67iero836riph0to3jt5u05rb0g8mcsk.apps.googleusercontent.com",



};


// Initialize Firebase

const Firebase = initializeApp(firebaseConfig);
const auth = getAuth(Firebase);
module.exports = Firebase