// ============================================
// 0. TYPEWRITER ANIMATION
// ============================================
(function() {
    const roles = [
        'Content Strategist',
        'Social Media Specialist',
        'Content Creator',
        'Brand Storyteller',
        'Content System Builder',
    ];
    const el = document.getElementById('typewriter-text');
    if (!el) return;
    let roleIndex = 0, charIndex = 0, isDeleting = false;
    const typingSpeed = 80, deletingSpeed = 45, pauseAfterType = 1800, pauseAfterDelete = 400;
    function type() {
        const current = roles[roleIndex];
        if (!isDeleting) {
            el.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) { isDeleting = true; setTimeout(type, pauseAfterType); return; }
        } else {
            el.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(type, pauseAfterDelete); return; }
        }
        setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }
    setTimeout(type, 800);
})();

// ============================================
// 1. LOADER ANIMATION
// ============================================
(function() {
    const loader = document.querySelector('.loader-overlay');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progressText');
    let start = null;
    
    function animateLoader(ts) {
        if (!start) start = ts;
        const elapsed = ts - start;
        const progress = Math.min(elapsed / 2000, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        if (progressText) progressText.textContent = Math.round(eased * 100) + '%';
        if (progressFill) progressFill.style.width = (eased * 100) + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animateLoader);
        } else {
            setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 200);
        }
    }
    
    requestAnimationFrame(animateLoader);
})();

// ============================================
// 2. ROLLING NUMBER EFFECT
// ============================================
(function() {
    const rollNumbers = document.querySelectorAll('.impact-card .num');
    
    const rollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.rolled) {
                entry.target.dataset.rolled = 'true';
                
                let originalText = entry.target.innerText;
                let rawNumber = originalText.replace(/[^0-9.,]/g, '').replace(',', '.');
                let prefix = originalText.match(/^[^0-9]*/)[0];
                let suffix = originalText.match(/[^0-9]*$/)[0];
                let targetNumber = parseFloat(rawNumber);
                if (isNaN(targetNumber)) targetNumber = 0;
                
                let current = 0;
                const duration = 1500;
                const stepTime = 20;
                const steps = duration / stepTime;
                const increment = targetNumber / steps;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetNumber) {
                        current = targetNumber;
                        clearInterval(timer);
                    }
                    
                    let displayNumber = Number.isInteger(targetNumber) ? Math.floor(current) : current.toFixed(1);
                    entry.target.innerText = prefix + displayNumber + suffix;
                }, stepTime);
            }
        });
    }, { threshold: 0.3 });
    
    rollNumbers.forEach(el => rollObserver.observe(el));
})();

// ============================================
// 3. SMOOTH SCROLL NAVIGATION
// ============================================
(function() {
    const navTargets = document.querySelectorAll('.nav-link-button');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const sections = Array.from(document.querySelectorAll('.panel-item'));

    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenuButton) return;
        mobileMenu.classList.remove('open');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
    }

    navTargets.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section-target');
            let targetSection = document.getElementById(targetId);
            if (!targetSection) {
               targetSection = document.querySelector(`[data-panel="${targetId}"]`);
            }
            if (targetSection) {
                const offset = 90; // offset for fixed navbar
                const sectionTop = targetSection.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: sectionTop - offset, behavior: 'smooth' });
                closeMobileMenu();
            }
        });
    });

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.toggle('open');
            mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    window.addEventListener('scroll', () => {
        let current = 'home';
        const offset = 150;
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            if (window.scrollY >= (sectionTop - offset)) {
                current = sec.getAttribute('data-panel') || sec.getAttribute('id') || current;
            }
        });

        // Map bhakti and antikode → bluiestore for nav highlight (all 3 are "Experience")
        const navTarget = (current === 'bhakti' || current === 'antikode') ? 'bluiestore' : current;

        document.querySelectorAll('.nav-menu-desktop .nav-link-button, .mobile-menu .nav-link-button').forEach(link => {
            if (link.getAttribute('data-section-target') === navTarget) {
                link.classList.add('active-nav');
            } else {
                link.classList.remove('active-nav');
            }
        });

        // Back to top button visibility
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });
})();

