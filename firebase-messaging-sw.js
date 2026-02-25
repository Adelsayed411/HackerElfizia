// استدعاء مكتبات فايربيز للعمل في الخلفية
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// بيانات موقعك (اللي إنت لسه جايبها)
firebase.initializeApp({
  apiKey: "AIzaSyD3RlyAtObwMMyeZz4ghYdhxHd3H2JTonY",
  authDomain: "hacker-5ca96.firebaseapp.com",
  projectId: "hacker-5ca96",
  storageBucket: "hacker-5ca96.firebasestorage.app",
  messagingSenderId: "453811300864",
  appId: "1:453811300864:web:0a5e2e41c220434d5806e5",
  measurementId: "G-SDVYMK9130"
});

const messaging = firebase.messaging();

// كود استقبال الإشعار وإظهاره للطالب
messaging.onBackgroundMessage(function(payload) {
  console.log('وصل إشعار جديد في الخلفية!', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'logo.png', // اللوجو المربع بتاعك هيظهر في الإشعار
    badge: 'logo.png',
    dir: 'rtl'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});