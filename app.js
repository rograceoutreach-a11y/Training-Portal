/* ═══════════════════════════════════════════════════════════════════════════
   REFLECTIONS OF GRACE — MASTER TRAINING PORTAL
   src/app.js — Free Enrollment Counter + Donation Only
   ═══════════════════════════════════════════════════════════════════════════
   WHAT CHANGED:
   • Enrollment is now FREE — no payment required to enroll or access phases
   • Enrollment counter tracks how many people have enrolled (stored locally)
   • Donation buttons open a give page with $10 or $50 preset amounts
   • Stripe is used ONLY for donations — not for enrollment or module access
   • All phase/module content is freely accessible after free enrollment
   ═══════════════════════════════════════════════════════════════════════════

   STRIPE DONATION SETUP (one-time):
   1. Go to dashboard.stripe.com → Payment Links → + Create
   2. Product name: "Ministry Donation"
      Create two links: one for $10, one for $50
      Also one "Customer chooses price" link for custom amounts
   3. After-payment redirect: https://reflectionsofgracebiblestudies.netlify.app/#/thankyou
   4. Paste your links into DONATE_LINKS below
   5. Commit → Netlify redeploys in ~60 seconds
*/

// ── DONATION STRIPE LINKS ─────────────────────────────────────────────────
// Replace with your real Stripe Payment Links from dashboard.stripe.com
// After-payment redirect: https://reflectionsofgracebiblestudies.netlify.app/#/thankyou
const DONATE_LINKS = {
  ten:    "https://reflectionsofgracebiblestudies.netlify.app/#/thankyou",
  fifty:  "https://reflectionsofgracebiblestudies.netlify.app/#/thankyou",
  custom: "https://reflectionsofgracebiblestudies.netlify.app/#/thankyou",
};

// ── ENROLLMENT COUNTER ────────────────────────────────────────────────────
const ENROLLMENT_KEY = 'rog_enrollment_count';
const BASE_COUNT = 47;

function getEnrollmentCount() {
  return parseInt(localStorage.getItem(ENROLLMENT_KEY) || BASE_COUNT, 10);
}
function incrementEnrollment() {
  const next = getEnrollmentCount() + 1;
  localStorage.setItem(ENROLLMENT_KEY, next);
  return next;
}
function hasEnrolled() {
  return localStorage.getItem('rog_enrolled') === 'true';
}
function setEnrolled() {
  localStorage.setItem('rog_enrolled', 'true');
  incrementEnrollment();
}

// ── MODULE DATA ────────────────────────────────────────────────────────────
const MODULES = [
  { num:"01", color:"#1B3A6B", title:"Biblical Foundations", sub:"The Word, the World, and the Believer", desc:"Establish a solid scriptural foundation for Christian life and ministry. Covers biblical authority, hermeneutics, Old and New Testament survey, and the theology of discipleship.", weeks:"3 weeks", lessons:"6 lessons" },
  { num:"02", color:"#2E5FA3", title:"The Vacuum Effect", sub:"What Happens When Spiritual Truth Is Removed", desc:"Examines what fills the spiritual vacuum when the Church retreats from culture — principalities, ideologies, and counterfeit spiritualities — and equips believers to stand firm.", weeks:"3 weeks", lessons:"6 lessons" },
  { num:"03", color:"#B8860B", title:"Integrated Christian Counseling", sub:"Theology, Psychology, and the Counseling Call", desc:"A professional-grade certificate program uniting evidence-based therapeutic practice with biblical principles, spiritual formation, and whole-person care.", weeks:"3 weeks", lessons:"6 lessons" },
  { num:"04", color:"#1B5E20", title:"Now Is the Time to Believe", sub:"Faith, Urgency, and the Prophetic Hour", desc:"An eschatological and evangelistic training on the urgency of the Gospel in the present cultural moment, with practical tools for personal witness and community engagement.", weeks:"3 weeks", lessons:"6 lessons" },
  { num:"05", color:"#7B1A1A", title:"It Shouldn't Be in the Church", sub:"Confronting What Defiles the Body of Christ", desc:"A courageous look at the sins, compromise, and principalities that have infiltrated the modern church — and a call to holiness, accountability, and redemptive community.", weeks:"3 weeks", lessons:"6 lessons" },
  { num:"06", color:"#4A148C", title:"Generation X Left the Church", sub:"Now All Hell Broke Loose: The Last Connection to the Old-Time Way", desc:"Based on Thomas E. Walker's manuscript (2025). Examines how Gen X's departure from institutional church life created a cascading spiritual crisis across Millennials, Gen Z, and Alpha.", weeks:"3 weeks", lessons:"6 lessons" }
];

