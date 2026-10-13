// Landing page (#/). Marketing front door that leads into the app.
// Uses helpers from app.js (esc, ICON, eventById), which are defined by the time this renders.

const HOME = {
  hero: "assets/hero.jpg",
  features: [
    { n: "01", title: "Welcome to Clyx", photo: img("1529333166437-7750a6dd5a70", 1800),
      text: "Clyx connects people to the friends, communities, and experiences around them, turning discovery into real world connection." },
    { n: "02", title: "See who’s going", photo: img("1540039155733-5bb30b53aa14", 1800),
      text: "Every event shows which friends are already in. Plans stop being a group-chat negotiation and start being a tap." },
    { n: "03", title: "Find your people", photo: img("1528605248644-14dd04022da1", 1800),
      text: "Curated communities, led by people who actually show up. Run clubs, supper clubs, dance floors, studios." },
  ],
  hosts: [
    ["kayla", ["runs Coffee & Chill", "coffeechill"]],
    ["zoe",   ["hosts Pasta Night", "supperclub"]],
    ["leo",   ["leads Long Table", "supperclub"]],
    ["ryan",  ["captains Boat Day", "saltwater"]],
    ["sofia", ["founded Saltwater Club", "saltwater"]],
    ["dev",   ["throws Backyard Disco", "lowend"]],
    ["maya",  ["teaches Figure Drawing", "openstudio"]],
    ["iris",  ["leads Sunrise Yoga", "coffeechill"]],
  ],
  numbers: [
    { value: 2400, suffix: "+", label: "communities hosting on Clyx" },
    { value: 38, suffix: "k", label: "events this year in LA alone" },
    { value: 91, suffix: "%", label: "of first-timers come back" },
    { value: 6, suffix: "", label: "new people met, on average, per event" },
  ],
  hostPhoto: img("1534528741775-53994a69daeb", 1400),
  explorePhoto: img("1470229722913-7c0e2dbbafd3", 1400),
  footer: [
    ["About", [["About", "scroll:about"], ["How It Works", "Coming soon"], ["Communities", "#/community/coffeechill"], ["Reviews", "scroll:reviews"]]],
    ["Hosts", [["Hosts", "Coming soon"], ["Create an Event", "Event creation is coming soon"], ["Leader Program", "Applications open soon"], ["Host Handbook", "Coming soon"]]],
    ["App", [["App", "#/explore"], ["Explore", "#/explore"], ["Friends", "#/friends"], ["My Events", "#/my-events"]]],
    ["Company", [["Company", "Coming soon"], ["Careers", "We’re hiring soon"], ["Press", "press@clyx.app"], ["Contact", "hello@clyx.app"]]],
  ],
  quote2: "I moved to LA knowing nobody. Three run clubs later, I have a group chat I actually like.",
  quote: "Literally anytime I want to find something to do, I just open the app, find something interesting and send it to some friends.",
};

// Each poster is pure CSS: a layout variant plus the event it opens.
const POSTERS = [
  { v: "blur",   event: "rooftop-sessions",  kicker: "Low End Social presents", big: "Rooftop\nSessions", foot: "Fri 16 Oct · The Victorian · Santa Monica" },
  { v: "pixel",  event: "venice-run-club",   kicker: "Coffee & Chill",          big: "Run the\nBoardwalk", foot: "Sat 17 Oct · 9AM" },
  { v: "photo",  event: "boat-day",          kicker: "Saltwater Club",          big: "Boat\nDay", foot: "Marina del Rey · Sun 18 Oct" },
  { v: "red",    event: "pasta-night",       kicker: "Long Table · Supper No. 26", big: "PASTA\nNIGHT\n26", foot: "Nudo · Silver Lake · 16.10" },
  { v: "yellow", event: "backyard-disco",    kicker: "All night long",          big: "Back\nyard\nDisco", foot: "Echo Park · Address on the day" },
  { v: "paper",  event: "figure-drawing",    kicker: "Open Studio",             big: "Figure\nDrawing\n& Wine", foot: "Wed 14 Oct · Hauser Annex" },
  { v: "olive",  event: "sunrise-yoga",      kicker: "Coffee & Chill",          big: "Sunrise\nYoga", foot: "Palisades Park · 7AM" },
];

// Community "partner" wordmarks for the logo strip, each set in its own style.
const PARTNERS = [
  ["Coffee & Chill", "serif"], ["LOW END SOCIAL", "wide"], ["long table", "mono"],
  ["Saltwater Club", "script"], ["OPEN/STUDIO", "slash"], ["Frogtown Run Co.", "stack"],
  ["NIGHT SHIFT", "tight"], ["Thank You Dancing", "serif"],
];

