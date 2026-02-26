// الكود ده بنحطه عشان يسبق فايربيز ويفتح اللينك الصح لمنصة هكر الفيزياء
self.addEventListener('notificationclick', function(event) {
  event.stopImmediatePropagation(); // بنوقف فايربيز إنه يفتح اللينك الغلط
  event.notification.close(); // بنقفل رسالة الإشعار
  
  // اللينك الصح اللي هيفتح للطالب
  const targetUrl = 'https://adelsayed411.github.io/HackerElfizia/';
  
  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});

// استدعاء مكتبات فايربيز للعمل في الخلفية
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// بيانات موقعك
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

// كود استقبال الإشعار وإظهاره للطالب في الخلفية
messaging.onBackgroundMessage(function(payload) {
  console.log('وصل إشعار جديد في الخلفية!', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'logo.png', // اللوجو المربع بتاعك
    badge: 'logo.png',
    dir: 'rtl'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});