// Back to top click handler
(function() {
    const btn = document.getElementById('back-to-top');
    if (btn) {
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();

// ============================================
// 3B. INTERNAL SUB-TABS
// ============================================
(function() {
    const subtabNavs = document.querySelectorAll('.subtab-nav[data-subtab-group]');

    function activateSubtab(groupName, targetName) {
        if (!groupName || !targetName) return;

        document.querySelectorAll(`.subtab-nav[data-subtab-group="${groupName}"] .subtab-button`).forEach(button => {
            button.classList.toggle('active-subtab', button.getAttribute('data-subtab-target') === targetName);
        });

        document.querySelectorAll(`.subtab-pane[data-subtab-group="${groupName}"]`).forEach(pane => {
            pane.classList.toggle('is-active', pane.getAttribute('data-subtab') === targetName);
        });
    }

    subtabNavs.forEach(nav => {
        const groupName = nav.getAttribute('data-subtab-group');
        const defaultSubtab = nav.getAttribute('data-default-subtab') || nav.querySelector('.subtab-button')?.getAttribute('data-subtab-target');

        nav.querySelectorAll('.subtab-button').forEach(button => {
            button.addEventListener('click', function() {
                activateSubtab(groupName, this.getAttribute('data-subtab-target'));
            });
        });

        if (defaultSubtab) activateSubtab(groupName, defaultSubtab);
    });
})();

// ============================================
// 4. TYPING EFFECT FOR TAGLINE
// ============================================
(function() {
    const taglineElement = document.querySelector('.hero-tagline');
    if (!taglineElement) return;
    
    const texts = [
        "Hello! Welcome to My Portofolio :)",
        "Interested in collaborating or have questions?"
    ];
    
    let textIndex = 0, charIndex = 0, isDeleting = false;
    
    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            taglineElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            taglineElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeEffect, 500);
            return;
        }
        
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
    
    taglineElement.style.borderRight = '2px solid #ec4899';
    typeEffect();
})();

// ============================================
// 5. 3D TILT EFFECT FOR PROFILE IMAGE
// ============================================
(function() {
    const profileImg = document.querySelector('.profile-new-img');
    const container = document.querySelector('.hero-new-photo');
    if (!profileImg || !container) return;
    
    container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 15;
        const rotateX = ((centerY - y) / centerY) * 15;
        
        profileImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        profileImg.style.transition = 'transform 0.1s ease-out';
    });
    
    container.addEventListener('mouseleave', function() {
        profileImg.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        profileImg.style.transition = 'transform 0.4s ease-out';
    });
})();

// ============================================
// 6. SCROLL REVEAL (EXCLUDE ANTIKODE)
// ============================================
(function() {
    const revealElements = document.querySelectorAll('section:not(#antikode), .about-card, .cg-box, .impact-card, .testi-card, .ak-dual-item, .project-card, .wording-card, .pillar-item, .highlight-card, .prod-stat, .ch-card, .tk-item, .other-card, .video-card, .sw-thumb-card, .catalog-item, .help-box, .strategy-line, .approach-box, .before-after-box, .ecosystem-box, .progression-box, .wf-flow-box, .alva-flow-box');
    
    revealElements.forEach(el => el.classList.add('scroll-reveal'));
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
})();

// ============================================
// 7. PROJECT FILTER BUTTONS
// ============================================
(function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeSlideUp 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
})();

