// ===== تحميل الإعدادات المحفوظة عند بدء الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    loadDarkMode();
    loadProgress();
    startCountdown();
    checkNewsBarClosed();
});

// ===== الوضع الليلي (Dark Mode) =====
function toggleDarkMode() {
    const body = document.body;
    const icon = document.getElementById('darkModeIcon');
    
    body.classList.toggle('dark-mode');
    
    // تغيير الأيقونة
    if (body.classList.contains('dark-mode')) {
        icon.className = 'fa-solid fa-sun';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        icon.className = 'fa-solid fa-moon';
        localStorage.setItem('darkMode', 'disabled');
    }
}

function loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    const icon = document.getElementById('darkModeIcon');
    
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        icon.className = 'fa-solid fa-sun';
    }
}

// ===== نظام التقدم (Progress Tracker) =====
function updateProgress() {
    const checkboxes = document.querySelectorAll('.lecture-checkbox');
    const totalLectures = checkboxes.length;
    let completedLectures = 0;
    
    // حفظ الحالة وحساب المكتمل
    const progress = {};
    checkboxes.forEach((checkbox, index) => {
        const isChecked = checkbox.checked;
        progress[`lecture-${index + 1}`] = isChecked;
        if (isChecked) {
            completedLectures++;
        }
    });
    
    // حفظ في localStorage
    localStorage.setItem('lectureProgress', JSON.stringify(progress));
    
    // تحديث شريط التقدم
    const percentage = (completedLectures / totalLectures) * 100;
    document.getElementById('progressBar').style.width = percentage + '%';
    document.getElementById('progressText').textContent = 
        `${completedLectures} من ${totalLectures} محاضرات (${Math.round(percentage)}%)`;
}

function loadProgress() {
    const savedProgress = localStorage.getItem('lectureProgress');
    
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const checkboxes = document.querySelectorAll('.lecture-checkbox');
        
        checkboxes.forEach((checkbox, index) => {
            const lectureId = `lecture-${index + 1}`;
            if (progress[lectureId]) {
                checkbox.checked = true;
            }
        });
    }
    
    updateProgress();
}

// ===== العداد التنازلي (Countdown Timer) =====
function startCountdown() {
    // ⚠️ هنا غيّر التاريخ للامتحان القادم
    // الصيغة: new Date('YYYY-MM-DD HH:MM:SS')
    const examDate = new Date('2026-03-15 09:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const diff = examDate - now;
        
        if (diff <= 0) {
            document.getElementById('countdownText').textContent = 'انتهى وقت الامتحان!';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        let countdownText = 'متبقي على امتحان شهر فبراير: ';
        
        if (days > 0) {
            countdownText += `${days} ${days === 1 ? 'يوم' : 'أيام'}`;
        }
        if (hours > 0 || days > 0) {
            countdownText += ` ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
        }
        if (days === 0) {
            countdownText += ` ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
        }
        
        document.getElementById('countdownText').textContent = countdownText;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== شريط الأخبار (News Bar) =====
function closeNewsBar() {
    const newsBar = document.getElementById('newsBar');
    newsBar.style.animation = 'slideUp 0.3s ease';
    
    setTimeout(() => {
        newsBar.style.display = 'none';
    }, 300);
    
    // حفظ في localStorage
    localStorage.setItem('newsBarClosed', 'true');
}

function checkNewsBarClosed() {
    const isClosed = localStorage.getItem('newsBarClosed');
    
    if (isClosed === 'true') {
        document.getElementById('newsBar').style.display = 'none';
    }
}

// إضافة أنيميشن الإغلاق
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== البحث (Search Filter) =====
function searchLectures() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.task-card');
    const clearBtn = document.getElementById('searchClear');
    const noResults = document.getElementById('noResults');
    
    // إظهار/إخفاء زر المسح
    clearBtn.style.display = filter ? 'block' : 'none';
    
    let visibleCount = 0;
    
    cards.forEach(card => {
        const title = card.querySelector('.task-title').textContent.toLowerCase();
        const details = card.querySelector('.task-details').textContent.toLowerCase();
        
        if (title.includes(filter) || details.includes(filter)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // إظهار رسالة عدم وجود نتائج
    if (filter && visibleCount === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

function clearSearch() {
    const input = document.getElementById('searchInput');
    input.value = '';
    searchLectures();
    input.focus();
}

// ===== فتح/إغلاق المحاضرة (Accordion) =====
function toggleTask(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        icon.style.transform = 'rotate(180deg)';
    }
}

// ===== إضافة تأثيرات إضافية =====

// تأثير الكونفيتي عند إكمال كل المحاضرات
function checkAllCompleted() {
    const checkboxes = document.querySelectorAll('.lecture-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    if (allChecked && checkboxes.length > 0) {
        showCelebration();
    }
}

function showCelebration() {
    // يمكن إضافة تأثير الكونفيتي هنا
    alert('🎉 مبروك! أنت أكملت كل المحاضرات! 🎉');
}

// مراقبة التغييرات في الـ checkboxes
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('lecture-checkbox')) {
        checkAllCompleted();
    }
});

// ===== تحسين تجربة المستخدم =====

// منع فتح الرابط عند الضغط على الـ checkbox
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('lecture-checkbox') || 
        e.target.classList.contains('checkbox-label')) {
        e.stopPropagation();
    }
});

// إضافة تأثير الـ smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// =========================================
// برمجة ظهور بانر تحميل التطبيق (PWA)
// =========================================
let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-btn');
const closeBtn = document.getElementById('close-banner-btn');

// الكود ده مش بيشتغل غير لو الطالب "مش محمل" التطبيق
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); 
  deferredPrompt = e; 
  // بنستخدم flex عشان يظهر بنفس تنسيق الـ CSS
  if(installBanner) installBanner.style.display = 'flex'; 
});

// لما الطالب يدوس على زرار "تحميل"
if(installBtn) {
  installBtn.addEventListener('click', async () => {
    installBanner.style.display = 'none'; 
    deferredPrompt.prompt(); 
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`نتيجة التحميل: ${outcome}`);
    deferredPrompt = null;
  });
}

// لما الطالب يدوس على (X) عشان يقفل البانر
if(closeBtn) {
  closeBtn.addEventListener('click', () => {
    installBanner.style.display = 'none';
  });
}

// رسالة تأكيد لو التطبيق نزل بنجاح
window.addEventListener('appinstalled', () => {
  console.log('تم تحميل تطبيق هكر الفيزياء بنجاح! 🚀');
  if(installBanner) installBanner.style.display = 'none';
});

// ===== نصائح مفيدة للتخصيص =====

/*
 * 📝 كيف تغير تاريخ العداد التنازلي؟
 * في السطر 79، غيّر التاريخ:
 * const examDate = new Date('2026-02-28 09:00:00');
 * 
 * 📝 كيف تغير نص شريط الأخبار؟
 * في ملف index.html، السطر 106، غيّر النص داخل:
 * <span id="newsText">هنا النص الجديد</span>
 * 
 * 📝 كيف تضيف محاضرة جديدة؟
 * في ملف index.html:
 * 1. انسخ div.task-card كاملة
 * 2. غيّر data-lecture-id="lecture-4"
 * 3. غيّر id="check-4"
 * 4. غيّر for="check-4"
 * 5. غيّر العنوان والروابط
 * 
 * الكود سيتعامل مع المحاضرة الجديدة تلقائياً!
 */