import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB_68SDgjUhC0Z2kkdITPYak2jR90vKD1c",
    authDomain: "putsch-event-hub.firebaseapp.com",
    projectId: "putsch-event-hub",
    storageBucket: "putsch-event-hub.appspot.com",
    messagingSenderId: "688249934864",
    appId: "1:688249934864:web:ba5c04b3a43f108d956695"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const putschFirestore = getFirestore(app);