function poster(p) {
  const e = eventById(p.event);
  const big = esc(p.big).replace(/\n/g, "<br>");
  const media = {
    pixel: `<img class="poster__pixel" src="${e.photo.replace(/w=\d+/, "w=28")}" alt="">`,
    photo: `<img class="poster__photo" src="${e.photo}" alt="">`,
    paper: `<img class="poster__cut" src="${e.photo}" alt="">`,
    blur: `<span class="poster__blob b1"></span><span class="poster__blob b2"></span><span class="poster__blob b3"></span>`,
    yellow: `<span class="poster__disc"></span>`,
    olive: `<span class="poster__sun"></span>`,
    red: "",
  }[p.v];
  return `
  <a class="poster poster--${p.v}" href="#/event/${e.id}" aria-label="${esc(e.title)}">
    ${media}
    <span class="poster__kicker">${esc(p.kicker)}</span>
    <span class="poster__big">${big}</span>
    <span class="poster__foot">${esc(p.foot)}</span>
  </a>`;
}

const STORE_BADGES = `
  <div class="stores">
    <button class="store" data-toast="Coming soon to the App Store"><svg viewBox="0 0 24 24"><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.8-.8-3-.8C7 7.2 5.5 8.1 4.7 9.6c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.1.8c1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7 0 0-2.9-1.1-2.9-3.9ZM14.1 5.5c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4Z"/></svg><span><small>Download on the</small>App Store</span></button>
    <button class="store" data-toast="Coming soon to Google Play"><svg viewBox="0 0 24 24"><path d="M4 2.8v18.4c0 .3.3.5.6.3l10.3-9.2L4.6 2.5c-.3-.2-.6 0-.6.3Zm12.1 8.4 3.3-1.9c.8-.5.8-1.6 0-2.1L6.6 0l9.5 11.2Zm0 1.6L6.6 24l12.8-7.2c.8-.5.8-1.6 0-2.1l-3.3-1.9Z"/></svg><span><small>Get it on</small>Google Play</span></button>
  </div>`;

