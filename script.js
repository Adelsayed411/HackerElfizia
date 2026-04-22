// =========================================
// 🚀 هكر الفيزياء - السكريبت الرئيسي
// Architecture: CSS-class-driven | No inline styles | Delegated events
// =========================================

// =========================================
// SECTION 1: Initialization
// =========================================
document.addEventListener('DOMContentLoaded', function () {
    loadDarkMode();
    loadProgress();
    initPartItemTracking();
    startCountdown();
    checkNewsBarClosed();
    initPWAInstall();
    initDashboard();
    initSearch();
    initWelcomeModal();
    initKeyboardNav();
});

// =========================================
// SECTION 2: Dark Mode
// =========================================
function toggleDarkMode() {
    const body = document.body;
    const icon = document.getElementById('darkModeIcon');
    body.classList.toggle('dark-mode');

    const isDark = body.classList.contains('dark-mode');
    if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        const icon = document.getElementById('darkModeIcon');
        if (icon) icon.className = 'fa-solid fa-sun';
    }
}

// =========================================
// SECTION 3: Progress Tracking & Gamification
// =========================================
function updateProgress() {
    const checkboxes = document.querySelectorAll('.lecture-checkbox');
    const totalLectures = checkboxes.length;
    let completedLectures = 0;
    const progress = {};

    checkboxes.forEach(function (checkbox) {
        const card = checkbox.closest('.task-card');
        const lectureId = card ? card.getAttribute('data-lecture-id') : checkbox.id;
        if (lectureId) progress[lectureId] = checkbox.checked;
        if (checkbox.checked) completedLectures++;
    });

    localStorage.setItem('lectureProgress', JSON.stringify(progress));

    const percentage = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressContainer = document.querySelector('.progress-bar-container');

    if (progressBar) progressBar.style.width = percentage + '%'; 
    if (progressContainer) progressContainer.setAttribute('aria-valuenow', Math.round(percentage));
    if (progressText) {
        progressText.textContent =
            completedLectures + ' من ' + totalLectures + ' محاضرات (' + Math.round(percentage) + '%)';
    }

    if (completedLectures === totalLectures && totalLectures > 0) {
        triggerConfetti();
    }
}

function loadProgress() {
    const savedProgress = localStorage.getItem('lectureProgress');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            document.querySelectorAll('.lecture-checkbox').forEach(function (checkbox) {
                const card = checkbox.closest('.task-card');
                const lectureId = card ? card.getAttribute('data-lecture-id') : checkbox.id;
                if (lectureId && progress[lectureId]) {
                    checkbox.checked = true;
                }
            });
        } catch (e) {
            console.warn('Failed to parse saved progress:', e);
        }
    }
    updateProgress();
}

// =========================================
// SECTION 4: Gamification - Part Item Tracking
// =========================================
function initPartItemTracking() {
    document.querySelectorAll('.part-item').forEach(function (item, index) {
        var href = item.getAttribute('href') || ('item-' + index);
        var safeKey = 'part_done__' + encodeURIComponent(href).replace(/%/g, '_').slice(0, 60);
        item.dataset.progressKey = safeKey;

        if (localStorage.getItem(safeKey) === 'done') {
            markPartItemDone(item, false);
        }

        item.addEventListener('click', function () {
            localStorage.setItem(safeKey, 'done');
            markPartItemDone(item, true);
        });
    });
}

function markPartItemDone(item, animate) {
    if (!item || item.classList.contains('part-item--done')) return;
    item.classList.add('part-item--done');

    var titleSpan = item.querySelector('.part-title');
    if (titleSpan && !titleSpan.querySelector('.done-badge')) {
        var badge = document.createElement('span');
        badge.className = 'done-badge';
        badge.textContent = ' ✅';
        badge.setAttribute('aria-label', 'مكتمل');
        titleSpan.appendChild(badge);
    }

    if (animate) {
        item.classList.add('part-item--pulse');
        setTimeout(function () { item.classList.remove('part-item--pulse'); }, 600);
    }
}

