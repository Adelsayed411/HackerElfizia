// استدعاء مكتبات فايربيز
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging.js";

// بيانات قاعدة بيانات موقعك
const firebaseConfig = {
  apiKey: "AIzaSyD3RlyAtObwMMyeZz4ghYdhxHd3H2JTonY",
  authDomain: "hacker-5ca96.firebaseapp.com",
  projectId: "hacker-5ca96",
  storageBucket: "hacker-5ca96.firebasestorage.app",
  messagingSenderId: "453811300864",
  appId: "1:453811300864:web:0a5e2e41c220434d5806e5",
  measurementId: "G-SDVYMK9130"
};

// تشغيل فايربيز
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// طلب إذن الإشعارات من الطالب
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log('الطالب وافق على الإشعارات ✅');
    
    // جلب التوكن باستخدام المفتاح السري (VAPID)
    getToken(messaging, { vapidKey: 'BDIuTA2wSM7eGN3bTv4IRbcLbXvW1FZL5qjXy3dyKkmpPT_wVoT1C7W0xd16JRmB6zUMYqznhdpF9ytg1mI4BsU' })
    .then((currentToken) => {
      if (currentToken) {
        console.log('تم ربط الطالب بنجاح! التوكن:', currentToken);
      } else {
        console.log('مفيش توكن متاح.');
      }
    }).catch((err) => {
      console.log('خطأ في الإشعارات: ', err);
    });
  } else {
    console.log('الطالب رفض الإشعارات ❌');
  }
});

// استقبال الإشعار والموقع مفتوح
onMessage(messaging, (payload) => {
  console.log('وصل إشعار والموقع مفتوح:', payload);
  alert(`🔔 هكر الفيزياء:\n\n${payload.notification.title}\n${payload.notification.body}`);
});