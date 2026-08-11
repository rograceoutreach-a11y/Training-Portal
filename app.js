/* ═══════════════════════════════════════════════════════════════════════════
   REFLECTIONS OF GRACE — MASTER TRAINING PORTAL
   src/app.js — Router, Views, Stripe Checkout
   ═══════════════════════════════════════════════════════════════════════════

   STRIPE SETUP INSTRUCTIONS:
   ─────────────────────────────────────────────────────────────────────────
   1. Log in to dashboard.stripe.com
   2. Click "Payment Links" → "+ Create payment link"
   3. Create products for each enrollment tier (prices below)
   4. For EACH link, set After-payment URL to:
      https://reflectionsofgracebiblestudies.netlify.app/#/success
   5. Copy each link and paste below replacing the placeholder values
   6. For your PUBLISHABLE KEY: Developers → API Keys → copy "pk_live_..."
   7. Commit this file — Netlify redeploys in ~60 seconds
   ─────────────────────────────────────────────────────────────────────────
*/

// ── STRIPE CONFIGURATION ──────────────────────────────────────────────────
// Replace these with your REAL values from dashboard.stripe.com
const STRIPE_CONFIG = {
  // Your Stripe publishable key (starts with pk_live_ for production)
  publishableKey: "pk_live_YOUR_PUBLISHABLE_KEY_HERE",

  // Payment Links for each program — create these in Stripe Dashboard
  links: {
    full:       "https://buy.stripe.com/YOUR_FULL_PROGRAM_LINK",
    counseling: "https://buy.stripe.com/YOUR_COUNSELING_LINK",
    genx:       "https://buy.stripe.com/YOUR_GENX_LINK",
    donate:     "https://buy.stripe.com/YOUR_DONATION_LINK",
  }
};

// Detect if Stripe is configured
const stripeReady = () =>
  !STRIPE_CONFIG.publishableKey.includes("YOUR_") &&
  !STRIPE_CONFIG.links.full.includes("YOUR_");

// ── MODULE DATA ────────────────────────────────────────────────────────────
const MODULES = [
  {
    num:"01", color:"#1B3A6B",
    title:"Biblical Foundations",
    sub:"The Word, the World, and the Believer",
    desc:"Establish a solid scriptural foundation for Christian life and ministry. Covers biblical authority, hermeneutics, Old and New Testament survey, and the theology of discipleship.",
    weeks:"3 weeks", lessons:"6 lessons", price:"Included in Full Program"
  },
  {
    num:"02", color:"#2E5FA3",
    title:"The Vacuum Effect",
    sub:"What Happens When Spiritual Truth Is Removed",
    desc:"Examines what fills the spiritual vacuum when the Church retreats from culture — principalities, ideologies, and counterfeit spiritualities — and equips believers to stand firm.",
    weeks:"3 weeks", lessons:"6 lessons", price:"Included in Full Program"
  },
  {
    num:"03", color:"#B8860B",
    title:"Integrated Christian Counseling",
    sub:"Theology, Psychology, and the Counseling Call",
    desc:"A professional-grade certificate program uniting evidence-based therapeutic practice with biblical principles, spiritual formation, and whole-person care.",
    weeks:"3 weeks", lessons:"6 lessons", price:"Available Separately"
  },
  {
    num:"04", color:"#1B5E20",
    title:"Now Is the Time to Believe",
    sub:"Faith, Urgency, and the Prophetic Hour",
    desc:"An eschatological and evangelistic training on the urgency of the Gospel in the present cultural moment, with practical tools for personal witness and community engagement.",
    weeks:"3 weeks", lessons:"6 lessons", price:"Included in Full Program"
  },
  {
    num:"05", color:"#7B1A1A",
    title:"It Shouldn't Be in the Church",
    sub:"Confronting What Defiles the Body of Christ",
    desc:"A courageous look at the sins, compromise, and principalities that have infiltrated the modern church — and a call to holiness, accountability, and redemptive community.",
    weeks:"3 weeks", lessons:"6 lessons", price:"Included in Full Program"
  },
  {
    num:"06", color:"#4A148C",
    title:"Generation X Left the Church",
    sub:"Now All Hell Broke Loose: The Last Connection to the Old-Time Way",
    desc:"Based on Thomas E. Walker's manuscript (2025). Examines how Gen X's departure from institutional church life created a cascading spiritual crisis across Millennials, Gen Z, and Alpha.",
    weeks:"3 weeks", lessons:"6 lessons", price:"Available Separately"
  }
];