// =========================================
// SECTION 5: Confetti
// =========================================
function triggerConfetti() {
    var colors = ['#5e35b1', '#ff007f', '#ffd700', '#00e676', '#2979ff'];

    function spawnPiece() {
        var el = document.createElement('div');
        var color = colors[Math.floor(Math.random() * colors.length)];
        var size = Math.random() * 10 + 6;
        var duration = Math.random() * 2 + 2;
        var delay = Math.random() * 1.5;

        el.style.cssText = [
            'position:fixed',
            'width:' + size + 'px',
            'height:' + size + 'px',
            'background:' + color,
            'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px'),
            'top:-20px',
            'left:' + (Math.random() * 100) + 'vw',
            'z-index:99999',
            'pointer-events:none',
            'animation:confettiFall ' + duration + 's ease-in ' + delay + 's forwards'
        ].join(';');

        document.body.appendChild(el);
        setTimeout(function () { if (el.parentNode) el.remove(); }, (duration + delay + 0.5) * 1000);
    }

    for (var i = 0; i < 80; i++) spawnPiece();
}

// =========================================
// SECTION 6: PWA Install System
// =========================================
var deferredPrompt = null;
var pwaInstalled = false;

function initPWAInstall() {
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        localStorage.getItem('pwaInstalled') === 'true') {
        pwaInstalled = true;
        hidePWAElements();
        return;
    }

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBanner();
        scheduleInstallOverlay();
    });

    window.addEventListener('appinstalled', function () {
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

    var installBtn = document.getElementById('install-btn');
    var closeBannerBtn = document.getElementById('close-banner-btn');

    if (installBtn) installBtn.addEventListener('click', triggerInstall);
    if (closeBannerBtn) {
        closeBannerBtn.addEventListener('click', function () {
            hideInstallBanner();
            setTimeout(showInstallBanner, 5 * 60 * 1000);
        });
    }
}

function showInstallBanner() {
    if (pwaInstalled) return;
    var banner = document.getElementById('install-banner');
    if (banner) {
        banner.hidden = false;
        banner.classList.remove('is-hidden');
    }
}

function hideInstallBanner() {
    var banner = document.getElementById('install-banner');
    if (banner) {
        banner.hidden = true;
        banner.classList.add('is-hidden');
    }
}

function hidePWAElements() {
    hideInstallBanner();
    var overlay = document.getElementById('pwa-overlay');
    if (overlay) {
        overlay.hidden = true;
        overlay.classList.add('is-hidden');
    }
}

function scheduleInstallOverlay() {
    setTimeout(showInstallOverlay, 1000);
}

function showInstallOverlay() {
    if (pwaInstalled) return;
    var overlay = document.getElementById('pwa-overlay');
    if (overlay) {
        overlay.hidden = false;
        overlay.classList.remove('is-hidden');
        requestAnimationFrame(function () {
            overlay.classList.add('pwa-overlay--visible');
        });
    }
}

function closeInstallOverlay() {
    var overlay = document.getElementById('pwa-overlay');
    if (overlay) {
        overlay.classList.remove('pwa-overlay--visible');
        setTimeout(function () { 
            overlay.hidden = true;
            overlay.classList.add('is-hidden'); 
        }, 350);
    }
}

function triggerInstall() {
    if (!deferredPrompt) return;
    hideInstallBanner();
    closeInstallOverlay();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function (result) {
        console.log('نتيجة التثبيت: ' + result.outcome);
        deferredPrompt = null;
    });
}

// =========================================
// SECTION 7: Smart Search
// =========================================
function initSearch() {
    var input = document.getElementById('searchInput');
    var clearBtn = document.getElementById('searchClear');
    if (input) input.addEventListener('input', searchLectures);
    if (clearBtn) clearBtn.addEventListener('click', clearSearch);
}