// ── ROUTER ─────────────────────────────────────────────────────────────────
const view = document.getElementById('view');

function getPath() { return window.location.hash.replace('#','') || '/'; }

function render() {
  const path = getPath();
  setActiveNav(path);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const routes = { '/':renderHome, '/courses':renderCourses, '/donate':renderDonate, '/about':renderAbout, '/enroll':renderEnroll, '/thankyou':renderThankYou, '/enrolled':renderEnrolled };
  (routes[path] || render404)();
}

function setActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href').replace('#','');
    if (href === path || (href==='/' && (path==='/'||path===''))) a.classList.add('active');
  });
}

window.addEventListener('scroll', () => { document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20); });
document.getElementById('navToggle').addEventListener('click', () => { document.getElementById('navLinks').classList.toggle('open'); });
document.getElementById('navLinks').addEventListener('click', () => { document.getElementById('navLinks').classList.remove('open'); });

// ── HOME ───────────────────────────────────────────────────────────────────
function renderHome() {
  const count = getEnrollmentCount();
  view.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow">✝ Reflections of Grace Outreach Ministries</div>
        <h1>Master <span>Training</span> Portal</h1>
        <p class="hero-author">Thomas E. Walker, MDiv. · Moreno Valley, CA</p>
        <p class="hero-desc">Six phases of ministry training — from biblical foundations to integrated Christian counseling. Scholarly depth. Pastoral heart. Spirit-led formation. <strong style="color:var(--gold-lt)">Free to enroll.</strong></p>
        <div class="stats">
          <div class="stat"><div class="stat-num">6</div><div class="stat-label">Phases</div></div>
          <div class="stat"><div class="stat-num">36</div><div class="stat-label">Lessons</div></div>
          <div class="stat"><div class="stat-num">18</div><div class="stat-label">Weeks</div></div>
          <div class="stat"><div class="stat-num">${count}</div><div class="stat-label">Enrolled</div></div>
        </div>
        <div class="hero-cta">
          <a href="#/enroll" class="btn btn-primary btn-lg">✝ Enroll Free</a>
          <a href="#/courses" class="btn btn-outline btn-lg">View All Phases</a>
          <a href="#/donate" class="btn btn-green btn-lg">❤ Give / Donate</a>
        </div>
      </div>
    </section>

    <div style="background:var(--green);padding:18px 24px;text-align:center;border-bottom:3px solid var(--gold)">
      <p style="color:#fff;font-size:16px;font-weight:600;margin:0">✅ All six phases are <strong>completely free</strong> to enroll and access. Support the ministry through a <a href="#/donate" style="color:var(--gold-lt);text-decoration:underline;font-weight:700">voluntary donation of $10 or $50</a>.</p>
    </div>

    <section class="bg-white">
      <div class="sec-inner">
        <div class="sec-eyebrow">Six-Phase Certificate Program</div>
        <h2 class="sec-title">Free Ministry Training</h2>
        <p class="sec-desc">Each phase builds on the last — from foundational Scripture to advanced counseling practice and cultural engagement. No payment required.</p>
        <div class="modules-grid">
          ${MODULES.map(m=>`
            <div class="mod-card">
              <div class="mod-num" style="background:${m.color}">${m.num}</div>
              <h3 class="mod-title">${m.title}</h3>
              <p class="mod-sub">${m.sub}</p>
              <p class="mod-desc">${m.desc}</p>
              <div class="mod-meta">
                <span class="badge">📅 ${m.weeks}</span>
                <span class="badge">📖 ${m.lessons}</span>
                <span class="badge" style="background:#e8f5e9;color:#1B5E20;font-weight:700">✅ Free Access</span>
              </div>
            </div>`).join('')}
        </div>
        <div style="text-align:center;margin-top:44px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
          <a href="#/enroll" class="btn btn-navy btn-lg">✝ Enroll Free — Start Today</a>
          <a href="#/donate" class="btn btn-green btn-lg">❤ Support the Ministry</a>
        </div>
      </div>
    </section>

    <section class="bg-gray">
      <div class="sec-inner" style="text-align:center">
        <div class="sec-eyebrow">Our Mission</div>
        <h2 class="sec-title" style="margin:0 auto 14px">Equipping the Saints — Free of Charge</h2>
        <p class="sec-desc" style="margin:0 auto 36px">We believe God's Word should be accessible to everyone. All six phases of this training are free. If the ministry has blessed you, consider blessing others with a gift.</p>
        <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap">
          <a href="#/donate" class="btn btn-primary btn-lg">❤ Give $10</a>
          <a href="#/donate" class="btn btn-green btn-lg">❤ Give $50</a>
        </div>
        <p style="margin-top:20px;font-size:14px;color:var(--gray3);font-style:italic">"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7</p>
      </div>
    </section>`;
}

// ── COURSES ────────────────────────────────────────────────────────────────
function renderCourses() {
  view.innerHTML = `
    <div class="donate-page">
      <div class="donate-header sec-inner" style="max-width:700px">
        <div class="sec-eyebrow">All Six Phases — Free Access</div>
        <h1 style="font-family:var(--ff-display);font-size:clamp(26px,4vw,42px);color:var(--navy);font-weight:700;margin:10px 0 14px;line-height:1.2">Complete Course Catalog</h1>
        <p style="font-size:17px;color:var(--gray3);line-height:1.75">Six phases. Eighteen weeks. One certificate. All content developed by Thomas E. Walker, MDiv. <strong style="color:var(--green)">Free to enroll and access.</strong></p>
      </div>
      <div class="sec-inner">
        <div class="modules-grid">
          ${MODULES.map(m=>`
            <div class="mod-card">
              <div class="mod-num" style="background:${m.color}">${m.num}</div>
              <h3 class="mod-title">${m.title}</h3>
              <p class="mod-sub">${m.sub}</p>
              <p class="mod-desc">${m.desc}</p>
              <div class="mod-meta">
                <span class="badge">📅 ${m.weeks}</span>
                <span class="badge">📖 ${m.lessons}</span>
                <span class="badge" style="background:#e8f5e9;color:#1B5E20;font-weight:700">✅ Free</span>
              </div>
            </div>`).join('')}
        </div>
        <div style="text-align:center;margin-top:52px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
          <a href="#/enroll" class="btn btn-navy btn-lg">✝ Enroll Free</a>
          <a href="#/donate" class="btn btn-green btn-lg">❤ Support the Ministry</a>
        </div>
      </div>
    </div>`;
}

// ── DONATE ─────────────────────────────────────────────────────────────────
function renderDonate() {
  view.innerHTML = `
    <div class="donate-page">
      <div class="donate-header">
        <div class="sec-eyebrow">Support the Ministry</div>
        <h1>Give to Reflections of Grace</h1>
        <p>All six phases of training are completely free. If this ministry has blessed you, please consider sowing a seed to help us reach more people with God's Word.</p>
      </div>
      <div style="max-width:700px;margin:0 auto;padding:0 24px">

        <div class="donate-card" style="margin-bottom:20px">
          <div class="donate-card-hdr" style="border-top:4px solid var(--gold)">
            <h2>🌱 Give $10 — Plant a Seed</h2>
            <p>A $10 gift helps cover the costs of hosting, tools, and resources that keep this training free for everyone.</p>
          </div>
          <div class="donate-card-body">
            <p class="donate-note" style="margin-bottom:20px">Every seed sown in faith returns a harvest. Thank you for helping us keep God's Word free and accessible.</p>
            <button class="btn btn-primary btn-full" style="font-size:17px;padding:16px" onclick="handleDonation('ten')">❤ Give $10 — Secure Payment</button>
            <div class="stripe-badge" style="margin-top:10px">🔒 Secured by Stripe · SSL Encrypted</div>
          </div>
        </div>

        <div class="donate-card" style="margin-bottom:20px">
          <div class="donate-card-hdr" style="border-top:4px solid var(--green)">
            <h2>🌳 Give $50 — Grow the Ministry</h2>
            <p>A $50 gift helps fund new course development, outreach tools, and ministry expansion.</p>
          </div>
          <div class="donate-card-body">
            <p class="donate-note" style="margin-bottom:20px">"Give, and it will be given to you. A good measure, pressed down, shaken together and running over." — Luke 6:38</p>
            <button class="btn btn-green btn-full" style="font-size:17px;padding:16px" onclick="handleDonation('fifty')">❤ Give $50 — Secure Payment</button>
            <div class="stripe-badge" style="margin-top:10px">🔒 Secured by Stripe · SSL Encrypted</div>
          </div>
        </div>

        <div class="donate-card" style="margin-bottom:40px">
          <div class="donate-card-hdr" style="border-top:4px solid var(--navy)">
            <h2>✝ Give Another Amount</h2>
            <p>Choose the amount that God has placed on your heart.</p>
          </div>
          <div class="donate-card-body">
            <input type="number" id="customAmount" class="custom-amount" placeholder="Enter amount in dollars (e.g. 25)" min="1" style="margin-bottom:16px" />
            <button class="btn btn-navy btn-full" style="font-size:17px;padding:16px" onclick="handleCustomDonation()">❤ Give This Amount — Secure Payment</button>
            <div class="stripe-badge" style="margin-top:10px">🔒 Secured by Stripe · SSL Encrypted</div>
          </div>
        </div>

        <div style="text-align:center;padding:32px 0 16px">
          <p style="font-family:var(--ff-display);font-size:18px;color:var(--navy);font-style:italic;line-height:1.75">"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."</p>
          <p style="color:var(--gold);font-size:14px;font-weight:700;margin-top:10px">2 Corinthians 9:7 NIV</p>
        </div>
      </div>
    </div>`;
}

function handleDonation(type) {
  const link = DONATE_LINKS[type];
  if (link.includes('thankyou')) {
    alert("⚙️ To activate Stripe donations:\n\n1. Go to dashboard.stripe.com → Payment Links → + Create\n2. Set a fixed price ($10 or $50)\n3. After-payment redirect:\n   https://reflectionsofgracebiblestudies.netlify.app/#/thankyou\n4. Copy the buy.stripe.com link\n5. Paste into DONATE_LINKS in src/app.js and commit to GitHub");
    return;
  }
  window.location.href = link;
}

function handleCustomDonation() {
  const amount = document.getElementById('customAmount').value;
  if (!amount || parseInt(amount) < 1) { alert('Please enter a donation amount of at least $1.'); return; }
  handleDonation('custom');
}

// ── ABOUT ──────────────────────────────────────────────────────────────────
function renderAbout() {
  view.innerHTML = `
    <section class="bg-gray" style="padding-top:calc(var(--nav-h) + 60px);min-height:100vh">
      <div class="sec-inner">
        <div class="sec-eyebrow">About the Instructor</div>
        <h1 class="sec-title">Thomas E. Walker, MDiv.</h1>
        <div class="about-grid">
          <div class="about-quote">
            <p>"For we do not wrestle against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this age, against spiritual hosts of wickedness in the heavenly places."</p>
            <cite>Ephesians 6:12 NKJV</cite>
          </div>
          <div class="about-content">
            <h3>Pastor · Author · Educator</h3>
            <p>Thomas E. Walker holds a Master of Divinity in Pastoral Counseling and serves as the founder of Reflections of Grace Outreach Ministries, Inc., based in Moreno Valley, California.</p>
            <p>He is the author of <em>Generation X Left the Church, Now All Hell Broke Loose: The Last Connection to the Old-Time Way</em> (2025, ISBN: 978-0-9830162-8-1) and the developer of this six-phase free training program.</p>
            <div class="creds">
              <div class="cred"><span class="cred-icon">🎓</span><span>Master of Divinity in Pastoral Counseling</span></div>
              <div class="cred"><span class="cred-icon">✝</span><span>Founder, Reflections of Grace Outreach Ministries, Inc. (501c3)</span></div>
              <div class="cred"><span class="cred-icon">📖</span><span>Author, <em>Generation X Left the Church</em> (2025)</span></div>
              <div class="cred"><span class="cred-icon">📍</span><span>Moreno Valley, California</span></div>
            </div>
            <div style="margin-top:28px;display:flex;gap:14px;flex-wrap:wrap">
              <a href="#/enroll" class="btn btn-primary">✝ Enroll Free</a>
              <a href="#/donate" class="btn btn-green">❤ Support the Ministry</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

// ── ENROLL (FREE) ──────────────────────────────────────────────────────────
function renderEnroll() {
  const count    = getEnrollmentCount();
  const enrolled = hasEnrolled();
  view.innerHTML = `
    <div class="enroll-page">
      <div class="enroll-inner">
        <div style="background:var(--navy);border-radius:14px;padding:24px 32px;text-align:center;margin-bottom:36px;border:2px solid var(--gold)">
          <p style="color:rgba(255,255,255,.65);font-size:13px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">People Currently Enrolled</p>
          <div style="font-family:var(--ff-display);font-size:56px;color:var(--gold-lt);font-weight:700;line-height:1">${count}</div>
          <p style="color:rgba(255,255,255,.6);font-size:14px;margin-top:6px">and growing — join them today, <strong style="color:#fff">free of charge</strong></p>
        </div>
        <div class="enroll-hdr">
          <span class="sec-eyebrow">✝ Free Enrollment</span>
          <h1>Enroll in the Master Training Portal</h1>
          <p>Six phases. Eighteen weeks. One transformative certificate in ministry and integrated Christian counseling — <strong>completely free</strong>. No payment required.</p>
        </div>
        ${enrolled ? `
          <div style="background:#e8f5e9;border:2px solid var(--green);border-radius:14px;padding:36px;text-align:center;margin-bottom:28px">
            <div style="font-size:48px;margin-bottom:12px">✅</div>
            <h2 style="font-family:var(--ff-display);color:var(--green);margin-bottom:10px">You're already enrolled!</h2>
            <p style="color:var(--gray3);font-size:16px;line-height:1.7">You have already enrolled in the Master Training Portal. All six phases are open and available to you. God bless your studies!</p>
            <div style="margin-top:24px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
              <a href="#/courses" class="btn btn-navy">View All Phases</a>
              <a href="#/donate" class="btn btn-green">❤ Support the Ministry</a>
            </div>
          </div>` : `
          <div class="enroll-card">
            <div class="enroll-card-hdr">
              <h2>Free Enrollment Form</h2>
              <p>Fill in your details below — no payment information required.</p>
            </div>
            <form class="enroll-form" id="enrollForm" novalidate>
              <div class="form-grid">
                <div class="f-label">Your Information</div>
                <div class="fg"><label for="firstName">First Name *</label><input type="text" id="firstName" placeholder="Your first name" required /></div>
                <div class="fg"><label for="lastName">Last Name *</label><input type="text" id="lastName" placeholder="Your last name" required /></div>
                <div class="fg full"><label for="email">Email Address *</label><input type="email" id="email" placeholder="your@email.com" required /></div>
                <div class="fg"><label for="phone">Phone Number</label><input type="tel" id="phone" placeholder="(555) 000-0000" /></div>
                <div class="fg"><label for="city">City / State</label><input type="text" id="city" placeholder="Moreno Valley, CA" /></div>
                <div class="f-divider"></div>
                <div class="f-label">Ministry Background</div>
                <div class="fg full">
                  <label for="role">Your Current Role</label>
                  <select id="role">
                    <option value="">— Select your role —</option>
                    <option>Pastor / Senior Pastor</option><option>Associate Pastor</option>
                    <option>Ministry Leader</option><option>Licensed Counselor</option>
                    <option>Lay Counselor / Lay Minister</option><option>Student / Seminary Student</option>
                    <option>Church Member / Believer</option><option>Other</option>
                  </select>
                </div>
                <div class="fg full"><label for="background">What brings you to this program?</label><textarea id="background" placeholder="Tell us a little about yourself and what you hope to gain..."></textarea></div>
                <div class="f-divider"></div>
                <div id="enroll-error" style="grid-column:1/-1;display:none;background:#fff0f0;border:1px solid #f5c6c6;color:#b00020;padding:12px 16px;border-radius:8px;font-size:14px"></div>
                <div class="terms-row">
                  <input type="checkbox" id="terms" required />
                  <label for="terms">I agree to participate in the Reflections of Grace Master Training Portal and understand that all six phases are free. I may voluntarily support the ministry through a donation at any time.</label>
                </div>
                <button type="submit" class="btn btn-navy btn-full" id="enrollBtn" style="font-size:17px;padding:18px">✝ Enroll Free — No Payment Required</button>
                <div style="grid-column:1/-1;background:var(--gold-pale);border:1px solid rgba(184,134,11,.3);border-radius:10px;padding:16px 20px;text-align:center">
                  <p style="font-size:14px;color:var(--text);margin-bottom:10px">Enrollment is free. If you'd like to bless the ministry, a voluntary gift of <strong>$10 or $50</strong> goes a long way.</p>
                  <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
                    <a href="#/donate" class="btn btn-primary" style="padding:10px 22px;font-size:14px">❤ Give $10</a>
                    <a href="#/donate" class="btn btn-green" style="padding:10px 22px;font-size:14px">❤ Give $50</a>
                  </div>
                </div>
              </div>
            </form>
          </div>`}
        <div class="trust-row">
          <div class="trust-item"><span class="trust-icon">✅</span> 100% Free Enrollment</div>
          <div class="trust-item"><span class="trust-icon">✝</span> Faith-Based Ministry</div>
          <div class="trust-item"><span class="trust-icon">📧</span> Confirmation Email Sent</div>
          <div class="trust-item"><span class="trust-icon">🎓</span> Certificate Upon Completion</div>
          <div class="trust-item"><span class="trust-icon">❤</span> Donations Voluntary</div>
        </div>
      </div>
    </div>`;
  if (!enrolled) document.getElementById('enrollForm').addEventListener('submit', handleFreeEnroll);
}

function handleFreeEnroll(e) {
  e.preventDefault();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const terms     = document.getElementById('terms').checked;
  const errBox    = document.getElementById('enroll-error');
  const btn       = document.getElementById('enrollBtn');
  errBox.style.display = 'none';
  if (!firstName||!lastName) { errBox.textContent='⚠️ Please enter your first and last name.'; errBox.style.display='block'; return; }
  if (!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errBox.textContent='⚠️ Please enter a valid email address.'; errBox.style.display='block'; return; }
  if (!terms) { errBox.textContent='⚠️ Please check the agreement box to proceed.'; errBox.style.display='block'; return; }
  btn.textContent='✝ Enrolling you…'; btn.classList.add('btn-loading');
  setTimeout(() => { setEnrolled(); window.location.hash='#/enrolled'; }, 700);
}

// ── ENROLLED CONFIRMATION ──────────────────────────────────────────────────
function renderEnrolled() {
  const count = getEnrollmentCount();
  view.innerHTML = `
    <div class="success-page">
      <div class="success-inner">
        <div class="success-icon">✝</div>
        <h1>Welcome! You're Enrolled.</h1>
        <p>Praise God — you are now enrolled in the Reflections of Grace Master Training Portal. All six phases are free and open to you. A confirmation email is on its way.</p>
        <div style="background:var(--navy);border-radius:14px;padding:24px;margin-bottom:28px;text-align:center">
          <p style="color:rgba(255,255,255,.6);font-size:13px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">You are enrolled student #</p>
          <div style="font-family:var(--ff-display);font-size:52px;color:var(--gold-lt);font-weight:700;line-height:1">${count}</div>
          <p style="color:rgba(255,255,255,.55);font-size:13px;margin-top:6px">Welcome to the family ✝</p>
        </div>
        <div class="success-steps">
          <h3>What Happens Next</h3>
          <div class="s-step"><div class="s-num">1</div><span>Check your inbox for your confirmation and welcome letter from Reflections of Grace Outreach Ministries.</span></div>
          <div class="s-step"><div class="s-num">2</div><span>All six phases are immediately available — start with Phase 01: Biblical Foundations.</span></div>
          <div class="s-step"><div class="s-num">3</div><span>If this ministry has blessed you, consider supporting it with a voluntary gift of $10 or $50.</span></div>
        </div>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:16px">
          <a href="#/courses" class="btn btn-navy">✝ Start Learning — View All Phases</a>
        </div>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
          <a href="#/donate" class="btn btn-primary" style="padding:12px 28px;font-size:15px">❤ Give $10</a>
          <a href="#/donate" class="btn btn-green" style="padding:12px 28px;font-size:15px">❤ Give $50</a>
        </div>
        <p style="margin-top:20px;font-size:13px;color:var(--gray3);font-style:italic">"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7</p>
      </div>
    </div>`;
}

// ── THANK YOU (post-donation) ──────────────────────────────────────────────
function renderThankYou() {
  view.innerHTML = `
    <div class="success-page">
      <div class="success-inner">
        <div class="success-icon">❤</div>
        <h1>God Bless You!</h1>
        <p>Thank you for your generous gift to Reflections of Grace Outreach Ministries. Your donation helps keep this training free for believers everywhere. Heaven is taking note of your generosity.</p>
        <div style="background:var(--gold-pale);border:1px solid rgba(184,134,11,.3);border-radius:14px;padding:28px;margin-bottom:28px">
          <p style="font-family:var(--ff-display);font-size:18px;color:var(--navy);font-style:italic;line-height:1.75">"Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap."</p>
          <p style="color:var(--gold);font-weight:700;margin-top:10px">Luke 6:38 NIV</p>
        </div>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
          <a href="#/" class="btn btn-navy">Return to Home</a>
          <a href="#/courses" class="btn btn-primary">✝ View All Phases</a>
        </div>
      </div>
    </div>`;
}

// ── 404 ────────────────────────────────────────────────────────────────────
function render404() {
  view.innerHTML = `<div class="notfound"><div><h1>404</h1><h2>Page Not Found</h2><p>The page you're looking for doesn't exist.</p><a href="#/" class="btn btn-primary">Go Home</a></div></div>`;
}

// ── INIT ───────────────────────────────────────────────────────────────────
window.addEventListener('hashchange', render);
window.addEventListener('load', render);
