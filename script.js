
        /* =============================================
           EMAILJS CONFIG — apni keys yahan daalo
        ============================================= */
        const EMAILJS_PUBLIC_KEY = 'MD9t_azSrPqT2IEgT'; // EmailJS dashboard > Account
        const EMAILJS_SERVICE_ID = 'service_nprhedf'; // EmailJS dashboard > Email Services
        const EMAILJS_TEMPLATE_ID = 'template_osaivqq'; // EmailJS dashboard > Email Templates

        emailjs.init(EMAILJS_PUBLIC_KEY);

        /* =============================================
           1. COUNTER ANIMATION
        ============================================= */
        const counters = document.querySelectorAll('.counter');
        let countersStarted = false;

        function startCounters() {
            if (countersStarted) return;
            countersStarted = true;
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-count');
                    const count = +counter.innerText;
                    const inc = Math.max(target / 60, 1);
                    if (count < target) {
                        counter.innerText = Math.min(Math.ceil(count + inc), target);
                        setTimeout(updateCount, 25);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        }

        /* =============================================
           2. NAVBAR SCROLL + ACTIVE LINK
        ============================================= */
        const mainNav = document.getElementById('mainNav');
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => mainNav.classList.toggle('scrolled', window.scrollY > 50));

        const navObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === id));
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

        sections.forEach(sec => navObserver.observe(sec));

        const mainMenu = document.getElementById('mainMenu');
        const bsCollapse = mainMenu ? new bootstrap.Collapse(mainMenu, { toggle: false }) : null;
        document.querySelectorAll('#mainMenu .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (mainMenu.classList.contains('show') && bsCollapse) bsCollapse.hide();
            });
        });

        /* =============================================
           3. THEME TOGGLE
        ============================================= */
        const html = document.documentElement;
        const themeSwitch = document.getElementById('themeSwitch');
        const themeIcon = document.getElementById('themeIcon');

        function setTheme(theme) {
            html.setAttribute('data-theme', theme);
            if (theme === 'light') {
                themeIcon.classList.replace('bi-moon-stars', 'bi-sun-fill');
            } else {
                themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars');
            }
        }
        setTheme('dark');

        themeSwitch.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            setTheme(next);
            themeIcon.style.transform = 'rotate(360deg)';
            setTimeout(() => { themeIcon.style.transform = 'rotate(0deg)'; }, 400);
        });

        /* =============================================
           4. SCROLL REVEAL
        ============================================= */
        const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    if (entry.target.closest('.counter-section')) startCounters();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(el => revealObserver.observe(el));

        document.querySelectorAll('#serviceCards .service-card').forEach((el, i) => el.style.transitionDelay = (i * 0.12) +
            's');
        document.querySelectorAll('.portfolio-card.reveal').forEach((el, i) => el.style.transitionDelay = (i * 0.1) + 's');
        document.querySelectorAll('.counter-box.reveal').forEach((el, i) => el.style.transitionDelay = (i * 0.1) + 's');

        /* =============================================
           5. 3D TILT
        ============================================= */
        function applyTilt(el, intensity = 8) {
            el.addEventListener('mousemove', e => {
                const r = el.getBoundingClientRect();
                const rx = ((e.clientY - r.top) / r.height - 0.5) * -intensity;
                const ry = ((e.clientX - r.left) / r.width - 0.5) * intensity;
                el.style.transform =
                    `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
            });
            el.addEventListener('mouseleave', () => el.style.transform =
                'perspective(1000px) rotateX(0) rotateY(0) translateY(0)');
        }
        document.querySelectorAll('.tilt-card').forEach(el => applyTilt(el));

        ['heroTilt', 'aboutTilt'].forEach(id => {
            const wrap = document.getElementById(id);
            const img = wrap?.querySelector('img');
            if (!wrap || !img) return;
            wrap.addEventListener('mousemove', e => {
                const r = wrap.getBoundingClientRect();
                const rx = ((e.clientY - r.top) / r.height - 0.5) * -14;
                const ry = ((e.clientX - r.left) / r.width - 0.5) * 14;
                img.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            });
            wrap.addEventListener('mouseleave', () => img.style.transform =
                'perspective(1000px) rotateX(0) rotateY(0)');
        });

        /* =============================================
           6. SERVICE DOTS
        ============================================= */
        const serviceDots = document.querySelectorAll('.service-dots .dot');
        const serviceCardsList = document.querySelectorAll('#serviceCards .service-card');
        serviceDots.forEach(dot => {
            dot.addEventListener('click', () => {
                serviceDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                const idx = +dot.getAttribute('data-target');
                serviceCardsList.forEach((card, i) => card.classList.toggle('active-service', i === idx));
            });
        });

        /* =========================
           CONTACT FORM + VALIDATION + EMAILJS + HIDDEN TIME
        ========================= */

        const fieldRules = [{
            id: 'cf-name',
            msgId: 'msg-name',
            validate: v => v.trim().length >= 2,
            error: 'Name kam se kam 2 characters ka hona chahiye.',
            success: 'Good!'
        }, {
            id: 'cf-email',
            msgId: 'msg-email',
            validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            error: 'Valid email daalo.',
            success: 'OK!'
        }, {
            id: 'cf-phone',
            msgId: 'msg-phone',
            validate: v => /^[0-9]{7,15}$/.test(v.trim()),
            error: '7-15 digits only.',
            success: 'OK!'
        }, {
            id: 'cf-message',
            msgId: 'msg-message',
            validate: v => v.trim().length >= 10,
            error: 'Min 10 characters required.',
            success: ''
        }];

        // validate single field
        function validateField(rule) {
            const input = document.getElementById(rule.id);
            const msg = document.getElementById(rule.msgId);
            const val = input.value;
            const ok = rule.validate(val);

            input.classList.toggle('is-valid', ok);
            input.classList.toggle('is-invalid', !ok && val.length > 0);

            if (!ok && val.length > 0) {
                msg.textContent = rule.error;
                msg.className = 'field-msg error';
            } else if (ok && rule.success) {
                msg.textContent = rule.success;
                msg.className = 'field-msg success';
            } else {
                msg.textContent = '';
                msg.className = 'field-msg';
            }

            return ok;
        }

        // live validation
        fieldRules.forEach(rule => {
            const input = document.getElementById(rule.id);
            input.addEventListener('input', () => validateField(rule));
            input.addEventListener('blur', () => validateField(rule));
        });

        const contactForm = document.getElementById('contactForm');
        const sendBtn = document.getElementById('sendBtn');
        const sendBtnText = document.getElementById('sendBtnText');
        const sendBtnIcon = document.getElementById('sendBtnIcon');
        const formFeedback = document.getElementById('formFeedback');

        function showFeedback(msg, isError = false) {
            formFeedback.innerHTML = isError ?
                `<i class="bi bi-x-circle-fill me-2"></i>${msg}` :
                `<i class="bi bi-check-circle-fill me-2"></i>${msg}`;

            formFeedback.className =
                'form-feedback show' + (isError ? ' error-feedback' : '');

            setTimeout(() => formFeedback.classList.remove('show'), 6000);
        }

        contactForm.addEventListener('submit', async e => {
            console.log("Form submit triggered");
            e.preventDefault();

            // validation check
            let allValid = true;
            fieldRules.forEach(rule => {
                if (!validateField(rule)) allValid = false;
            });

            if (!allValid) {
                showFeedback('Please check all fields.', true);
                return;
            }

            const countryCode = document.getElementById('cf-country-code').value;
            const phone = document.getElementById('cf-phone').value.trim();

            /* =========================
               🔥 HIDDEN TIME SET
            ========================= */
            document.getElementById('cf-time').value =
                new Date().toLocaleString('en-IN', {
                    dateStyle: 'full',
                    timeStyle: 'medium'
                });

            // loading state
            sendBtn.disabled = true;
            sendBtnText.textContent = 'Sending...';
            sendBtnIcon.className = 'spinner-border spinner-border-sm';

            const templateParams = {
                from_name: document.getElementById('cf-name').value.trim(),
                from_email: document.getElementById('cf-email').value.trim(),
                phone_number: `${countryCode} ${phone}`,
                message: document.getElementById('cf-message').value.trim(),

                // 🔥 hidden time sent to email
                time: document.getElementById('cf-time').value
            };
            console.log(templateParams);


            try {
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    templateParams
                );

                // ✅ SUCCESS MESSAGE
                Swal.fire({
                    icon: "success",
                    title: "🚀 Message Sent Successfully!",
                    html: `
                    <div style="font-size:16px;line-height:1.8">
                        Thank you for reaching out! 🙌<br><br>
                        Your message has been successfully received.<br>
                        I'll get back to you within <b>24 hours</b>.<br><br>
                        <span style="color:#6366f1;">Have a wonderful day! 💜</span>
                    </div>
                `,
                    confirmButtonText: "Continue",
                    confirmButtonColor: "#6366f1",
                    timer: 6000,
                    timerProgressBar: true
                });

                contactForm.reset();

                // clear validation
                fieldRules.forEach(rule => {
                    const inp = document.getElementById(rule.id);
                    inp.classList.remove('is-valid', 'is-invalid');
                    document.getElementById(rule.msgId).textContent = '';
                    document.getElementById(rule.msgId).className = 'field-msg';
                });

            } catch (err) {
                console.error(err);
                showFeedback('Message send nahi hua. Try again later.', true);
            } finally {
                sendBtn.disabled = false;
                sendBtnText.textContent = 'Send Message';
                sendBtnIcon.className = 'bi bi-send';
            }
        });

        // year
        document.getElementById("year").textContent = new Date().getFullYear();

        // text typing effect
        const texts = [
            "Full Stack Developer.",
            "Laravel Developer.",
            "Freelancer."
        ];

        let index = 0;
        let charIndex = 0;
        let currentText = "";
        let isDeleting = false;

        function typeEffect() {
            currentText = texts[index];

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            document.getElementById("typing-text").innerHTML =
                currentText.substring(0, charIndex);

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1000);
                return;
            }

            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % texts.length;
            }

            setTimeout(typeEffect, isDeleting ? 60 : 120);
        }

        typeEffect();

        // month experience
        function updateExperience() {
            const startDate = new Date("2025-11-01");
            const today = new Date();

            let months =
                (today.getFullYear() - startDate.getFullYear()) * 12 +
                (today.getMonth() - startDate.getMonth());

            if (months < 0) months = 0;

            document.getElementById("exp").innerText = months;
        }

        updateExperience();

        /* =========================
           MOBILE NAV AUTO CLOSE FIX
        ========================= */

        const navbarCollapse = document.getElementById('mainMenu');
        const bsNavbar = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });

        // close on link click (IMPORTANT FIX)
        document.querySelectorAll('#mainMenu .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    bsNavbar.hide();
                }
            });
        });

        // close on outside click (optional but good UX)
        document.addEventListener('click', (e) => {
            const isClickInside = navbarCollapse.contains(e.target) || e.target.closest('.navbar-toggler');
            if (!isClickInside && navbarCollapse.classList.contains('show')) {
                bsNavbar.hide();
            }
        });
    