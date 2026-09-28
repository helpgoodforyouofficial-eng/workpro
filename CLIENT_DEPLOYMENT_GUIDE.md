# 🚀 EASY BILL GENERATOR — CLIENT & DEPLOYMENT GUIDE

Aap ka software bilkul **Clean, Simple aur Portable (Asaan)** banaya gaya hai. Na koi mushkil configuration hai aur na hi koi extra complicated SaaS code jo aap ko samjh na aaye.

---

## 1. 📁 Architecture (Frontend + Firebase Backend)
- **Frontend**: Pure HTML, CSS, JavaScript (React wrapper for app shell).
- **Backend & Database**: Firebase Auth (User Authentication) + Firebase Cloud Firestore (Real-time Database).
- **Offline Ready**: PWA (Service Worker `sw.js` + Firestore Offline Persistence). Internet na hone par bhi stock aur bills access rehte hain.

---

## 2. 🛡️ Security & Anti-Hack (Tahafuz)
Aap ke database ko hack ya data leak se bachane ke liye `firestore.rules` file banayi gayi hai:
- Koi bhi ghair-mutaliqa shakhs kisi doosray user ya agency ka data na parh sakta hai aur na hi delete kar sakta hai.
- **Rule Principle**:
  - `users`: Sirf authenticated user apna profile dekh/update kar sakta hai.
  - `stock`, `bills`, `customers`: Har shop/agency ka data uski apni `agencyId` ya `userId` ke sath lock hota hai.
  - Direct URL access se koi doosra user kisi ka bill ya customer nahi dekh sakta.

---

## 3. 🌐 Kisi Bhi Naye Client ya PC / Hosting Par Upload Karne Ka Tariqa
Agar aap ko kisi client ke PC, local host, ya naye Netlify/Vercel par deploy karna ho:
1. Naye Firebase project se `firebase-config.js` mein sirf **6 keys** update karein:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "your-app.firebaseapp.com",
       projectId: "your-app",
       storageBucket: "your-app.firebasestorage.app",
       messagingSenderId: "...",
       appId: "..."
   };
   ```
2. Netlify par repo connect karein aur deploy kar dein — bina kisi build problem ke live chalega!
3. Firebase console mein ja kar `firestore.rules` paste kar dein ta k data safe rahay.

---

## 4. 📝 Naye Bill Designs & Checkboxes Ka Tariqa
- Har naye bill design ke sath shopkeeper/admin ko **Settings / Profile** mein dropdown aur checkboxes milenge.
- Admin apni marzi se check/uncheck karega (maslan: Logo dikhana hai ya nahi, Purana Udhaar print karna hai ya nahi, Salesman ka naam print karna hai ya nahi).
- Jo checkbox uncheck hoga, wo bill par print nahi hoga!
