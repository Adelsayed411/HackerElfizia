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
    dir: 'rtl',
    // الاحتفاظ باللينك المخصص لو مبعوت، أو لينك المنصة الافتراضي
    data: payload.data || { url: 'https://adelsayed411.github.io/HackerElfizia/' }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// برمجة زرار الإشعار (ميزة الـ Focus بس لمنع تكرار التابات لمنصة الصفحة الواحدة)
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // قفل رسالة الإشعار
  
  const targetUrl = event.notification.data && event.notification.data.url 
    ? event.notification.data.url 
    : 'https://adelsayed411.github.io/HackerElfizia/';
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      // بندور: هل الطالب فاتح المنصة أصلاً؟
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        
        // لو فاتح المنصة، هاتها قدام عينه (Focus) وماتفتحش تاب جديدة
        if (client.url.includes("HackerElfizia") && 'focus' in client) {
          return client.focus(); 
        }
      }
      
      // لو مش فاتح المنصة خالص، افتح تاب جديدة
      return clients.openWindow(targetUrl);
    })
  );
});