// ============================================
// 8. PROJECT MODAL
// ============================================
const projectsData = [
    {
        title: "BLINDBOX SEEDKEEPERS",
        category: "Campaign",
        description: "A sustainability campaign for Earth Festival 2026 that combines the excitement of blindbox unboxing with eco-friendly seed planting.",
        longDescription: "This was my first campaign project, created from scratch as a merchandise proposal for @earthfestival.id / Earth Festival 2026. As part of my submission, I proposed a blindbox concept: something different from typical event merch. I developed six exclusive characters that embrace earth elements (earth, water, fire, cloud, leaf, rainbow), each with their own lore, personality, and rarity level.<br><br>The concept goes beyond a typical blindbox. To align with Earth Festival's mission of sustainability and the 3R principles (Reuse, Reduce, Recycle), every box contains a handmade amigurumi character, real seeds to plant, and packaging made from recycled paper. It is crafted to encourage action, and will last, not a disposable item only. I also designed a two-level game ecosystem using ARG mechanics, where collectors solve riddles, post proof on social media, and unlock exclusive access to pop-up events and discounts.<br><br>I researched two local vendors, calculated production costs (HPP Rp145K per box), set a selling price of Rp219K, and projected a 47.27% ROI across presale and a three-day main event. The concept was well received and approved in principle, but ultimately put on hold because the team decided to focus on other priorities for the year.",
        image: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/blindbox-campaign.png?raw=true",
        media: [
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/the-seed-keepers.png?raw=true", title: "Blindbox Campaign Teaser", views: "The SeedKeepers" },
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/the-blindbox-experience.png?raw=true", title: "Campaign Teaser", views: "Experience" }
        ],
        tech: ["Campaign Strategy", "Concept Development", "Character Design", "Financial Projection"],
        demoLink: "https://drive.google.com/file/d/1FXKsr5Bdu3dFxP1xPqcD9kAzUccKPNE4/view?usp=sharing",
        results: "This project taught me how to turn a creative idea into a complete, numbers-backed proposal and how to accept that timing matters as much as quality.",
        linkable: false
    },
    {
        title: "HEALME OFFICIAL",
        category: "Content Creation",
        description: "Led a team to build a TikTok brand from scratch  including content strategy, video production, and brand building for dietary tips and healthy lifestyle",
        longDescription: "This was a university social media course project. The goal was to use digital media as a tool to produce innovative content that benefits society, aligned with SDG 3 (Good Health and Well-Being).<br><br>The Brand: HEALME (Healthy Me) is a TikTok account dedicated to sharing dietary tips, healthy lifestyle content, and engaging meal plans. The target audience is people struggling with obesity or those on a diet journey looking for effective, sustainable healthy habits.<br><br>I led a small team of 5 members. My responsibilities included delegating tasks (content research, scripting, filming, editing), ensuring deadlines were met, maintaining brand consistency, and editing most of the video content myself. I also coordinated with team members to align every content element from location, music, title, hashtags, conflict, solution, to gimmick.",
        image: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/healme-official.jpeg?raw=true",
        media: [
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/healme-2.jpeg?raw=true", link: "https://www.tiktok.com/@healme.official/photo/7434355070466116882", title: "Pola Makanan Diet", views: "16.6K views" },
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/healme-1.jpeg?raw=true", link: "https://www.tiktok.com/@healme.official/photo/7439352567299296567", title: "5 Kesalahan Diet IF", views: "4.7K views" },
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/healme-3.jpg?raw=true", link: "https://www.tiktok.com/@healme.official/video/7423330805637795078", title: "Weight Loss vs Fat Loss", views: "3.8K views" },
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/healme-4.jpg?raw=true", link: "https://www.tiktok.com/@healme.official/video/7421558920440827142", title: "Cheating Day Don't Worry!", views: "3.6K views" }
        ],
        tech: ["CapCut", "TikTok Trends", "Video Editing", "Content Strategy", "Team Leadership"],
        demoLink: "https://www.tiktok.com/@healme.official",
        results: "Reaching over 30K+ combined views across 4 selected content pieces.",
        linkable: true
    },
    {
        title: "HEIHA TOUR TRAVEL",
        category: "Content Creation",
        description: "Created 5 Instagram feed designs and 1 story design for a tour and travel brand, including a visual system for future consistency.",
        longDescription: "I was responsible for the visual content design based on the client's requests. Each design was tailored to highlight destinations, travel tips, and promotional content to attract potential travelers.<br><br>I chose blue and white as the primary colors to reflect trust, professionalism, and a fresh travel vibe, aligning with the brand's identity as a tour operator. The layout was structured to be clean, scannable, and visually engaging.<br><br>The brand had no dedicated designer before this. I didn't just create individual posts, I built a visual system and mood board so future designers could maintain consistency. Unfortunately, the client didn't continue the visual direction after my work, likely due to not having a designer on board yet. But the system is ready whenever they are.",
        image: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/heiha-tour.jpg?raw=true",
        media: [
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/heiha-1.webp?raw=true", link: "https://www.instagram.com/p/DUFmzP7EXf_/", title: "Brand Promotion", views: "Feed Design" },
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/heiha-2.webp?raw=true", link: "https://www.instagram.com/p/DUKZ83ykQxK/", title: "Destination Documentary", views: "Carousel Feed Design" },
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/heiha-3.webp?raw=true", link: "https://www.instagram.com/p/DUSPpe1kYJZ/", title: "Destination Documentary", views: "Carousel Feed Design" },
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/heiha-4.webp?raw=true", link: "https://www.instagram.com/p/DUZ_zUekbZ2/", title: "Destination Documentary", views: "Carousel Feed Design" },
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/heiha-5.webp?raw=true", link: "https://www.instagram.com/p/DUkTtT5EQ_6/", title: "Destination Recommendation", views: "Feed Design" },
            { type: "image", url: "https://github.com/heyfeliciaangel/design-web-portofolio/blob/main/images/heiha-story.webp?raw=true", link: "https://www.instagram.com/stories/highlights/18133346266512094/", title: "Brand Promotion", views: "Story Design" }
        ],
        tech: ["Canva", "Feed Design", "Story Design", "Visual Identity", "Moodboard"],
        demoLink: "https://www.instagram.com/heihatourtravel",
        results: "6 designs delivered (5 feed + 1 story) for brand consistency",
        linkable: true
    }
];

