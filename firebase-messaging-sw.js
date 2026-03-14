// ==========================================
// 1. كود التخزين (Offline Mode - Cache) - النسخة V2
// ==========================================
// 💡 زودنا رقم الإصدار لـ v2 عشان المتصفح يحس بالتحديثات
const CACHE_NAME = 'hacker-elfizia-v2';
const urlsToCache = [
  '/HackerElfizia/',
  '/HackerElfizia/index.html',
  '/HackerElfizia/style.css',
  '/HackerElfizia/script.js',
  '/HackerElfizia/logo.png',
  '/HackerElfizia/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('تم تخزين ملفات المنصة بنجاح - V2!');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // مسح الكاش القديم
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request).then(response => {
      // 💡 التحسين العبقري: نتأكد إن الرد سليم 100% قبل ما نخزنه عشان منخزنش صفحة Error
      if (response && response.status === 200 && response.type === 'basic') {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
      }
      return response;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});

// ==========================================
// 2. كود الإشعارات بتاع فايربيز 
// ==========================================
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage(function(payload) {
  console.log('وصل إشعار جديد في الخلفية!', payload);
  
  // 💡 حماية قوية: لو فايربيز بعت الداتا من غير notification مش هيكراش
  const notificationTitle = payload.notification?.title || payload.data?.title || "تحديث جديد من هكر الفيزياء ⚡";
  
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "اضغط هنا لمعرفة التفاصيل.",
    // 💡 تعديل المسارات عشان GitHub Pages
    icon: '/HackerElfizia/logo.png', 
    badge: '/HackerElfizia/logo.png',
    dir: 'rtl',
    data: payload.data || { url: 'https://adelsayed411.github.io/HackerElfizia/' }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); 
  
  const targetUrl = event.notification.data && event.notification.data.url 
    ? event.notification.data.url 
    : 'https://adelsayed411.github.io/HackerElfizia/';
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        
        // 💡 استخدام مسار أدق عشان ميعملش فوكس لصفحة تانية بالغلط
        if (client.url.includes("/HackerElfizia/") && 'focus' in client) {
          return client.focus(); 
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});