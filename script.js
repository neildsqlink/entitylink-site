/* ============================================
   EntityLink — Mini Site JavaScript
   Animations, Language Toggle, Interactions
   ============================================ */

(function () {
    'use strict';

    // --- Language System ---
    let currentLang = 'en';

    function setLanguage(lang) {
        currentLang = lang;
        const html = document.documentElement;

        if (lang === 'he') {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'he');
            document.body.style.fontFamily = "'Heebo', -apple-system, BlinkMacSystemFont, sans-serif";
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            document.body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
        }

        document.querySelectorAll('[data-' + lang + ']').forEach(function (el) {
            var text = el.getAttribute('data-' + lang);
            if (text) el.textContent = text;
        });
    }

    var langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', function () {
            setLanguage(currentLang === 'en' ? 'he' : 'en');
        });
    }

    // --- Scroll-triggered reveal animations ---
    function setupRevealAnimations() {
        var reveals = document.querySelectorAll('.reveal');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        reveals.forEach(function (el) {
            observer.observe(el);
        });
    }

    // --- Nav scroll effect ---
    function setupNavScroll() {
        var nav = document.getElementById('nav');
        var lastScroll = 0;

        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            if (scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            lastScroll = scrollY;
        }, { passive: true });
    }

    // --- Counter animation ---
    function animateCounters() {
        var counters = document.querySelectorAll('.stat-number[data-count]');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.getAttribute('data-count'));
                    var duration = 2000;
                    var startTime = null;

                    function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        var progress = Math.min((timestamp - startTime) / duration, 1);
                        // Ease out cubic
                        var eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target);
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            el.textContent = target;
                        }
                    }

                    requestAnimationFrame(step);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { observer.observe(c); });
    }

    // --- Compliance ring animation ---
    function animateComplianceRing() {
        var ring = document.querySelector('.ring-progress');
        if (!ring) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // 85% completion: 264 * 0.15 = ~40 offset
                    ring.style.strokeDashoffset = '40';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Start with full offset (empty)
        ring.style.strokeDashoffset = '264';
        observer.observe(ring);
    }


    // --- Tree node expand/collapse ---
    function setupTreeNodes() {
        document.querySelectorAll('.tree-node').forEach(function (node) {
            node.addEventListener('click', function (e) {
                e.stopPropagation();
                var children = this.nextElementSibling;
                if (children && children.classList.contains('tree-children')) {
                    var isExpanded = this.classList.contains('expanded');
                    if (isExpanded) {
                        this.classList.remove('expanded');
                        children.style.maxHeight = '0';
                        children.style.opacity = '0';
                        children.style.overflow = 'hidden';
                        setTimeout(function () {
                            children.style.display = 'none';
                        }, 300);
                    } else {
                        this.classList.add('expanded');
                        children.style.display = 'flex';
                        requestAnimationFrame(function () {
                            children.style.maxHeight = '500px';
                            children.style.opacity = '1';
                        });
                    }
                    // Rotate toggle icon
                    var toggle = this.querySelector('.tree-toggle svg');
                    if (toggle) {
                        toggle.style.transition = 'transform 0.3s ease';
                        toggle.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)';
                    }
                }
            });
        });
    }

    // --- Org chart node interaction ---
    function setupOrgNodes() {
        document.querySelectorAll('.org-node').forEach(function (node) {
            node.addEventListener('mouseenter', function () {
                this.style.zIndex = '10';
            });
            node.addEventListener('mouseleave', function () {
                this.style.zIndex = '';
            });
        });
    }

    // --- Smooth scroll for anchor links ---
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    var offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });

                    // Close mobile menu if open
                    var mobileMenu = document.getElementById('mobileMenu');
                    if (mobileMenu) mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- Mobile menu ---
    function setupMobileMenu() {
        var toggle = document.getElementById('mobileToggle');
        var menu = document.getElementById('mobileMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function () {
            var isOpen = menu.classList.contains('open');
            if (isOpen) {
                menu.classList.remove('open');
                document.body.style.overflow = '';
            } else {
                menu.classList.add('open');
                document.body.style.overflow = 'hidden';
            }

            // Animate hamburger
            var spans = toggle.querySelectorAll('span');
            if (!isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // --- Parallax effect on hero ---
    function setupHeroParallax() {
        var heroVisual = document.querySelector('.hero-visual');
        var heroGlow = document.querySelector('.hero-glow');
        if (!heroVisual) return;

        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            var factor = Math.min(scrollY / 800, 1);
            heroVisual.style.transform = 'translateY(' + (scrollY * 0.15) + 'px) scale(' + (1 - factor * 0.05) + ')';
            heroVisual.style.opacity = 1 - factor * 0.8;

            if (heroGlow) {
                heroGlow.style.transform = 'translateX(-50%) translateY(' + (scrollY * 0.1) + 'px)';
            }
        }, { passive: true });
    }

    // --- Draw org chart connector lines dynamically ---
    function drawOrgLines() {
        var svg = document.querySelector('.org-lines');
        var inner = document.querySelector('.org-chart-inner');
        if (!svg || !inner) return;

        // Clear existing lines
        svg.innerHTML = '';

        var ns = 'http://www.w3.org/2000/svg';
        var rect = inner.getBoundingClientRect();

        function cx(el) {
            var r = el.getBoundingClientRect();
            return r.left + r.width / 2 - rect.left;
        }
        function top(el) {
            return el.getBoundingClientRect().top - rect.top;
        }
        function bottom(el) {
            return el.getBoundingClientRect().bottom - rect.top;
        }

        function line(x1, y1, x2, y2) {
            var l = document.createElementNS(ns, 'line');
            l.setAttribute('x1', x1); l.setAttribute('y1', y1);
            l.setAttribute('x2', x2); l.setAttribute('y2', y2);
            l.setAttribute('class', 'org-line');
            svg.appendChild(l);
        }

        var levels = inner.querySelectorAll('.org-level');
        if (levels.length < 3) return;

        var rootNodes = levels[0].querySelectorAll('.org-node');
        var l1Nodes = levels[1].querySelectorAll('.org-node');
        var l2Nodes = levels[2].querySelectorAll('.org-node');

        if (!rootNodes.length || !l1Nodes.length) return;

        var root = rootNodes[0];
        var rootCx = cx(root);
        var rootBot = bottom(root);
        var l1Top = top(l1Nodes[0]);
        var midY = rootBot + (l1Top - rootBot) / 2;

        // Root vertical stem down to mid-point
        line(rootCx, rootBot, rootCx, midY);
        // Horizontal bar across all L1 nodes
        line(cx(l1Nodes[0]), midY, cx(l1Nodes[l1Nodes.length - 1]), midY);
        // Vertical drops from bar to each L1 node
        for (var i = 0; i < l1Nodes.length; i++) {
            line(cx(l1Nodes[i]), midY, cx(l1Nodes[i]), l1Top);
        }

        if (!l2Nodes.length) return;

        // Map L2 children to their L1 parents by region grouping:
        // L1[0] NA -> L2[0] NA, L2[1] CALA
        // L1[1] EMEA -> L2[2] EMEA, L2[3] EMEA
        // L1[2] Israel -> L2[4] Israel
        // L1[3] APAC -> L2[5] APAC, L2[6] APAC
        var parentMap = [
            { parent: 0, children: [0, 1] },
            { parent: 1, children: [2, 3] },
            { parent: 2, children: [4] },
            { parent: 3, children: [5, 6] }
        ];

        var l1Bot = bottom(l1Nodes[0]);
        var l2Top = top(l2Nodes[0]);
        var mid2Y = l1Bot + (l2Top - l1Bot) / 2;

        parentMap.forEach(function (group) {
            var pNode = l1Nodes[group.parent];
            if (!pNode) return;
            var pCx = cx(pNode);
            var pBot = bottom(pNode);

            // Vertical stem from parent down
            line(pCx, pBot, pCx, mid2Y);

            if (group.children.length === 1) {
                var child = l2Nodes[group.children[0]];
                if (child) {
                    line(pCx, mid2Y, cx(child), mid2Y);
                    line(cx(child), mid2Y, cx(child), top(child));
                }
            } else if (group.children.length > 1) {
                var firstChild = l2Nodes[group.children[0]];
                var lastChild = l2Nodes[group.children[group.children.length - 1]];
                if (firstChild && lastChild) {
                    // Horizontal bar
                    line(cx(firstChild), mid2Y, cx(lastChild), mid2Y);
                    // Drops to each child
                    group.children.forEach(function (ci) {
                        var child = l2Nodes[ci];
                        if (child) {
                            line(cx(child), mid2Y, cx(child), top(child));
                        }
                    });
                }
            }
        });
    }

    // --- Staggered animation for org chart nodes on scroll ---
    function setupOrgChartAnimation() {
        var orgChart = document.querySelector('.org-chart-inner');
        if (!orgChart) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var nodes = orgChart.querySelectorAll('.org-node');
                    nodes.forEach(function (node, i) {
                        node.style.animationDelay = (i * 0.1) + 's';
                        node.style.animationPlayState = 'running';
                    });
                    // Draw lines after animations settle
                    setTimeout(drawOrgLines, 1400);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(orgChart);

        // Redraw on resize
        window.addEventListener('resize', function () {
            if (document.querySelector('.org-chart.active')) {
                drawOrgLines();
            }
        });
    }

    // --- Factsheet sidebar nav hover ---
    function setupFactsheetNav() {
        document.querySelectorAll('.fp-nav-item').forEach(function (item) {
            item.addEventListener('mouseenter', function () {
                document.querySelectorAll('.fp-nav-item').forEach(function (i) {
                    i.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    }

    // --- Initialize ---
    document.addEventListener('DOMContentLoaded', function () {
        setupRevealAnimations();
        setupNavScroll();
        animateCounters();
        animateComplianceRing();
        setupTreeNodes();
        setupOrgNodes();
        setupSmoothScroll();
        setupMobileMenu();
        setupHeroParallax();
        setupOrgChartAnimation();
        setupFactsheetNav();
    });
})();
