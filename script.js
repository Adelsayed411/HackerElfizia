// =========================================
// 🚀 هكر الفيزياء - السكريبت الرئيسي المطوّر
// الميزات: بحث ذكي + PWA عدواني + تتبع تقدم بـ Gamification
// =========================================

document.addEventListener('DOMContentLoaded', function () {
    loadDarkMode();
    loadProgress();
    loadPartItemProgress();   // ميزة 3: تحميل حالة الأزرار المكتملة
    startCountdown();
    checkNewsBarClosed();
    initPWAInstall();         // ميزة 2: تشغيل نظام PWA العدواني
});

// =========================================
// الوضع الليلي (Dark Mode)
// =========================================
function toggleDarkMode() {
    const body = document.body;
    const icon = document.getElementById('darkModeIcon');
    body.classList.toggle('dark-mode');
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
        if (icon) icon.className = 'fa-solid fa-sun';
    }
}

// =========================================
// نظام التقدم بـ Checkboxes
// =========================================
function updateProgress() {
    const checkboxes = document.querySelectorAll('.lecture-checkbox');
    const totalLectures = checkboxes.length;
    let completedLectures = 0;
    const progress = {};

    checkboxes.forEach((checkbox) => {
        const isChecked = checkbox.checked;
        const card = checkbox.closest('.task-card');
        const lectureId = card ? card.getAttribute('data-lecture-id') : checkbox.id;
        if (lectureId) progress[lectureId] = isChecked;
        if (isChecked) completedLectures++;
    });

    localStorage.setItem('lectureProgress', JSON.stringify(progress));

    const percentage = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressText) progressText.textContent =
        completedLectures + ' من ' + totalLectures + ' محاضرات (' + Math.round(percentage) + '%)';

    if (completedLectures === totalLectures && totalLectures > 0) {
        triggerConfetti();
    }
}

function loadProgress() {
    const savedProgress = localStorage.getItem('lectureProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const checkboxes = document.querySelectorAll('.lecture-checkbox');
        checkboxes.forEach(function(checkbox) {
            const card = checkbox.closest('.task-card');
            const lectureId = card ? card.getAttribute('data-lecture-id') : checkbox.id;
            if (lectureId && progress[lectureId]) {
                checkbox.checked = true;
            }
        });
    }
    updateProgress();
}

// =========================================
// ميزة 3: Gamification - تتبع الأزرار (part-item)
// عند الضغط على أي رابط (فيديو أو PDF)، يتحول لون الزر للأخضر
// مع علامة مكتمل وتُحفظ الحالة في localStorage
// =========================================
function initPartItemTracking() {
    var partItems = document.querySelectorAll('.part-item');

    partItems.forEach(function(item, index) {
        var href = item.getAttribute('href') || ('item-' + index);
        // مفتاح آمن وفريد
        var safeKey = 'part_done__' + encodeURIComponent(href).replace(/%/g, '_').slice(0, 60);
        item.dataset.progressKey = safeKey;

        // استعادة الحالة المحفوظة
        if (localStorage.getItem(safeKey) === 'done') {
            markPartItemDone(item, false);
        }

        // عند الضغط، احفظ الحالة وغيّر المظهر
        item.addEventListener('click', function () {
            localStorage.setItem(safeKey, 'done');
            markPartItemDone(item, true);
        });
    });
}

function markPartItemDone(item, animate) {
    if (item.classList.contains('part-item--done')) return;
    item.classList.add('part-item--done');

    var titleSpan = item.querySelector('.part-title');
    if (titleSpan && !titleSpan.querySelector('.done-badge')) {
        var badge = document.createElement('span');
        badge.className = 'done-badge';
        badge.textContent = ' ✅';
        titleSpan.appendChild(badge);
    }

    if (animate) {
        item.classList.add('part-item--pulse');
        setTimeout(function() { item.classList.remove('part-item--pulse'); }, 600);
    }
}

function loadPartItemProgress() {
    initPartItemTracking();
}
// =========================================
// ميزة 2: PWA Install عدواني واحترافي
// نظام متكامل: بانر ثابت + نافذة Overlay جذابة (تظهر دايماً)
// =========================================
var deferredPrompt = null;
var pwaInstalled = false;

