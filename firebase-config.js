/* ──────────────────────────────────────────────────────────────
   Firebase Configuration — Like Counter + Game High Scores
   ──────────────────────────────────────────────────────────────
   Setup:
   1. Buka https://console.firebase.google.com
   2. Buat project baru (atau pilih yang sudah ada)
   3. Klik "Realtime Database" → "Create Database" → pilih region
      → Start in TEST MODE (untuk sekarang)
   4. Buka Project Settings → "Your apps" → tambah Web app (</>)
   5. Copy nilai config ke bawah (ganti YOUR_... dengan nilai asli)
   6. Di Realtime Database → Rules, paste aturan ini:
      {
        "rules": {
          "portfolio": {
            "likes": {
              ".read": true,
              ".write": true
            }
          },
          "game": {
            "highscores": {
              ".read": true,
              ".write": true
            }
          }
        }
      }
────────────────────────────────────────────────────────────── */

const _firebaseConfig = {
  apiKey:            "AIzaSyC9Url5iivEx3Q7aijP3cVeiVIvz3K0D1I",
  authDomain:        "portfolio-ihsan.firebaseapp.com",
  databaseURL:       "https://portfolio-ihsan-default-rtdb.firebaseio.com",
  projectId:         "portfolio-ihsan",
  storageBucket:     "portfolio-ihsan.firebasestorage.app",
  messagingSenderId: "600674672867",
  appId:             "1:600674672867:web:5a7733b61f0e30c6aee5d6"
};

// Hanya inisialisasi jika config sudah diisi (bukan placeholder)
if (
  typeof firebase !== 'undefined' &&
  _firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  _firebaseConfig.databaseURL.indexOf('YOUR_PROJECT') === -1
) {
  firebase.initializeApp(_firebaseConfig);
  window._firebaseDB = firebase.database();
  console.log('[Firebase] Like counter connected ✓');
}
