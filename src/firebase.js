import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBRd7V3IXtUjLoamAD8rqIKiN-lktzB1d0",
  authDomain: "theiristoken.firebaseapp.com",
  projectId: "theiristoken",
  storageBucket: "theiristoken.appspot.com",
  messagingSenderId: "5083487111",
  appId: "1:5083487111:web:e75910c394f45ce8d89122"
};

const Firebase = initializeApp(firebaseConfig);

export default Firebase;