function initPWAInstall() {
    // هل التطبيق مُثبَّت أصلاً؟
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        localStorage.getItem('pwaInstalled') === 'true') {
        pwaInstalled = true;
        hidePWAElements();
        return;
    }

    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBanner();
        scheduleInstallOverlay();
    });

    window.addEventListener('appinstalled', function() {
        pwaInstalled = true;
        hidePWAElements();
        localStorage.setItem('pwaInstalled', 'true');
        if (typeof gtag === 'function') {
            gtag('event', 'install_pwa', {
                'event_category': 'App Installation',
                'event_label': 'Hacker Elfizia App'
            });
        }
    });

    // البانر السفلي الموجود
    var installBtn = document.getElementById('install-btn');
    var closeBannerBtn = document.getElementById('close-banner-btn');

    if (installBtn) {
        installBtn.addEventListener('click', function() {
            triggerInstall();
        });
    }
    if (closeBannerBtn) {
        closeBannerBtn.addEventListener('click', function() {
            hideInstallBanner();
            setTimeout(showInstallBanner, 5 * 60 * 1000);
        });
    }
}

function showInstallBanner() {
    if (pwaInstalled) return;
    var banner = document.getElementById('install-banner');
    if (banner) banner.style.display = 'flex';
}

function hideInstallBanner() {
    var banner = document.getElementById('install-banner');
    if (banner) banner.style.display = 'none';
}

function hidePWAElements() {
    var banner = document.getElementById('install-banner');
    if (banner) banner.style.display = 'none';
    var overlay = document.getElementById('pwa-overlay');
    if (overlay) overlay.style.display = 'none';
}

function scheduleInstallOverlay() {
    // شيلنا شرط الحفظ في الذاكرة، وخليناها تظهر بعد ثانية واحدة (1000 ملي ثانية)
    setTimeout(showInstallOverlay, 1000);
}

function showInstallOverlay() {
    if (pwaInstalled) return;
    var overlay = document.getElementById('pwa-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        requestAnimationFrame(function() {
            overlay.classList.add('pwa-overlay--visible');
        });
    }
}

function closeInstallOverlay() {
    // شيلنا فكرة الإغلاق الدائم، هتقفل دلوقتي بس ولما يعمل ريفريش هتطلعله تاني
    var overlay = document.getElementById('pwa-overlay');
    if (overlay) {
        overlay.classList.remove('pwa-overlay--visible');
        setTimeout(function() { overlay.style.display = 'none'; }, 350);
    }
}

function triggerInstall() {
    if (!deferredPrompt) return;
    hideInstallBanner();
    closeInstallOverlay();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(result) {
        console.log('نتيجة التثبيت: ' + result.outcome);
        deferredPrompt = null;
    });
}