(function() {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDesc = document.getElementById('modalDesc');
    const modalLongDesc = document.getElementById('modalLongDesc');
    const modalContentGrid = document.getElementById('modalContentGrid');
    const modalTech = document.getElementById('modalTech');
    const modalResults = document.getElementById('modalResults');
    const modalLinks = document.getElementById('modalLinks');
    const closeBtn = document.querySelector('.modal-close');
    
    function openModal(projectId) {
        const project = projectsData[projectId];
        if (!project) return;
        
        modalTitle.textContent = project.title;
        modalCategory.textContent = project.category;
        modalDesc.textContent = project.description;
        
        // Long description
        if (modalLongDesc) {
            if (project.longDescription) {
                modalLongDesc.innerHTML = project.longDescription;
                modalLongDesc.style.display = 'block';
            } else {
                modalLongDesc.style.display = 'none';
            }
        }
        
        // Media grid
        if (modalContentGrid && project.media && project.media.length > 0) {
            modalContentGrid.innerHTML = '';
            project.media.forEach(media => {
                const hasLink = media.link && media.link !== '#' && media.link !== '';
                const isLinkable = media.linkable !== false;
                const gridItem = document.createElement('div');
                gridItem.className = 'modal-content-item';
                if (hasLink && isLinkable) {
                    gridItem.onclick = () => window.open(media.link, '_blank');
                    gridItem.style.cursor = 'pointer';
                }
                gridItem.innerHTML = `
                    <div class="modal-content-img">
                        <img src="${media.url}" alt="${media.title || ''}">
                        ${hasLink && isLinkable ? '<div class="modal-content-play">▶</div>' : ''}
                    </div>
                    <div class="modal-content-caption">
                        <div class="caption-title">${media.title || ''}</div>
                        <div class="caption-views">${media.views || ''}</div>
                    </div>
                `;
                modalContentGrid.appendChild(gridItem);
            });
        }
        
        // Tech stack
        if (modalTech) {
            modalTech.innerHTML = '';
            project.tech.forEach(tech => {
                const span = document.createElement('span');
                span.textContent = tech;
                modalTech.appendChild(span);
            });
        }
        
        // Results
        if (modalResults && project.results) {
            modalResults.innerHTML = `<strong>📊 Key Results:</strong> ${project.results}`;
        }
        
        // Links
        if (modalLinks) {
            modalLinks.innerHTML = '';
            if (project.demoLink) {
                const demoLink = document.createElement('a');
                demoLink.href = project.demoLink;
                demoLink.target = '_blank';
                demoLink.className = 'modal-link';

                demoLink.innerHTML = '🔗 View More';
                modalLinks.appendChild(demoLink);
            }
        }
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.addEventListener('click', (e) => {

            if (e.target.closest('a')) return;
            openModal(index);
        });
    });
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal?.classList.contains('show')) closeModal(); });
})();