// ── ROUTER ─────────────────────────────────────────────────────────────────
const view = document.getElementById('view');

function getPath() {
  return window.location.hash.replace('#', '') || '/';
}

function navigate(path) {
  window.location.hash = path;
}

function render() {
  const path = getPath();
  setActiveNav(path);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const routes = {
    '/':        renderHome,
    '/courses': renderCourses,
    '/donate':  renderDonate,
    '/about':   renderAbout,
    '/enroll':  renderEnroll,
    '/success': renderSuccess,
  };

  (routes[path] || render404)();
}

function setActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href').replace('#', '');
    if (href === path || (href === '/' && (path === '/' || path === ''))) {
      a.classList.add('active');
    }
  });
}

// Navbar scroll shadow
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav toggle
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.getElementById('navLinks').addEventListener('click', () => {
  document.getElementById('navLinks').classList.remove('open');
});

// ── STRIPE PAYMENT HANDLER ─────────────────────────────────────────────────
function goToStripe(linkKey, email = '') {
  const link = STRIPE_CONFIG.links[linkKey];

  if (!stripeReady() || link.includes("YOUR_")) {
    showSetupAlert();
    return;
  }

  // Append prefilled email if provided (Stripe Payment Links support this)
  const url = email
    ? `${link}?prefilled_email=${encodeURIComponent(email)}`
    : link;

  window.location.href = url;
}

function showSetupAlert() {
  alert(
    "⚙️ Payment system not yet activated.\n\n" +
    "To activate payments:\n" +
    "1. Go to dashboard.stripe.com\n" +
    "2. Create a Payment Link for each program\n" +
    "3. Open src/app.js in your GitHub repo\n" +
    "4. Replace the placeholder values in STRIPE_CONFIG\n" +
    "5. Commit — Netlify will redeploy automatically\n\n" +
    "Need help? Contact us directly."
  );
}

