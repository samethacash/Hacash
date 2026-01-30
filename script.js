// ===== Performance Optimization: Debounce Function =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Logo Click to Top =====
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});

// ===== Smooth Scrolling and Active Link Highlighting =====
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Eğer dış link ise (http/https ile başlıyorsa), normal davranışa izin ver
            if (href.startsWith('http://') || href.startsWith('https://')) {
                return;
            }
            
            // İç link için smooth scroll yap
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                updateActiveLink(this);
            }
        });
    });

    // Highlight active section on scroll - Optimized with debounce
    const handleScroll = debounce(function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }, 150);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
});

function updateActiveLink(element) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    element.classList.add('active');
}

// ===== Copy to Clipboard Function =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// ===== Table of Contents Interactive Features =====
document.addEventListener('DOMContentLoaded', function() {
    const detailsElements = document.querySelectorAll('.content-section');
    
    detailsElements.forEach(detail => {
        detail.addEventListener('toggle', function() {
            if (this.open) {
                // Smooth scroll to the open details element
                this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
});

// ===== Counter Animation for Statistics =====
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===== Intersection Observer for Lazy Animation =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements that should fade in on scroll
document.addEventListener('DOMContentLoaded', function() {
    const elementsToObserve = document.querySelectorAll(
        '.feature-item, .overview-card, .incentive-card, .principle'
    );
    
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// ===== Mobile Menu Toggle (if needed) =====
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', function(e) {
    // Close details on Escape key
    if (e.key === 'Escape') {
        document.querySelectorAll('.content-section[open]').forEach(detail => {
            detail.removeAttribute('open');
        });
    }
});

// ===== Search Highlighting (for future search functionality) =====
function highlightSearchResults(query) {
    if (!query) return;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    const nodesToReplace = [];

    while (node = walker.nextNode()) {
        if (regex.test(node.nodeValue)) {
            nodesToReplace.push(node);
        }
    }

    nodesToReplace.forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
        node.parentNode.replaceChild(span, node);
    });
}

// ===== Print Friendly Function =====
function printPage() {
    window.print();
}

// ===== Scroll to Top Button =====
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑ Top';
    button.id = 'scrollToTop';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 10px 15px;
        background-color: #0066cc;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        display: none;
        z-index: 99;
        font-weight: bold;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#ff6b35';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#0066cc';
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// ===== Performance Monitoring =====
if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time: ' + pageLoadTime + 'ms');
    });
}

// ===== Local Storage for User Preferences =====
function saveThemePreference(theme) {
    localStorage.setItem('theme-preference', theme);
}

function getThemePreference() {
    return localStorage.getItem('theme-preference') || 'light';
}

// ===== Generate Table of Contents Dynamically =====
function generateTableOfContents() {
    const headings = document.querySelectorAll('h2, h3');
    const toc = document.querySelector('.whitepaper-toc ol');
    
    if (!toc) return;

    let currentLevel = 0;
    let list = toc;
    const stack = [];

    headings.forEach((heading, index) => {
        if (heading.textContent.includes('Table of Contents')) return;
        
        const level = parseInt(heading.tagName[1]);
        const id = `heading-${index}`;
        heading.id = id;

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        li.appendChild(a);

        list.appendChild(li);
    });
}

// ===== Accessibility Features =====
document.addEventListener('DOMContentLoaded', function() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#overview';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: white;
        padding: 8px;
        z-index: 100;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
});

// ===== Smooth Hover Effects for Links =====
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'color 0.3s ease';
        });
    });
});

// ===== Share Functionality =====
function shareContent(platform) {
    const pageUrl = window.location.href;
    const pageTitle = document.title;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// ===== Export as PDF (Client-side hint) =====
function exportAsPDF() {
    alert('Use your browser\'s print function (Ctrl+P or Cmd+P) and select "Save as PDF"');
    window.print();
}

// ===== Comparison Table Sorting =====
function sortTable(columnIndex) {
    const table = document.querySelector('.comparison-table');
    if (!table) return;
    
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const isAscending = table.dataset.sortAscending !== 'true';
    
    rows.sort((a, b) => {
        const cellA = a.children[columnIndex].textContent.trim();
        const cellB = b.children[columnIndex].textContent.trim();
        
        const comparison = cellA.localeCompare(cellB);
        return isAscending ? comparison : -comparison;
    });
    
    rows.forEach(row => table.appendChild(row));
    table.dataset.sortAscending = isAscending;
}

// ===== Analytics Event Tracking (if needed) =====
function trackEvent(eventName, eventData) {
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
    console.log(`Event tracked: ${eventName}`, eventData);
}

// Track section views
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('section_view', {
                    section: entry.target.id
                });
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => sectionObserver.observe(section));
});

// ===== Fetch Hacash Price from CoinGecko - Optimized with Cache =====
let priceCache = { value: null, timestamp: 0 };
const CACHE_DURATION = 30000; // 30 seconds

async function fetchHacashPrice() {
    const now = Date.now();
    
    // Return cached price if still valid
    if (priceCache.value && (now - priceCache.timestamp) < CACHE_DURATION) {
        return priceCache.value;
    }
    
    try {
        // Only allow HTTPS to prevent man-in-the-middle attacks
        const apiUrl = new URL('https://api.coingecko.com/api/v3/simple/price');
        apiUrl.searchParams.append('ids', 'hacash');
        apiUrl.searchParams.append('vs_currencies', 'usd');
        
        const response = await fetch(apiUrl.toString(), {
            signal: AbortSignal.timeout(5000),
            credentials: 'omit' // Don't send cookies
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        
        // Validate response structure to prevent injection
        if (data.hacash && typeof data.hacash.usd === 'number' && data.hacash.usd > 0) {
            const price = data.hacash.usd;
            priceCache = { value: price, timestamp: now };
            
            const priceElement = document.getElementById('hacPrice');
            if (priceElement) {
                const formattedPrice = price < 1 
                    ? price.toFixed(4) 
                    : price.toFixed(2);
                
                // Use textContent instead of innerHTML to prevent XSS
                priceElement.textContent = '$' + formattedPrice;
                priceElement.style.color = '#00d084';
            }
            return price;
        }
    } catch (error) {
        console.warn('Price fetch error:', error.message);
        const priceElement = document.getElementById('hacPrice');
        if (priceElement && !priceElement.textContent.includes('$')) {
            priceElement.textContent = '$0.2904';
        }
    }
}

// Fetch price on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hacash Whitepaper Website loaded successfully');
    
    // Fetch price immediately
    fetchHacashPrice();
    
    // Refresh price every 30 seconds with optimized cache
    setInterval(fetchHacashPrice, 30000);
    
    // ===== Progressive Web App: Register Service Worker =====
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', { scope: '/' })
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.warn('Service Worker registration failed:', err));
    }
    
    // ===== Request Idle Time for Non-Critical Tasks =====
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Preload next page content, analytics, etc.
            // Non-blocking performance optimization
        });
    }
});
