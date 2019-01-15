import Rebase from "re-base";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC18dOC6_45XyJXzgZdHHcd28mSuAmERUg",
  authDomain: "catch-of-the-day-jun.firebaseapp.com",
  databaseURL: "https://catch-of-the-day-jun.firebaseio.com"
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };
export default base;