// ── VIEW: HOME ─────────────────────────────────────────────────────────────
function renderHome() {
  view.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow">✝ Reflections of Grace Outreach Ministries</div>
        <h1>Master <span>Training</span> Portal</h1>
        <p class="hero-author">Thomas E. Walker, MDiv. · Moreno Valley, CA</p>
        <p class="hero-desc">Six phases of ministry training — from biblical foundations to integrated Christian counseling. Scholarly depth. Pastoral heart. Spirit-led formation.</p>
        <div class="stats">
          <div class="stat"><div class="stat-num">6</div><div class="stat-label">Modules</div></div>
          <div class="stat"><div class="stat-num">36</div><div class="stat-label">Lessons</div></div>
          <div class="stat"><div class="stat-num">18</div><div class="stat-label">Weeks</div></div>
          <div class="stat"><div class="stat-num">1</div><div class="stat-label">Certificate</div></div>
        </div>
        <div class="hero-cta">
          <a href="#/enroll" class="btn btn-primary btn-lg">Enroll Today</a>
          <a href="#/courses" class="btn btn-outline btn-lg">View Courses</a>
          <a href="#/donate" class="btn btn-green btn-lg">Give / Donate</a>
        </div>
      </div>
    </section>

    <section class="bg-white">
      <div class="sec-inner">
        <div class="sec-eyebrow">Certificate Program</div>
        <h2 class="sec-title">Six Phases of Training</h2>
        <p class="sec-desc">Each module builds on the last — from foundational Scripture to advanced counseling practice and cultural engagement.</p>
        <div class="modules-grid">
          ${MODULES.map(m => `
            <div class="mod-card">
              <div class="mod-num" style="background:${m.color}">${m.num}</div>
              <h3 class="mod-title">${m.title}</h3>
              <p class="mod-sub">${m.sub}</p>
              <p class="mod-desc">${m.desc}</p>
              <div class="mod-meta">
                <span class="badge">📅 ${m.weeks}</span>
                <span class="badge">📖 ${m.lessons}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="bg-gray">
      <div class="sec-inner">
        <div class="about-grid">
          <div class="about-quote">
            <p>"Train up a child in the way he should go, and when he is old he will not depart from it."</p>
            <cite>Proverbs 22:6 NKJV</cite>
          </div>
          <div class="about-content">
            <h3>Whole-Person Ministry Training</h3>
            <p>This program equips believers, ministry leaders, and counselors with both the theological depth and clinical knowledge needed for effective, Spirit-led service.</p>
            <p>From biblical hermeneutics to trauma-informed care — every module is designed to integrate faith and practice at the highest level.</p>
            <div class="creds">
              <div class="cred"><span class="cred-icon">✝</span><span>Grounded in Scripture and orthodox Christian theology</span></div>
              <div class="cred"><span class="cred-icon">🎓</span><span>Developed by Thomas E. Walker, MDiv., pastoral counselor and educator</span></div>
              <div class="cred"><span class="cred-icon">📚</span><span>Includes research libraries, peer-reviewed references, and scholarly resources</span></div>
            </div>
            <div style="margin-top:28px;display:flex;gap:14px;flex-wrap:wrap">
              <a href="#/enroll" class="btn btn-primary">Enroll Now</a>
              <a href="#/donate" class="btn btn-green">Support the Ministry</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ── VIEW: COURSES ──────────────────────────────────────────────────────────
function renderCourses() {
  view.innerHTML = `
    <div class="donate-page">
      <div class="donate-header sec-inner" style="max-width:680px">
        <div class="sec-eyebrow">All Modules</div>
        <h1 style="font-family:var(--ff-display);font-size:clamp(26px,4vw,42px);color:var(--navy);font-weight:700;margin:10px 0 14px;line-height:1.2">Complete Course Catalog</h1>
        <p style="font-size:17px;color:var(--gray3);line-height:1.75">Six modules. Eighteen weeks. One certificate. All content developed by Thomas E. Walker, MDiv.</p>
      </div>
      <div class="sec-inner">
        <div class="modules-grid">
          ${MODULES.map(m => `
            <div class="mod-card">
              <div class="mod-num" style="background:${m.color}">${m.num}</div>
              <h3 class="mod-title">${m.title}</h3>
              <p class="mod-sub">${m.sub}</p>
              <p class="mod-desc">${m.desc}</p>
              <div class="mod-meta">
                <span class="badge">📅 ${m.weeks}</span>
                <span class="badge">📖 ${m.lessons}</span>
                <span class="badge">💰 ${m.price}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="text-align:center;margin-top:52px">
          <a href="#/enroll" class="btn btn-primary btn-lg">Enroll in the Full Program</a>
        </div>
      </div>
    </div>
  `;
}

// ── VIEW: DONATE ───────────────────────────────────────────────────────────
function renderDonate() {
  view.innerHTML = `
    <div class="donate-page">
      <div class="donate-header">
        <div class="sec-eyebrow">Support the Ministry</div>
        <h1>Give to Reflections of Grace</h1>
        <p>Your generous gift supports the development of ministry training resources, scholarship assistance for students, and the ongoing work of Reflections of Grace Outreach Ministries, Inc.</p>
      </div>

      <div class="donate-grid">
        <!-- One-Time Donation -->
        <div class="donate-card">
          <div class="donate-card-hdr" style="border-top:4px solid var(--gold)">
            <h2>One-Time Donation</h2>
            <p>Give a gift of any amount to support the ministry</p>
          </div>
          <div class="donate-card-body">
            <div class="amount-grid" id="oneTimeAmounts">
              <button class="amount-btn" data-amount="10">$10</button>
              <button class="amount-btn" data-amount="25">$25</button>
              <button class="amount-btn selected" data-amount="50">$50</button>
              <button class="amount-btn" data-amount="100">$100</button>
              <button class="amount-btn" data-amount="250">$250</button>
              <button class="amount-btn" data-amount="500">$500</button>
            </div>
            <input type="number" class="custom-amount" id="oneTimeCustom" placeholder="Or enter custom amount ($)" min="1" />
            <p class="donate-note">✝ Your donation directly supports biblical education, counseling training resources, and ministry outreach.</p>
            <button class="btn btn-primary btn-full" onclick="handleDonate('one-time')">
              Give Now — Secure Payment
            </button>
            <div class="stripe-badge">🔒 Secured by Stripe · SSL Encrypted</div>
          </div>
        </div>

        <!-- Monthly Giving -->
        <div class="donate-card">
          <div class="donate-card-hdr" style="border-top:4px solid var(--green)">
            <h2>Monthly Partner</h2>
            <p>Become a recurring ministry partner</p>
          </div>
          <div class="donate-card-body">
            <div class="amount-grid" id="monthlyAmounts">
              <button class="amount-btn" data-amount="10">$10/mo</button>
              <button class="amount-btn" data-amount="25">$25/mo</button>
              <button class="amount-btn selected" data-amount="50">$50/mo</button>
              <button class="amount-btn" data-amount="100">$100/mo</button>
              <button class="amount-btn" data-amount="200">$200/mo</button>
              <button class="amount-btn" data-amount="500">$500/mo</button>
            </div>
            <input type="number" class="custom-amount" id="monthlyCustom" placeholder="Or enter custom amount ($)" min="1" />
            <p class="donate-note">✝ Monthly partners make it possible to sustain long-term ministry development, scholarship funds, and new course creation.</p>
            <button class="btn btn-green btn-full" onclick="handleDonate('monthly')">
              Become a Monthly Partner
            </button>
            <div class="stripe-badge">🔒 Secured by Stripe · Cancel Anytime</div>
          </div>
        </div>
      </div>

      <!-- Scripture -->
      <div style="text-align:center;max-width:560px;margin:52px auto 0;padding:0 24px">
        <p style="font-family:var(--ff-display);font-size:18px;color:var(--navy);font-style:italic;line-height:1.75">"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."</p>
        <p style="color:var(--gold);font-size:14px;font-weight:700;margin-top:10px">2 Corinthians 9:7 NIV</p>
      </div>
    </div>
  `;

  // Amount button selection
  ['oneTimeAmounts', 'monthlyAmounts'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => {
      if (e.target.classList.contains('amount-btn')) {
        document.querySelectorAll(`#${id} .amount-btn`).forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
      }
    });
  });
}

function handleDonate(type) {
  const amountsId  = type === 'one-time' ? 'oneTimeAmounts'  : 'monthlyAmounts';
  const customId   = type === 'one-time' ? 'oneTimeCustom'   : 'monthlyCustom';
  const selected   = document.querySelector(`#${amountsId} .amount-btn.selected`);
  const customVal  = document.getElementById(customId).value;
  const amount     = customVal || (selected ? selected.dataset.amount : '50');

  if (!stripeReady()) {
    showSetupAlert();
    return;
  }

  // Append amount as a query param (Stripe Payment Links support ?amount= for dynamic amounts
  // if you create the link as a "customer chooses price" type in Stripe Dashboard)
  const baseLink = STRIPE_CONFIG.links.donate;
  window.location.href = `${baseLink}`;
}

// ── VIEW: ABOUT ────────────────────────────────────────────────────────────
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
            <p>He is the author of <em>Generation X Left the Church, Now All Hell Broke Loose: The Last Connection to the Old-Time Way</em> (2025, ISBN: 978-0-9830162-8-1) and the developer of this six-module integrated training program.</p>
            <p>Pastor Walker brings over three decades of pastoral experience, community ministry, and academic formation to this curriculum — uniting the old-time Gospel with contemporary counseling science.</p>
            <div class="creds">
              <div class="cred"><span class="cred-icon">🎓</span><span>Master of Divinity in Pastoral Counseling</span></div>
              <div class="cred"><span class="cred-icon">✝</span><span>Founder, Reflections of Grace Outreach Ministries, Inc.</span></div>
              <div class="cred"><span class="cred-icon">📖</span><span>Author, <em>Generation X Left the Church</em> (2025)</span></div>
              <div class="cred"><span class="cred-icon">📍</span><span>Moreno Valley, California</span></div>
            </div>
            <div style="margin-top:28px;display:flex;gap:14px;flex-wrap:wrap">
              <a href="#/enroll" class="btn btn-primary">Enroll in the Program</a>
              <a href="#/donate" class="btn btn-green">Support the Ministry</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ── VIEW: ENROLL ───────────────────────────────────────────────────────────
function renderEnroll() {
  view.innerHTML = `
    <div class="enroll-page">
      <div class="enroll-inner">
        <div class="enroll-hdr">
          <span class="sec-eyebrow">✝ Begin Your Journey</span>
          <h1>Enroll in the Master Training Portal</h1>
          <p>Six modules. Eighteen weeks. One transformative certificate in ministry and integrated Christian counseling — developed by Thomas E. Walker, MDiv.</p>
        </div>

        <div class="enroll-card">
          <div class="enroll-card-hdr">
            <h2>Program Enrollment</h2>
            <p>Complete the form below. You will be directed to our secure Stripe payment page to confirm enrollment.</p>
          </div>

          <form class="enroll-form" id="enrollForm" novalidate>
            <div class="form-grid">

              <div class="f-label">Personal Information</div>

              <div class="fg">
                <label for="firstName">First Name *</label>
                <input type="text" id="firstName" placeholder="Your first name" required />
              </div>
              <div class="fg">
                <label for="lastName">Last Name *</label>
                <input type="text" id="lastName" placeholder="Your last name" required />
              </div>
              <div class="fg full">
                <label for="email">Email Address *</label>
                <input type="email" id="email" placeholder="your@email.com" required />
              </div>
              <div class="fg">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" placeholder="(555) 000-0000" />
              </div>
              <div class="fg">
                <label for="city">City / State</label>
                <input type="text" id="city" placeholder="Moreno Valley, CA" />
              </div>

              <div class="f-divider"></div>
              <div class="f-label">Ministry Background</div>

              <div class="fg full">
                <label for="role">Your Current Role</label>
                <select id="role">
                  <option value="">— Select your role —</option>
                  <option>Pastor / Senior Pastor</option>
                  <option>Associate Pastor</option>
                  <option>Ministry Leader</option>
                  <option>Licensed Counselor</option>
                  <option>Lay Counselor / Lay Minister</option>
                  <option>Student / Seminary Student</option>
                  <option>Church Member / Believer</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="fg full">
                <label for="background">What brings you to this program?</label>
                <textarea id="background" placeholder="Tell us a little about yourself and what you hope to gain..."></textarea>
              </div>

              <div class="f-divider"></div>
              <div class="f-label">Select Your Program</div>

              <div class="prog-options" id="progOptions">
                <label class="prog-opt active">
                  <input type="radio" name="program" value="full" checked />
                  <div class="prog-opt-text">
                    <div class="prog-opt-name">Complete Certificate Program</div>
                    <div class="prog-opt-desc">All 6 modules · 36 lessons · 18 weeks · Certificate of completion</div>
                  </div>
                  <div class="prog-opt-price">Full Program</div>
                </label>
                <label class="prog-opt">
                  <input type="radio" name="program" value="counseling" />
                  <div class="prog-opt-text">
                    <div class="prog-opt-name">Integrated Christian Counseling Only (Module 3)</div>
                    <div class="prog-opt-desc">6 lessons · 3 weeks · Counseling certificate</div>
                  </div>
                  <div class="prog-opt-price">Module 3</div>
                </label>
                <label class="prog-opt">
                  <input type="radio" name="program" value="genx" />
                  <div class="prog-opt-text">
                    <div class="prog-opt-name">Generation X Left the Church (Module 6)</div>
                    <div class="prog-opt-desc">6 lessons · 3 weeks · Based on Walker (2025)</div>
                  </div>
                  <div class="prog-opt-price">Module 6</div>
                </label>
              </div>

              <div class="f-divider"></div>

              <div id="stripe-error">
                ⚠️ There was an issue connecting to the payment processor. Please try again or contact us directly.
              </div>

              <div class="terms-row">
                <input type="checkbox" id="terms" required />
                <label for="terms">I agree to the Terms &amp; Conditions and Privacy Policy of Reflections of Grace Outreach Ministries, Inc. I understand that clicking "Submit Enrollment" will direct me to a secure Stripe payment page to complete my registration.</label>
              </div>

              <button type="submit" class="btn btn-navy btn-full" id="submitBtn">
                ✝ Submit Enrollment — Proceed to Secure Payment
              </button>

            </div>
          </form>
        </div>

        <div class="trust-row">
          <div class="trust-item"><span class="trust-icon">🔒</span> Secured by Stripe</div>
          <div class="trust-item"><span class="trust-icon">🛡️</span> SSL Encrypted</div>
          <div class="trust-item"><span class="trust-icon">✝</span> Faith-Based Institution</div>
          <div class="trust-item"><span class="trust-icon">📧</span> Confirmation Email Sent</div>
          <div class="trust-item"><span class="trust-icon">🎓</span> Certificate Upon Completion</div>
        </div>
      </div>
    </div>
  `;

  // Highlight selected program option
  document.getElementById('progOptions').addEventListener('change', e => {
    document.querySelectorAll('.prog-opt').forEach(o => o.classList.remove('active'));
    if (e.target.type === 'radio') e.target.closest('.prog-opt').classList.add('active');
  });

  // Form submit
  document.getElementById('enrollForm').addEventListener('submit', handleEnrollSubmit);
}

function handleEnrollSubmit(e) {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const terms     = document.getElementById('terms').checked;
  const program   = document.querySelector('input[name="program"]:checked')?.value || 'full';
  const errBox    = document.getElementById('stripe-error');
  const btn       = document.getElementById('submitBtn');

  errBox.style.display = 'none';

  if (!firstName || !lastName) {
    errBox.textContent = '⚠️ Please enter your first and last name.';
    errBox.style.display = 'block';
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errBox.textContent = '⚠️ Please enter a valid email address.';
    errBox.style.display = 'block';
    return;
  }
  if (!terms) {
    errBox.textContent = '⚠️ Please agree to the Terms & Conditions to proceed.';
    errBox.style.display = 'block';
    return;
  }

  if (!stripeReady()) {
    showSetupAlert();
    return;
  }

  // Show loading
  btn.textContent = '🔒 Redirecting to secure payment…';
  btn.classList.add('btn-loading');

  const linkKey = program; // 'full' | 'counseling' | 'genx'
  const stripeLink = STRIPE_CONFIG.links[linkKey];

  setTimeout(() => {
    window.location.href = `${stripeLink}?prefilled_email=${encodeURIComponent(email)}`;
  }, 600);
}

// ── VIEW: SUCCESS ──────────────────────────────────────────────────────────
function renderSuccess() {
  view.innerHTML = `
    <div class="success-page">
      <div class="success-inner">
        <div class="success-icon">✝</div>
        <h1>Enrollment Confirmed!</h1>
        <p>Welcome to Reflections of Grace Master Training Portal. Your payment was received and your enrollment is confirmed. A confirmation email is on its way.</p>
        <div class="success-steps">
          <h3>What Happens Next</h3>
          <div class="s-step"><div class="s-num">1</div><span>Check your inbox for your confirmation and welcome letter from Reflections of Grace Outreach Ministries.</span></div>
          <div class="s-step"><div class="s-num">2</div><span>You will receive your course access credentials within 24 hours.</span></div>
          <div class="s-step"><div class="s-num">3</div><span>Your first module begins at the scheduled start date — prepare your heart and your notebook!</span></div>
        </div>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
          <a href="#/" class="btn btn-primary">Return to Home</a>
          <a href="#/donate" class="btn btn-green">Support the Ministry</a>
        </div>
      </div>
    </div>
  `;
}

// ── VIEW: 404 ──────────────────────────────────────────────────────────────
function render404() {
  view.innerHTML = `
    <div class="notfound">
      <div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <a href="#/" class="btn btn-primary">Go Home</a>
      </div>
    </div>
  `;
}

// ── INIT ───────────────────────────────────────────────────────────────────
window.addEventListener('hashchange', render);
window.addEventListener('load', render);