function searchLectures() {
    var input = document.getElementById('searchInput');
    if (!input) return;
    var filter = input.value.toLowerCase().trim();
    var cards = document.querySelectorAll('.task-card');
    var clearBtn = document.getElementById('searchClear');
    var noResults = document.getElementById('noResults');

    if (clearBtn) clearBtn.hidden = !filter;

    var visibleCount = 0;

    cards.forEach(function (card) {
        var titleEl = card.querySelector('.task-title');
        var detailsEl = card.querySelector('.task-details');
        var partTitles = card.querySelectorAll('.part-title');

        var titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
        var detailsText = detailsEl ? detailsEl.textContent.toLowerCase() : '';
        var partText = Array.from(partTitles).map(function (p) { return p.textContent.toLowerCase(); }).join(' ');
        var combinedText = titleText + ' ' + detailsText + ' ' + partText;

        if (!filter || combinedText.includes(filter)) {
            card.hidden = false; // Fix browser native hidden
            card.classList.remove('is-hidden');
            if (filter) {
                var content = card.querySelector('.task-content');
                var header = card.querySelector('.task-header');
                if (content && !content.style.maxHeight) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (header) header.setAttribute('aria-expanded', 'true');
                    var icon = card.querySelector('.toggle-icon');
                    if (icon) icon.classList.add('is-open');
                }
                highlightText(card, filter);
            } else {
                clearHighlights(card);
            }
            visibleCount++;
        } else {
            card.hidden = true; // Fix browser native hidden
            card.classList.add('is-hidden');
        }
    });

    if (noResults) {
        noResults.hidden = !(filter && visibleCount === 0);
        if(!noResults.hidden) {
            noResults.classList.remove('is-hidden');
        } else {
            noResults.classList.add('is-hidden');
        }
    }
}

function highlightText(container, query) {
    clearHighlights(container);
    if (!query) return;
    var titleEl = container.querySelector('.task-title');
    if (!titleEl) return;

    var escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + escapedQuery + ')', 'gi');

    titleEl.childNodes.forEach(function (node) {
        if (node.nodeType === 3 && regex.test(node.textContent)) {
            var wrapper = document.createElement('span');
            wrapper.innerHTML = node.textContent.replace(regex, '<mark class="search-highlight">$1</mark>');
            node.parentNode.replaceChild(wrapper, node);
        }
    });
}

function clearHighlights(container) {
    if (!container) return;
    container.querySelectorAll('.search-highlight').forEach(function (mark) {
        var parent = mark.parentNode;
        if (parent) {
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        }
    });
}

function clearSearch() {
    var input = document.getElementById('searchInput');
    if (!input) return;
    input.value = '';
    document.querySelectorAll('.task-card').forEach(function (card) { clearHighlights(card); });
    searchLectures();
    input.focus();
}

