// ✅ Use Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjhrESUn4rapw_FITwI58ok_W1Qivph9c",
  authDomain: "technicianclockinapp.firebaseapp.com",
  projectId: "technicianclockinapp",
  storageBucket: "technicianclockinapp.appspot.com",
  messagingSenderId: "938895818704",
  appId: "1:938895818704:web:2d4d1c182897e31169c3d5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// ✅ Show Sign-Up Form
window.showSignUp = function () {
  document.getElementById("login").style.display = "none";
  document.getElementById("signup-section").style.display = "block";
};

// ✅ Show Login Form
window.showLogin = function () {
  document.getElementById("signup-section").style.display = "none";
  document.getElementById("login").style.display = "block";
};

// ✅ User Login
// ✅ User Login
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      currentUser = userCredential.user;
      document.getElementById("login").style.display = "none";
      document.getElementById("signup-section").style.display = "none";
      document.getElementById("clock-in-out").style.display = "block";
      document.getElementById("user-name").textContent = currentUser.email;
      console.log("Logged in as:", currentUser.uid);
    })
    .catch((error) => {
      console.error("Login failed:", error.code, error.message);
      alert(`Login failed: ${error.message}`);
    });
};

// ✅ User Signup
// ✅ User Signup
window.signup = function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { email: user.email });
      alert("User created successfully! Now log in.");
      showLogin();
    })
    .catch((error) => {
      console.error("Error signing up:", error.code, error.message);
      alert(`Error signing up: ${error.message}`);
    });
};

// ✅ Clock In Function
window.clockIn = function () {
  logEvent("clock-in");
};

// ✅ Clock Out Function
window.clockOut = function () {
  logEvent("clock-out");
};

// ✅ Log Event to Firestore
function logEvent(type) {
  if (!currentUser) {
    alert("User not logged in!");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        await addDoc(collection(db, "logs"), {
          userId: currentUser.uid,
          type: type,
          timestamp: serverTimestamp(),
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });

        document.getElementById("status").textContent = `${type} successful!`;
      } catch (error) {
        console.error("Error saving log:", error);
        document.getElementById("status").textContent = `${type} failed!`;
      }
    },
    (error) => {
      console.error("Error getting location:", error);
      document.getElementById("status").textContent = "Failed to get location!";
    }
  );
}
