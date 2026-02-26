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

// كود استقبال الإشعار وإظهاره للطالب
messaging.onBackgroundMessage(function(payload) {
  console.log('وصل إشعار جديد في الخلفية!', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'logo.png', // اللوجو المربع بتاعك هيظهر في الإشعار
    badge: 'logo.png',
    dir: 'rtl',
    // الجزء ده هو اللي بيحفظ لينك المنصة الصح عشان نفتحه لما الطالب يدوس
    data: {
      url: 'https://adelsayed411.github.io/HackerElfizia/'
    }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// الكود ده بيشتغل أول ما الطالب يدوس على الإشعار
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // يقفل رسالة الإشعار
  
  // يجيب اللينك الصح اللي حفظناه فوق، ولو مش موجود يفتح اللينك الافتراضي
  const targetUrl = event.notification.data && event.notification.data.url 
    ? event.notification.data.url 
    : 'https://adelsayed411.github.io/HackerElfizia/';
    
  event.waitUntil(
    clients.openWindow(targetUrl) // يفتح اللينك للطالب في تاب جديدة
  );
});