// =========================================
// SECTION 8: Countdown Timer
// =========================================
function startCountdown() {
    var examDate = new Date('2026-03-26 21:00:00');
    var el = document.getElementById('countdownText');
    if (!el) return;

    function updateCountdown() {
        var now = new Date();
        var diff = examDate - now;

        if (diff <= 0) {
            el.textContent = 'انتهى وقت الامتحان!';
            return;
        }

        var days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

        var text = 'متبقي على امتحان شهر مارس: ';
        if (days > 0)           text += days + ' ' + (days === 1 ? 'يوم' : 'أيام');
        if (hours > 0 || days > 0) text += ' ' + hours + ' ' + (hours === 1 ? 'ساعة' : 'ساعات');
        if (days === 0)         text += ' ' + minutes + ' دقيقة ' + seconds + ' ثانية';

        el.textContent = text;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// =========================================
// SECTION 9: News Bar
// =========================================
function closeNewsBar() {
    var newsBar = document.getElementById('newsBar');
    if (!newsBar) return;
    newsBar.classList.add('news-bar--closing');
    setTimeout(function () { 
        newsBar.hidden = true;
        newsBar.classList.add('is-hidden'); 
    }, 300);
    localStorage.setItem('newsBarClosed', 'true');
}

function checkNewsBarClosed() {
    if (localStorage.getItem('newsBarClosed') === 'true') {
        var bar = document.getElementById('newsBar');
        if (bar) {
            bar.hidden = true;
            bar.classList.add('is-hidden');
        }
    }
}

// =========================================
// SECTION 10: Accordion
// =========================================
function toggleTask(header) {
    if (!header) return;
    var content = header.nextElementSibling;
    var icon = header.querySelector('.toggle-icon');
    if (!content) return;

    var isOpen = !!content.style.maxHeight;
    content.style.maxHeight = isOpen ? null : content.scrollHeight + 'px';
    if (icon) icon.classList.toggle('is-open', !isOpen);
    header.setAttribute('aria-expanded', String(!isOpen));
}

// =========================================
// SECTION 11: Welcome Modal
// =========================================
function initWelcomeModal() {
    if (!sessionStorage.getItem('welcomeModalShown')) {
        setTimeout(function () {
            var modal = document.getElementById('welcomeModal');
            if (modal) {
                modal.hidden = false;
                modal.classList.remove('is-hidden');
                sessionStorage.setItem('welcomeModalShown', 'true');
            }
        }, 1500);
    }
}

function closeWelcomeModal() {
    var modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.classList.add('modal--closing');
        setTimeout(function () {
            modal.hidden = true;
            modal.classList.add('is-hidden');
            modal.classList.remove('modal--closing');
        }, 400);
    }
}

// =========================================
// SECTION 12: Dashboard Navigation
// =========================================
var _dom = {};
var currentLevel = 'main';    // 'main' | 'reviews-menu' | 'category'
var currentCategory = null;   // tracks active category for back-navigation

function initDashboard() {
    _dom.mainDashboard  = document.getElementById('mainDashboard');
    _dom.reviewsSubMenu = document.getElementById('reviewsSubMenu');
    _dom.heroBanner     = document.getElementById('heroBanner');
    _dom.backBtn        = document.getElementById('backBtn');
    _dom.pdfLibrary     = document.getElementById('pdfLibrary');
    _dom.courseTitle    = document.getElementById('courseContentTitle');
    _dom.pdfList        = document.getElementById('pdfList');

    // Hide all task cards initially (dashboard mode)
    document.querySelectorAll('.task-card').forEach(function (card) {
        card.hidden = true;
        card.classList.add('is-hidden');
    });
    if (_dom.courseTitle) _dom.courseTitle.hidden = true;

    _buildPdfList();
}

function _buildPdfList() {
    if (!_dom.pdfList) return;
    var pdfLinks = document.querySelectorAll('.task-card a[href$=".pdf"], .task-card a[download]');
    _dom.pdfList.innerHTML = '';

    if (pdfLinks.length === 0) {
        var emptyMsg = document.createElement('p');
        emptyMsg.className = 'pdf-empty-msg';
        emptyMsg.textContent = 'لا توجد ملفات PDF حالياً.';
        _dom.pdfList.appendChild(emptyMsg);
        return;
    }

    Array.from(pdfLinks).reverse().forEach(function (link) {
        var clonedLink = link.cloneNode(true);
        clonedLink.className = 'part-item pdf-quick-link';

        var parentCard = link.closest('.task-card');
        var lectureName = parentCard && parentCard.querySelector('.task-title')
            ? parentCard.querySelector('.task-title').textContent.trim()
            : 'ملف خارجي';
        var customName = link.getAttribute('data-name') || lectureName;

        var titleSpan = clonedLink.querySelector('.part-title');
        if (titleSpan) {
            titleSpan.innerHTML =
                '📄 ' + customName +
                ' <br><small class="pdf-link-sub">تحميل المذكرة</small>';
        }

        _dom.pdfList.appendChild(clonedLink);
    });
}

function _hideDashboardViews() {
    if (_dom.mainDashboard)  { _dom.mainDashboard.hidden = true; _dom.mainDashboard.classList.add('is-hidden'); }
    if (_dom.reviewsSubMenu) { _dom.reviewsSubMenu.hidden = true; _dom.reviewsSubMenu.classList.add('is-hidden'); }
    if (_dom.heroBanner)     { _dom.heroBanner.hidden = true; _dom.heroBanner.classList.add('is-hidden'); }
    if (_dom.pdfLibrary)     { _dom.pdfLibrary.hidden = true; _dom.pdfLibrary.classList.add('is-hidden'); }
    document.querySelectorAll('.task-card').forEach(function (c) { c.hidden = true; c.classList.add('is-hidden'); });
    if (_dom.courseTitle)    _dom.courseTitle.hidden = true;
}

function showReviewsMenu() {
    _hideDashboardViews();
    if (_dom.reviewsSubMenu) {
        _dom.reviewsSubMenu.hidden = false;
        _dom.reviewsSubMenu.classList.remove('is-hidden');
        _dom.reviewsSubMenu.classList.add('anim-fade-in');
        _dom.reviewsSubMenu.addEventListener('animationend', function () {
            _dom.reviewsSubMenu.classList.remove('anim-fade-in');
        }, { once: true });
    }
    if (_dom.backBtn) _dom.backBtn.hidden = false;
    currentLevel = 'reviews-menu';
    currentCategory = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCategory(category) {
    _hideDashboardViews();
    currentCategory = category;

    if (_dom.pdfLibrary && category === 'pdfs') {
        _dom.pdfLibrary.hidden = false;
        _dom.pdfLibrary.classList.remove('is-hidden');
    }

    document.querySelectorAll('.task-card').forEach(function (card) {
        if (card.getAttribute('data-category') === category) {
            card.hidden = false;
            card.classList.remove('is-hidden');
            card.classList.add('anim-fade-in');
            card.addEventListener('animationend', function () {
                card.classList.remove('anim-fade-in');
            }, { once: true });
        }
    });

    if (_dom.backBtn) _dom.backBtn.hidden = false;
    currentLevel = 'category';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleBackNavigation() {
    if (currentLevel === 'category') {
        var reviewCategories = ['chapter-rev', 'month-rev', 'solution-rev', 'final-rev'];
        if (currentCategory && reviewCategories.includes(currentCategory)) {
            showReviewsMenu();
        } else {
            goHome();
        }
    } else if (currentLevel === 'reviews-menu') {
        goHome();
    }
}

function goHome() {
    _hideDashboardViews();
    currentCategory = null;

    if (_dom.mainDashboard) {
        _dom.mainDashboard.hidden = false;
        _dom.mainDashboard.classList.remove('is-hidden');
        _dom.mainDashboard.classList.add('anim-fade-in');
        _dom.mainDashboard.addEventListener('animationend', function () {
            _dom.mainDashboard.classList.remove('anim-fade-in');
        }, { once: true });
    }
    if (_dom.heroBanner) {
        _dom.heroBanner.hidden = false;
        _dom.heroBanner.classList.remove('is-hidden');
        _dom.heroBanner.classList.add('anim-fade-in');
        _dom.heroBanner.addEventListener('animationend', function () {
            _dom.heroBanner.classList.remove('anim-fade-in');
        }, { once: true });
    }
    if (_dom.backBtn) _dom.backBtn.hidden = true;
    currentLevel = 'main';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================================
// SECTION 13: Super Revision Navigation
// =========================================
function openSuperRevision() {
    openCategory('final-rev');

    setTimeout(function () {
        var finalCard = document.getElementById('finalRevisionCard');
        if (!finalCard) return;

        finalCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        var content = finalCard.querySelector('.task-content');
        var header = finalCard.querySelector('.task-header');
        if (content && (!content.style.maxHeight || content.style.maxHeight === '0px')) {
            if (header) toggleTask(header);
        }

        finalCard.classList.remove('super-card-highlight');
        void finalCard.offsetWidth; // force reflow
        finalCard.classList.add('super-card-highlight');
    }, 300);
}

// =========================================
// SECTION 14: Event Delegation
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

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// =========================================
// SECTION 15: Keyboard Accessibility
// =========================================
function initKeyboardNav() {
    document.addEventListener('keydown', function (e) {
        var el = e.target;
        if (el.getAttribute('role') === 'button' &&
            el.tagName !== 'BUTTON' &&
            el.tagName !== 'A') {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        }
    });
}