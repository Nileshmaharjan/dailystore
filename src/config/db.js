// import Firebase from 'firebase'
import * as firebase from "firebase";
import store from "../store";
let config = {
    apiKey: "AIzaSyCxanjm619HjwAVl2-pH9ozZUb9NExMGuU",
    authDomain: "mart-31be8.firebaseapp.com",
    databaseURL: "https://mart-31be8.firebaseio.com",
    projectId: "mart-31be8",
    storageBucket: "mart-31be8.appspot.com",
    messagingSenderId: "1065904905155",
    appId: "1:1065904905155:web:1ae72a0f48f7fdab2c7b76",
    measurementId: "G-QSLW26D634"
};
let app = firebase.initializeApp(config);
export const db = app.firestore()


firebase.auth().onAuthStateChanged(user => {
    store.dispatch("fetchUser", user);
});