// =========================================
// ميزة 1: البحث الذكي اللحظي
// يبحث في: عنوان المحاضرة، التفاصيل، وعناوين الأزرار
// =========================================
function searchLectures() {
    var input = document.getElementById('searchInput');
    if (!input) return;
    var filter = input.value.toLowerCase().trim();
    var cards = document.querySelectorAll('.task-card');
    var clearBtn = document.getElementById('searchClear');
    var noResults = document.getElementById('noResults');

    if (clearBtn) clearBtn.style.display = filter ? 'block' : 'none';

    var visibleCount = 0;

    cards.forEach(function(card) {
        var titleEl = card.querySelector('.task-title');
        var detailsEl = card.querySelector('.task-details');
        var partTitles = card.querySelectorAll('.part-title');

        var titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
        var detailsText = detailsEl ? detailsEl.textContent.toLowerCase() : '';
        var partText = '';
        partTitles.forEach(function(p) { partText += p.textContent.toLowerCase() + ' '; });

        var combinedText = titleText + ' ' + detailsText + ' ' + partText;

        if (!filter || combinedText.includes(filter)) {
            card.style.display = 'block';
            // فتح الكارد تلقائيًا لو في نتيجة بحث
            if (filter) {
                var content = card.querySelector('.task-content');
                var icon = card.querySelector('.toggle-icon');
                if (content && !content.style.maxHeight) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
                highlightText(card, filter);
            } else {
                clearHighlights(card);
            }
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (noResults) {
        noResults.style.display = (filter && visibleCount === 0) ? 'block' : 'none';
    }
}

function highlightText(container, query) {
    clearHighlights(container);
    if (!query) return;
    var titleEl = container.querySelector('.task-title');
    if (!titleEl) return;

    var escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + escapedQuery + ')', 'gi');

    titleEl.childNodes.forEach(function(node) {
        if (node.nodeType === 3 && regex.test(node.textContent)) {
            var wrapper = document.createElement('span');
            wrapper.innerHTML = node.textContent.replace(regex, '<mark class="search-highlight">$1</mark>');
            node.parentNode.replaceChild(wrapper, node);
        }
    });
}

function clearHighlights(container) {
    container.querySelectorAll('.search-highlight').forEach(function(mark) {
        var parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
    });
}

function clearSearch() {
    var input = document.getElementById('searchInput');
    if (!input) return;
    input.value = '';
    document.querySelectorAll('.task-card').forEach(function(card) { clearHighlights(card); });
    searchLectures();
    input.focus();
}

// =========================================
// العداد التنازلي
// =========================================
function startCountdown() {
    var examDate = new Date('2026-03-26 21:00:00');

    function updateCountdown() {
        var now = new Date();
        var diff = examDate - now;
        var el = document.getElementById('countdownText');
        if (!el) return;

        if (diff <= 0) {
            el.textContent = 'انتهى وقت الامتحان!';
            return;
        }

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

        var text = 'متبقي على امتحان شهر مارس: ';
        if (days > 0) text += days + ' ' + (days === 1 ? 'يوم' : 'أيام');
        if (hours > 0 || days > 0) text += ' ' + hours + ' ' + (hours === 1 ? 'ساعة' : 'ساعات');
        if (days === 0) text += ' ' + minutes + ' دقيقة ' + seconds + ' ثانية';

        el.textContent = text;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// =========================================
// شريط الأخبار
// =========================================
function closeNewsBar() {
    var newsBar = document.getElementById('newsBar');
    if (!newsBar) return;
    newsBar.style.animation = 'slideUp 0.3s ease forwards';
    setTimeout(function() { newsBar.style.display = 'none'; }, 300);
    localStorage.setItem('newsBarClosed', 'true');
}

function checkNewsBarClosed() {
    if (localStorage.getItem('newsBarClosed') === 'true') {
        var bar = document.getElementById('newsBar');
        if (bar) bar.style.display = 'none';
    }
}

// =========================================
// الأكورديون
// =========================================
function toggleTask(header) {
    var content = header.nextElementSibling;
    var icon = header.querySelector('.toggle-icon');
    if (!content) return;

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
    }
}

// =========================================
// تأثير الكونفيتي عند إكمال كل المحاضرات
// =========================================
function triggerConfetti() {
    var colors = ['#5e35b1', '#ff007f', '#ffd700', '#00e676', '#2979ff'];
    for (var i = 0; i < 80; i++) {
        (function() {
            var confetti = document.createElement('div');
            var color = colors[Math.floor(Math.random() * colors.length)];
            var size = Math.random() * 10 + 6;
            var isCircle = Math.random() > 0.5;
            var duration = Math.random() * 2 + 2;
            var delay = Math.random() * 1.5;
            var left = Math.random() * 100;

            confetti.style.cssText = [
                'position:fixed',
                'width:' + size + 'px',
                'height:' + size + 'px',
                'background:' + color,
                'border-radius:' + (isCircle ? '50%' : '2px'),
                'top:-20px',
                'left:' + left + 'vw',
                'z-index:99999',
                'pointer-events:none',
                'animation:confettiFall ' + duration + 's ease-in ' + delay + 's forwards'
            ].join(';');

            document.body.appendChild(confetti);
            setTimeout(function() { confetti.remove(); }, (duration + delay + 0.5) * 1000);
        })();
    }
}

// =========================================
// مراقبة Checkboxes
// =========================================
document.addEventListener('change', function (e) {
    if (e.target.classList.contains('lecture-checkbox')) {
        updateProgress();
    }
});

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('lecture-checkbox') ||
        e.target.classList.contains('checkbox-label')) {
        e.stopPropagation();
    }
});

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// =========================================
// CSS ديناميكي للميزات الجديدة
// =========================================
var dynamicStyles = document.createElement('style');
dynamicStyles.textContent = [
    /* أنيميشن إغلاق شريط الأخبار */
    '@keyframes slideUp {',
    '  from { transform: translateY(0); opacity: 1; }',
    '  to   { transform: translateY(-100%); opacity: 0; }',
    '}',

    /* أنيميشن الكونفيتي */
    '@keyframes confettiFall {',
    '  0%   { transform: translateY(0) rotate(0deg); opacity: 1; }',
    '  100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }',
    '}',

    /* ميزة 3: الزر المكتمل */
    '.part-item--done {',
    '  background: linear-gradient(135deg, #e8f5e9, #c8e6c9) !important;',
    '  border-left: 4px solid #43a047 !important;',
    '}',
    'body.dark-mode .part-item--done {',
    '  background: rgba(67,160,71,0.15) !important;',
    '  border-left: 4px solid #66bb6a !important;',
    '}',
    '.part-item--done .part-title { color: #2e7d32 !important; }',
    'body.dark-mode .part-item--done .part-title { color: #a5d6a7 !important; }',
    '.part-item--done .view-btn { color: #43a047 !important; }',
    '.done-badge { font-size: 1rem; margin-right: 4px; }',
    '@keyframes partPulse {',
    '  0%   { transform: scale(1); }',
    '  40%  { transform: scale(1.035); }',
    '  100% { transform: scale(1); }',
    '}',
    '.part-item--pulse { animation: partPulse 0.6s ease; }',

    /* ميزة 1: تمييز نتائج البحث */
    'mark.search-highlight {',
    '  background: #fff176; color: #1a1a1a;',
    '  border-radius: 3px; padding: 0 2px; font-weight: 800;',
    '}',
    'body.dark-mode mark.search-highlight {',
    '  background: #f9a825; color: #1a1a1a;',
    '}',

    /* ميزة 2: PWA Overlay */
    '#pwa-overlay {',
    '  display: none; position: fixed; inset: 0;',
    '  background: rgba(0,0,0,0.72); z-index: 100000;',
    '  align-items: center; justify-content: center;',
    '  padding: 20px; opacity: 0; transition: opacity 0.35s ease;',
    '}',
    '#pwa-overlay.pwa-overlay--visible { opacity: 1; }',

    '.pwa-overlay-card {',
    '  background: #fff; border-radius: 20px; padding: 35px 30px 28px;',
    '  max-width: 420px; width: 100%; text-align: center; direction: rtl;',
    '  position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.4);',
    '  transform: scale(0.88); transition: transform 0.35s ease;',
    '  font-family: "Cairo", sans-serif;',
    '}',
    '#pwa-overlay.pwa-overlay--visible .pwa-overlay-card { transform: scale(1); }',
    'body.dark-mode .pwa-overlay-card { background: #2d2d2d; color: #e0e0e0; }',

    '.pwa-overlay-close {',
    '  position: absolute; top: 12px; left: 14px;',
    '  background: none; border: none; font-size: 1.4rem;',
    '  cursor: pointer; color: #999; padding: 4px 8px;',
    '  border-radius: 6px; transition: 0.2s; line-height: 1;',
    '}',
    '.pwa-overlay-close:hover { background: #f0f0f0; color: #333; }',
    'body.dark-mode .pwa-overlay-close:hover { background: #444; color: #fff; }',

    '.pwa-overlay-icon {',
    '  font-size: 4rem; margin-bottom: 12px; display: block;',
    '  animation: iconBounce 1.6s ease-in-out infinite;',
    '}',
    '@keyframes iconBounce {',
    '  0%,100% { transform: translateY(0); }',
    '  50%      { transform: translateY(-10px); }',
    '}',

    '.pwa-overlay-card h2 {',
    '  font-size: 1.45rem; font-weight: 900;',
    '  color: #5e35b1; margin-bottom: 10px;',
    '}',
    'body.dark-mode .pwa-overlay-card h2 { color: #ce93d8; }',

    '.pwa-overlay-card p {',
    '  font-size: 0.97rem; color: #555;',
    '  line-height: 1.75; margin-bottom: 18px;',
    '}',
    'body.dark-mode .pwa-overlay-card p { color: #bbb; }',

    '.pwa-overlay-features {',
    '  display: flex; justify-content: center;',
    '  gap: 10px; margin-bottom: 22px; flex-wrap: wrap;',
    '}',
    '.pwa-feature-chip {',
    '  background: #ede7f6; color: #5e35b1;',
    '  border-radius: 50px; padding: 6px 14px;',
    '  font-size: 0.82rem; font-weight: 700;',
    '}',
    'body.dark-mode .pwa-feature-chip {',
    '  background: rgba(94,53,177,0.3); color: #ce93d8;',
    '}',

    '.pwa-install-cta {',
    '  display: block; width: 100%;',
    '  background: linear-gradient(135deg, #5e35b1, #ff007f);',
    '  color: white; border: none; border-radius: 50px;',
    '  padding: 15px; font-size: 1.1rem; font-weight: 900;',
    '  cursor: pointer; font-family: "Cairo", sans-serif;',
    '  margin-bottom: 12px; transition: 0.3s;',
    '  box-shadow: 0 6px 20px rgba(94,53,177,0.4);',
    '}',
    '.pwa-install-cta:hover {',
    '  transform: translateY(-2px);',
    '  box-shadow: 0 8px 28px rgba(94,53,177,0.5);',
    '}',

    '.pwa-overlay-skip {',
    '  background: none; border: none;',
    '  color: #aaa; font-size: 0.88rem;',
    '  cursor: pointer; font-family: "Cairo", sans-serif;',
    '  text-decoration: underline; transition: 0.2s;',
    '}',
    '.pwa-overlay-skip:hover { color: #666; }',

    /* تحسين أنيميشن البانر السفلي */
    '.install-banner { animation: bannerSlideUp 0.5s ease; }',
    '@keyframes bannerSlideUp {',
    '  from { transform: translate(-50%, 100%); opacity: 0; }',
    '  to   { transform: translateX(-50%); opacity: 1; }',
    '}'
].join('\n');

document.head.appendChild(dynamicStyles);