function viewHome() {
  const posters = POSTERS.map(poster).join("");
  const hostCircles = HOME.hosts.map(([pid, role]) => {
    const p = PEOPLE[pid];
    return `<a class="host" href="#/community/${role[1]}">
      <img src="${p.photo.replace(/w=\d+/, "w=520")}" alt="${esc(p.name)}" loading="lazy">
      <span class="host__tag"><b>${esc(p.name.split(" ")[0])}</b>${esc(role[0])}</span>
    </a>`;
  }).join("");
  const partners = PARTNERS.map(([n, s]) => `<span class="partner partner--${s}">${esc(n)}</span>`).join("");

  return `
  <div class="home">
    <section class="hero2">
      <img src="${HOME.hero}" alt="Three friends laughing together on a night out">
      <div class="hero2__text">
        <h1>Click with your friends</h1>
        <p>Clyx connects people to the friends, communities, and experiences around them, turning discovery into real world connection.</p>
        <div class="hero2__ctas">
          <button class="pillbtn pillbtn--white" data-toast="Event creation is coming soon">Create an Event</button>
          <a class="pillbtn pillbtn--glass" href="#/explore">Explore events →</a>
        </div>
      </div>
    </section>

    <div class="partners" aria-label="Communities on Clyx">${partners}</div>

    <section class="statement" id="about">
      <p>Clyx is a way for people to connect with real other people. <span class="hand">👋</span> Find events that you like and meet other people, other friends. <span class="hand">🤙</span></p>
    </section>

    <section class="events-rail">
      <div class="events-rail__head"><h2 class="h2">Events</h2><a class="see-all" href="#/explore">See all in the app ›</a></div>
      <div class="marquee"><div class="marquee__track">${posters}${posters.replace(/<a /g, '<a tabindex="-1" aria-hidden="true" ')}</div></div>
    </section>

    <section class="review" id="reviews">
      <blockquote>“${esc(HOME.quote)}”</blockquote>
      <div class="rating"><span class="mono">4.9</span> <span class="stars" aria-label="4.9 out of 5 stars">★★★★★</span></div>
      ${STORE_BADGES}
    </section>

    <section class="features">
      ${HOME.features.map((f, i) => `
      <article class="feature" style="--i:${i}">
        <img src="${f.photo}" alt="" loading="lazy">
        <span class="feature__n">${f.n}</span>
        <div class="feature__text"><h2>${esc(f.title)}</h2><p>${esc(f.text)}</p></div>
      </article>`).join("")}
    </section>

    <section class="phone-row">
      <div class="phone" aria-hidden="false">
        <div class="phone__screen">
          <span class="phone__island"></span>
          <img class="phone__logo" src="assets/logo.svg" alt="clyx">
          <div class="phone__btns">
            <a href="#/explore">Log In</a>
            <a href="#/explore">Create Account</a>
          </div>
        </div>
      </div>
      <div class="phone-row__copy">
        <blockquote>“${esc(HOME.quote2)}”</blockquote>
        <p>Clyx connects people to the friends, communities, and experiences around them, turning discovery into real world connection.</p>
        <button class="pillbtn pillbtn--soft" data-toast="Event creation is coming soon">Create an Event</button>
      </div>
    </section>

    <section class="hosts">
      <blockquote>“It’s never been easier to make an event and get people to attend on Clyx.”</blockquote>
      <div class="hosts__rail"><div class="hosts__track">${hostCircles}${hostCircles.replace(/<a /g, '<a tabindex="-1" aria-hidden="true" ')}</div></div>
    </section>

    <section class="numbers">
      ${HOME.numbers.map((n) => `
      <div class="number">
        <b data-count="${n.value}" data-suffix="${n.suffix}">0${n.suffix}</b>
        <span>${esc(n.label)}</span>
      </div>`).join("")}
    </section>

    <section class="paths">
      <button class="path" data-toast="Hosting tools are coming soon">
        <div class="path__media"><img src="${HOME.hostPhoto}" alt="" loading="lazy" style="filter:url(#duo-host)"></div>
        <div class="path__label"><h2>Host an event</h2><span class="path__arrow">→</span></div>
        <p>Pick a date, drop a poster, invite your people. Clyx handles RSVPs, reminders, and the group chat after.</p>
      </button>
      <a class="path" href="#/explore">
        <div class="path__media"><img src="${HOME.explorePhoto}" alt="" loading="lazy" style="filter:url(#duo-red)"></div>
        <div class="path__label"><h2>Explore events</h2><span class="path__arrow">→</span></div>
        <p>Run clubs, supper clubs, rooftops and studios. See what your friends are into this week.</p>
      </a>
    </section>

    <svg class="duotones" width="0" height="0" aria-hidden="true" focusable="false">
      <filter id="duo-host" color-interpolation-filters="sRGB">
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.33 0.40 0.10 0.55 1.00"/>
          <feFuncG type="table" tableValues="0.36 0.45 0.52 0.62 0.66"/>
          <feFuncB type="table" tableValues="0.04 0.08 1.00 0.98 0.98"/>
        </feComponentTransfer>
      </filter>
      <filter id="duo-red" color-interpolation-filters="sRGB">
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.20 0.72 0.93 1.00"/>
          <feFuncG type="table" tableValues="0.06 0.22 0.42 0.80"/>
          <feFuncB type="table" tableValues="0.03 0.12 0.26 0.62"/>
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="1.2"/>
      </filter>
    </svg>

    <footer class="bigfoot">
      <img class="bigfoot__mark" src="assets/logo.svg" alt="" aria-hidden="true">
      <div class="bigfoot__top">
        <nav class="bigfoot__cols" aria-label="Footer">
          ${HOME.footer.map(([head, links]) => `
          <div>${links.map(([label, href], i) => {
            const cls = i === 0 ? ' class="is-head"' : "";
            if (href.startsWith("#")) return `<a href="${href}"${cls}>${esc(label)}</a>`;
            if (href.startsWith("scroll:")) return `<button data-scroll="${href.slice(7)}"${cls}>${esc(label)}</button>`;
            return `<button data-toast="${esc(href)}"${cls}>${esc(label)}</button>`;
          }).join("")}</div>`).join("")}
        </nav>
        <div class="bigfoot__pitch">
          <p>Whether you’re throwing your first dinner party or running a 3,000-person run club, we’re here to help.</p>
          <button class="bigfoot__cta" data-toast="Hosting tools are coming soon">Start Hosting</button>
          <form class="bigfoot__form" data-newsletter>
            <label for="nl-email" class="mono">The weekly drop: the best things to do in LA, every Thursday.</label>
            <div><input id="nl-email" type="email" placeholder="you@email.com" required autocomplete="email"><button type="submit">Join</button></div>
          </form>
        </div>
      </div>
      <div class="bigfoot__bottom">
        <div class="bigfoot__social">
          <button data-toast="@clyx on Instagram" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" class="fill"/></svg></button>
          <button data-toast="@clyx on TikTok" aria-label="TikTok"><svg viewBox="0 0 24 24"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.3 5 4.5"/></svg></button>
          <button data-toast="@clyx on X" aria-label="X"><svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20"/></svg></button>
          <button data-toast="Clyx on LinkedIn" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.2v.1M12 17v-6.5M12 13.2c0-1.6 1-2.7 2.4-2.7S16.5 11.4 16.5 13v4"/></svg></button>
        </div>
        <div class="bigfoot__legal mono">
          <span>©2026 Clyx · Made in Los Angeles</span>
          <button data-toast="Privacy policy coming soon">Privacy</button>
          <button data-toast="Terms coming soon">Terms</button>
          <button data-toast="Only essential cookies here">Cookie Preferences</button>
        </div>
      </div>
    </footer>
  </div>`;
}

// Scroll-triggered bits: number count-up and the footer wordmark coming into focus.
function initHome() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      if (en.target.dataset.count) countUp(en.target);
      else en.target.classList.add("is-in");
    });
  }, { threshold: 0.35 });
  document.querySelectorAll("[data-count], .bigfoot").forEach((el) => io.observe(el));
}

function countUp(el) {
  const target = Number(el.dataset.count), suffix = el.dataset.suffix;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t0 = performance.now(), dur = reduce ? 0 : 1400;
  const tick = (now) => {
    const k = dur ? Math.min(1, (now - t0) / dur) : 1;
    const v = Math.round(target * (1 - Math.pow(1 - k, 3)));
    el.textContent = v.toLocaleString() + suffix;
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
