import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: your key,
  authDomain: y,
  projectId: ,
  storageBucket: ,
  messagingSenderId: ,
  appId: 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB=getFirestore(app);
const auth=getAuth(app);

export{fireDB,auth}
