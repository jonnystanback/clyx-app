// Your profile (#/profile): a personal page you can theme and fill in, plus a live editor sheet.
// Loaded before app.js; everything here only touches app.js globals (state, persist, refresh,
// toast, esc, eventCard, ...) at call time.

/* ───────────────────────── Content ───────────────────────── */

const PROFILE_DEFAULTS = {
  name: "Jonny S.",
  handle: "jonny",
  pronouns: "",
  city: "Los Angeles",
  headline: "enjoying summertime",
  bio: "Moved to LA for the weather, stayed for the run clubs. Will always say yes to a dinner party.",
  status: true,
  statusText: "enjoying summertime",
  hereFor: ["New friends", "Things to do"],
  interests: ["run", "dinner", "dance", "vinyl", "coffee"],
  prompts: [
    { q: 0, a: "Griffith at sunrise, tacos by noon, a rooftop by sunset." },
    { q: 1, a: "Wherever the yellow flag is on Saturday morning." },
    { q: 3, a: "Knows a guy who knows the DJ." },
  ],
  song: { title: "Got to Give It Up", artist: "Marvin Gaye" },
  socials: { instagram: "jonny", tiktok: "", spotify: "", website: "" },
  theme: "highlighter",
  photo: null,
  privacy: { plans: "friends", met: true },
};

const PROMPTS = [
  "My ideal Saturday is…",
  "Come find me at…",
  "The way to win me over is…",
  "I’m the friend who…",
  "Next thing I want to try…",
  "Hot take:",
  "Best night out in LA was…",
];

const INTERESTS = {
  run: ["🏃", "Run clubs"], dinner: ["🍝", "Dinner parties"], dance: ["🪩", "Dancing"],
  art: ["🎨", "Making art"], yoga: ["🧘", "Yoga"], water: ["⛵", "On the water"],
  vinyl: ["🎧", "Vinyl"], tacos: ["🌮", "Taco crawls"], books: ["📚", "Book clubs"],
  pickle: ["🎾", "Pickleball"], coffee: ["☕", "Coffee"], karaoke: ["🎤", "Karaoke"],
  film: ["🎬", "Film"], hike: ["🌿", "Hiking"], comedy: ["😂", "Comedy"], wine: ["🍷", "Natural wine"],
};

const HERE_FOR = ["New friends", "My people", "Things to do", "Hosting", "Dates", "Creative collabs"];

// Cover themes. Each sets the cover art plus the accent used for chips and rings.
const THEMES = {
  highlighter: { label: "Highlighter", accent: "#f2f04a", accentInk: "#0b0b0b" },
  bluehour:    { label: "Blue Hour",   accent: "#2f3cff", accentInk: "#ffffff" },
  pinknoise:   { label: "Pink Noise",  accent: "#ff4f6d", accentInk: "#ffffff" },
  olive:       { label: "Olive Grove", accent: "#9b9d55", accentInk: "#ffffff" },
  festival:    { label: "Festival",    accent: "#ec1c24", accentInk: "#ffe62e" },
  afterdark:   { label: "After Dark",  accent: "#0b0b0b", accentInk: "#ffffff" },
};

const VOUCHES = [
  { who: "kayla", text: "Best pace partner in LA. Will make you run the extra mile, then buy you a coffee." },
  { who: "leo",   text: "Brought homemade focaccia to a dinner party. Asked everyone’s name twice so he’d remember. Legend." },
  { who: "maya",  text: "Said yes to figure drawing on two hours’ notice and was weirdly good at it." },
];

/* ───────────────────────── State ───────────────────────── */

const prof = () => (state.profile ||= structuredClone(PROFILE_DEFAULTS));

// Keep PEOPLE.me (used across the app for attendee lists) and the header avatar in sync.
function syncMe() {
  const p = prof();
  PEOPLE.me.defaultPhoto ??= PEOPLE.me.photo; // captured once, before any upload replaces it
  PEOPLE.me.name = p.name || "You";
  PEOPLE.me.handle = p.handle || "you";
  PEOPLE.me.city = p.city;
  PEOPLE.me.photo = p.photo || PEOPLE.me.defaultPhoto;
  const a = document.getElementById("me-avatar");
  if (a) a.src = PEOPLE.me.photo;
}

function getPath(obj, path) { return path.split(".").reduce((o, k) => o?.[k], obj); }
function setPath(obj, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((o, k) => (o[k] ??= {}), obj);
  target[last] = value;
}

let saveTimer;
function profileChanged() {
  syncMe();
  refresh();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persist, 250);
}

/* ───────────────────────── View ───────────────────────── */

const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" class="fill"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.3 5 4.5"/></svg>`,
  spotify: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M7.5 9.5c3-1 6.5-.7 9.2.8M8 12.6c2.5-.8 5.3-.5 7.4.7M8.6 15.5c2-.6 4-.4 5.7.5"/></svg>`,
  website: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 3.8 5.8 3.8 9s-1.2 6.2-3.8 9c-2.6-2.8-3.8-5.8-3.8-9S9.4 5.8 12 3Z"/></svg>`,
};

function socialHref(kind, value) {
  const v = value.trim().replace(/^@/, "");
  if (!v) return null;
  if (kind === "website") return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  const safe = encodeURIComponent(v);
  return { instagram: `https://instagram.com/${safe}`, tiktok: `https://tiktok.com/@${safe}`, spotify: `https://open.spotify.com/user/${safe}` }[kind];
}

function badgesFor(past, metCount) {
  const going = state.going.map(eventById).filter(Boolean);
  return [
    { icon: "✦", label: "First Clyx", got: past.length >= 1, hint: "Go to your first event" },
    { icon: "☀", label: "Early Riser", got: going.some((e) => /AM$/.test(e.start)), hint: "RSVP to a morning event" },
    { icon: "⚡", label: "Connector", got: metCount >= 5, hint: "Meet 5 people at events" },
    { icon: "◎", label: "Regular", got: state.joined.length >= 1, hint: "Join a community" },
    { icon: "♥", label: "Plus One", got: state.following.length >= 5, hint: "Add 5 friends" },
    { icon: "★", label: "Host", got: false, hint: "Host an event to unlock" },
  ];
}

function coverArt(theme) {
  return {
    highlighter: `<span class="pc-blob pc-blob--1"></span><span class="pc-blob pc-blob--2"></span>`,
    bluehour: `<span class="pc-glow pc-glow--1"></span><span class="pc-glow pc-glow--2"></span><span class="pc-glow pc-glow--3"></span>`,
    pinknoise: `<span class="pc-ring"></span>`,
    olive: `<span class="pc-sun"></span>`,
    festival: `<span class="pc-strip"></span>`,
    afterdark: `<img class="pc-photo" src="assets/hero.jpg" alt=""><span class="pc-streaks"></span>`,
  }[theme] || "";
}

const shortDate = (offset) => { const d = dateFor(offset); return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`; };

function viewProfile() {
  const p = prof();
  const t = THEMES[p.theme] || THEMES.highlighter;
  const me = PEOPLE.me;

  const goingEvents = state.going.map(eventById).filter(Boolean);
  const past = goingEvents.filter((e) => e.day < 0).sort((a, b) => b.day - a.day);
  const upcomingPlans = goingEvents.filter((e) => e.day >= 0).sort((a, b) => a.day - b.day);

  // Mutuals: everyone you've shared a past event with, most shared first.
  const mutuals = new Map();
  past.forEach((e) => e.going.forEach((pid) => {
    if (pid === "me") return;
    const m = mutuals.get(pid) || { pid, events: [] };
    m.events.push(e);
    mutuals.set(pid, m);
  }));
  const mutualList = [...mutuals.values()].sort((a, b) => b.events.length - a.events.length || isFriend(b.pid) - isFriend(a.pid));

  // Communities you've joined, then ones you've been to an event with.
  const commIds = [...new Set([...state.joined, ...past.map((e) => e.community)])];
  const badges = badgesFor(past, mutuals.size);
  const sticker = (p.headline || "").trim();

  const socials = Object.entries(p.socials || {})
    .map(([k, v]) => [k, v && socialHref(k, v), v])
    .filter(([, href]) => href)
    .map(([k, href, v]) => `<a class="psocial" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${k}">${SOCIAL_ICONS[k]}<span>${esc(k === "website" ? v.replace(/^https?:\/\//, "") : "@" + v.replace(/^@/, ""))}</span></a>`)
    .join("");

  const prompts = (p.prompts || []).filter((x) => x && x.a && x.a.trim());
  const visibility = { everyone: "Visible to everyone", friends: "Visible to friends", me: "Only you can see this" }[p.privacy?.plans || "friends"];

  return `
  <div class="page profile" style="--accent:${t.accent};--accent-ink:${t.accentInk}">

    <header class="phead">
      <button class="phead__avatar" data-p-edit="photo" aria-label="Change photo">
        <img src="${esc(me.photo)}" alt="">
        ${p.status ? `<span class="phead__dot" title="Open to plans"></span>` : ""}
        ${sticker ? `<span class="phead__sticker">${esc(sticker)} ✦</span>` : ""}
      </button>
      <div class="phead__id">
        <h1 class="phead__name">${esc(p.name || "Your name")}</h1>
        <div class="phead__handle">@${esc(p.handle || "you")}${p.pronouns ? `<span>${esc(p.pronouns)}</span>` : ""}${p.city ? `<span>${esc(p.city)}</span>` : ""}</div>
        ${p.status ? `<div class="pstatus"><span class="pstatus__dot"></span><b>Open to plans</b>${p.statusText ? `<span>${esc(p.statusText)}</span>` : ""}</div>` : ""}
        ${p.bio ? `<p class="phead__bio">${esc(p.bio)}</p>` : `<button class="pempty pempty--inline" data-p-edit="bio">+ Add a bio</button>`}
        ${p.hereFor?.length ? `<div class="pchips"><span class="plabel">Here for</span>${p.hereFor.map((h) => `<span class="pchip pchip--accent">${esc(h)}</span>`).join("")}</div>` : ""}
        ${socials ? `<div class="psocials">${socials}</div>` : ""}
        <div class="phead__actions">
          <button class="btn btn--ink btn--sm" data-p-edit>Edit profile</button>
          <button class="btn btn--ghost btn--sm" data-p-share>${ICON.share} Share</button>
        </div>
      </div>
    </header>

    <div class="pstats">
      <div class="pstat pstat--pink"><b>${past.length}</b><span>Experiences</span></div>
      <div class="pstat pstat--blue"><b>${mutuals.size}</b><span>people met</span></div>
      <div class="pstat"><b>${state.following.length}</b><span>friends</span></div>
    </div>

    <section class="psection">
      <div class="psection__head"><h2 class="h2">In my words</h2><button class="see-all" data-p-edit="prompts">Edit ›</button></div>
      <div class="pprompts">
        ${prompts.map((x, i) => `
          <article class="pprompt pprompt--${i % 3}">
            <span class="pprompt__q mono">${esc(PROMPTS[x.q] || PROMPTS[0])}</span>
            <p>${esc(x.a)}</p>
          </article>`).join("")}
        ${prompts.length < 3 ? `<button class="pprompt pprompt--add" data-p-edit="prompts"><span>+</span>Add a prompt</button>` : ""}
      </div>
    </section>

    <section class="psection">
      <div class="psection__head"><h2 class="h2">Your communities</h2><a class="see-all" href="#/explore">Find more ›</a></div>
      ${commIds.length ? `<div class="pcomms">${commIds.map((id) => {
        const c = COMMUNITIES[id];
        const joined = state.joined.includes(id);
        const been = past.filter((e) => e.community === id).length;
        return `<a class="comm" href="#/community/${id}">
          <div class="comm__media">
            <img src="${c.cover}" alt="" loading="lazy">
            <span class="badge ${joined ? "badge--yellow" : "badge--white"}">${joined ? "Joined" : `Been to ${been}`}</span>
            <div class="comm__name">${esc(c.name)}</div>
          </div>
          <div class="comm__meta">${c.members.toLocaleString()} members · ${c.tags.join(", ")}</div>
        </a>`;
      }).join("")}</div>` : `<div class="empty">Join a community to see it here.<br><a class="btn btn--yellow" href="#/explore">Explore</a></div>`}
    </section>

    ${p.privacy?.met !== false ? `
    <section class="psection">
      <div class="psection__head"><div><h2 class="h2">Mutuals</h2><p class="lede">People you’ve shared a Clyx event with.</p></div><a class="see-all" href="#/friends">See All ›</a></div>
      ${mutualList.length ? `<div class="pmutuals">${mutualList.map((m) => {
        const person = PEOPLE[m.pid];
        const last = m.events[0];
        const n = m.events.length;
        return `<div class="pmutual">
          <img src="${person.photo.replace(/w=\d+/, "w=360")}" alt="" loading="lazy">
          <b>${esc(person.name.replace(/^(\S+)\s+(\S).*$/, "$1 $2."))}</b>
          <span class="mono">${n} Shared Event${n > 1 ? "s" : ""}<br>${esc(last.title)} · ${shortDate(last.day)}</span>
          ${isFriend(m.pid)
            ? `<span class="pmutual__tag">Friends</span>`
            : `<button class="pmutual__tag pmutual__tag--add" data-follow="${m.pid}">+ Add</button>`}
        </div>`;
      }).join("")}</div>` : `<div class="empty">Go to an event to meet people.</div>`}
    </section>` : ""}

    <section class="psection">
      <div class="psection__head"><h2 class="h2">Past Events</h2></div>
      ${past.length ? `<div class="grid-3 rail">${past.map((e) => eventCard(e)).join("")}</div>` : `<div class="empty">Your memories will live here.</div>`}
    </section>

    <section class="psection">
      <div class="psection__head"><h2 class="h2">Into</h2><button class="see-all" data-p-edit="interests">Edit ›</button></div>
      ${p.interests?.length
        ? `<div class="pinterests">${p.interests.filter((k) => INTERESTS[k]).map((k) => `<a class="pinterest" href="#/explore"><span>${INTERESTS[k][0]}</span>${esc(INTERESTS[k][1])}</a>`).join("")}</div>`
        : `<button class="pempty" data-p-edit="interests">+ Pick a few things you’re into</button>`}
    </section>

    <div class="pduo">
      <section class="psong">
        <div class="psong__art"><span></span></div>
        <div class="psong__body">
          <div class="plabel">On repeat</div>
          ${p.song?.title
            ? `<b>${esc(p.song.title)}</b><span class="mono">${esc(p.song.artist || "")}</span>`
            : `<button class="pempty pempty--inline" data-p-edit="song">+ Add a song</button>`}
        </div>
        <div class="psong__eq" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      </section>

      <section class="pplans">
        <div class="plabel">Next up <span class="pplans__vis mono">${esc(visibility)}</span></div>
        ${upcomingPlans.length ? upcomingPlans.slice(0, 3).map((e) => {
          const d = dateFor(e.day);
          return `<a class="pplan" href="#/event/${e.id}">
            <span class="pplan__date"><small>${MONTHS_SHORT[d.getMonth()]}</small>${d.getDate()}</span>
            <span><b>${esc(e.title)}</b><span class="mono">${DAYS_SHORT[d.getDay()]} · ${e.start} · ${esc(e.area)}</span></span>
          </a>`;
        }).join("") : `<a class="pempty pempty--inline" href="#/explore">No plans yet. Find something →</a>`}
      </section>
    </div>

    <section class="psection">
      <div class="psection__head"><div><h2 class="h2">Vouches</h2><p class="lede">What friends say after a night out.</p></div></div>
      <div class="pvouches">${VOUCHES.map((v) => `
        <figure class="pvouch">
          <blockquote>“${esc(v.text)}”</blockquote>
          <figcaption><img src="${PEOPLE[v.who].photo}" alt="" loading="lazy">${esc(PEOPLE[v.who].name)}</figcaption>
        </figure>`).join("")}</div>
    </section>

    <section class="psection">
      <div class="psection__head"><h2 class="h2">Badges</h2></div>
      <div class="pbadges">${badges.map((b) => `
        <span class="pbadge ${b.got ? "is-got" : ""}" title="${esc(b.got ? b.label : b.hint)}">
          <i>${b.icon}</i><span>${esc(b.label)}</span>${b.got ? "" : `<small>${esc(b.hint)}</small>`}
        </span>`).join("")}</div>
    </section>
  </div>`;
}

/* ───────────────────────── Editor sheet ───────────────────────── */

let editorSnapshot = null;

function field(label, path, { type = "text", max, placeholder = "", prefix = "" } = {}) {
  const v = getPath(prof(), path) ?? "";
  const counter = max ? `<span class="pe-count" data-count-for="${path}">${String(v).length}/${max}</span>` : "";
  const input = type === "textarea"
    ? `<textarea data-field="${path}" ${max ? `maxlength="${max}"` : ""} rows="3" placeholder="${esc(placeholder)}">${esc(v)}</textarea>`
    : `<div class="pe-input">${prefix ? `<span>${prefix}</span>` : ""}<input data-field="${path}" type="${type}" ${max ? `maxlength="${max}"` : ""} value="${esc(v)}" placeholder="${esc(placeholder)}" autocomplete="off"></div>`;
  return `<label class="pe-field"><span class="pe-label">${label}${counter}</span>${input}</label>`;
}

function toggle(label, path, sub = "") {
  const on = !!getPath(prof(), path);
  return `<label class="pe-toggle"><span><b>${label}</b>${sub ? `<small>${sub}</small>` : ""}</span>
    <input type="checkbox" data-field="${path}" ${on ? "checked" : ""}><i aria-hidden="true"></i></label>`;
}

function chipSet(path, options, max) {
  const cur = getPath(prof(), path) || [];
  return `<div class="pe-chips" data-max="${max || ""}">${options.map(([v, label]) =>
    `<button type="button" class="pe-chip ${cur.includes(v) ? "is-on" : ""}" data-p-toggle="${path}" data-v="${esc(v)}" aria-pressed="${cur.includes(v)}">${label}</button>`).join("")}</div>`;
}

function editorHTML() {
  const p = prof();
  const promptSlots = [0, 1, 2].map((i) => {
    const x = p.prompts[i] || { q: i, a: "" };
    return `
    <div class="pe-prompt">
      <select data-field="prompts.${i}.q" aria-label="Prompt ${i + 1}">
        ${PROMPTS.map((q, qi) => `<option value="${qi}" ${Number(x.q) === qi ? "selected" : ""}>${esc(q)}</option>`).join("")}
      </select>
      <textarea data-field="prompts.${i}.a" maxlength="120" rows="2" placeholder="Your answer">${esc(x.a || "")}</textarea>
    </div>`;
  }).join("");

  return `
  <div class="pe-scrim" data-p-close></div>
  <aside class="pe" role="dialog" aria-modal="true" aria-labelledby="pe-title">
    <header class="pe__head">
      <button class="pe__cancel" data-p-cancel>Cancel</button>
      <h2 id="pe-title">Edit profile</h2>
      <button class="pe__done" data-p-close>Done</button>
    </header>
    <div class="pe__body">

      <section class="pe-sec" data-sec="photo">
        <div class="pe-photo">
          <img id="pe-photo-img" src="${esc(PEOPLE.me.photo)}" alt="">
          <div>
            <label class="pe-btn">Upload photo<input type="file" accept="image/*" id="pe-photo-input" hidden></label>
            ${p.photo ? `<button type="button" class="pe-link" data-p-photo-reset>Use default</button>` : ""}
          </div>
        </div>
        ${field("Name", "name", { max: 40, placeholder: "What friends call you" })}
        <div class="pe-row">
          ${field("Username", "handle", { max: 24, prefix: "@" })}
          ${field("Pronouns", "pronouns", { max: 20, placeholder: "Optional" })}
        </div>
        ${field("City", "city", { max: 40 })}
      </section>

      <section class="pe-sec" data-sec="status">
        <h3>Status</h3>
        ${toggle("Open to plans", "status", "Friends see a green dot and get nudged when you’re free.")}
        ${field("What are you up for?", "statusText", { max: 60, placeholder: "Free this weekend. Take me somewhere." })}
      </section>

      <section class="pe-sec" data-sec="bio">
        <h3>About</h3>
        ${field("Bio", "bio", { type: "textarea", max: 160, placeholder: "A line or two about you" })}
        <div class="pe-label">Here for</div>
        ${chipSet("hereFor", HERE_FOR.map((h) => [h, esc(h)]))}
      </section>

      <section class="pe-sec" data-sec="theme">
        <h3>Look</h3>
        ${field("Sticker", "headline", { max: 24, placeholder: "always down" })}
        <div class="pe-label">Accent</div>
        <div class="pe-themes">${Object.entries(THEMES).map(([id, th]) => `
          <button type="button" class="pe-theme pcover--${id} ${p.theme === id ? "is-on" : ""}" data-p-theme="${id}" aria-pressed="${p.theme === id}">
            ${coverArt(id)}<span>${esc(th.label)}</span>
          </button>`).join("")}</div>
      </section>

      <section class="pe-sec" data-sec="prompts">
        <h3>Prompts</h3>
        <p class="pe-hint">Leave an answer blank to hide it.</p>
        ${promptSlots}
      </section>

      <section class="pe-sec" data-sec="interests">
        <h3>Into <small class="pe-hint">Pick up to 8</small></h3>
        ${chipSet("interests", Object.entries(INTERESTS).map(([k, [e, l]]) => [k, `${e} ${esc(l)}`]), 8)}
      </section>

      <section class="pe-sec" data-sec="song">
        <h3>On repeat</h3>
        <div class="pe-row">
          ${field("Song", "song.title", { max: 50 })}
          ${field("Artist", "song.artist", { max: 50 })}
        </div>
      </section>

      <section class="pe-sec" data-sec="socials">
        <h3>Socials</h3>
        ${field("Instagram", "socials.instagram", { prefix: "@", max: 30 })}
        ${field("TikTok", "socials.tiktok", { prefix: "@", max: 30 })}
        ${field("Spotify", "socials.spotify", { max: 40, placeholder: "Username" })}
        ${field("Website", "socials.website", { max: 80, placeholder: "yoursite.com" })}
      </section>

      <section class="pe-sec" data-sec="privacy">
        <h3>Privacy</h3>
        <div class="pe-label">Who sees your upcoming plans</div>
        <div class="pe-seg" role="radiogroup">${[["everyone", "Everyone"], ["friends", "Friends"], ["me", "Only me"]].map(([v, l]) =>
          `<button type="button" role="radio" class="${p.privacy.plans === v ? "is-on" : ""}" aria-checked="${p.privacy.plans === v}" data-p-set="privacy.plans" data-v="${v}">${l}</button>`).join("")}</div>
        ${toggle("Show people I’ve met", "privacy.met", "Shows “People I’ve clicked with” on your profile.")}
      </section>

      <section class="pe-sec pe-sec--danger">
        <button type="button" class="pe-link" data-reset>Reset demo data</button>
      </section>
    </div>
  </aside>`;
}

function openEditor(section) {
  closeEditor(true);
  editorSnapshot = structuredClone(prof());
  const wrap = document.createElement("div");
  wrap.className = "pe-wrap";
  wrap.innerHTML = editorHTML();
  document.body.appendChild(wrap);
  document.body.classList.add("pe-open");
  requestAnimationFrame(() => wrap.classList.add("is-in"));
  const target = section && wrap.querySelector(`[data-sec="${section}"]`);
  // Scroll only the sheet body; scrollIntoView would also shift the sheet itself.
  if (target) setTimeout(() => wrap.querySelector(".pe__body").scrollTo({ top: target.offsetTop - 4 }), 60);
  else wrap.querySelector(".pe__done").focus({ preventScroll: true });
}

function closeEditor(instant) {
  const wrap = document.querySelector(".pe-wrap");
  if (!wrap) return;
  document.body.classList.remove("pe-open");
  if (instant) return wrap.remove();
  wrap.classList.remove("is-in");
  setTimeout(() => wrap.remove(), 300);
  persist();
}

// Redraws just the editor's chip/segment/theme states after a toggle, keeping scroll position.
function syncEditorControls(wrap) {
  wrap.querySelectorAll("[data-p-toggle]").forEach((b) => {
    const on = (getPath(prof(), b.dataset.pToggle) || []).includes(b.dataset.v);
    b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on);
  });
  wrap.querySelectorAll("[data-p-set]").forEach((b) => {
    const on = getPath(prof(), b.dataset.pSet) === b.dataset.v;
    b.classList.toggle("is-on", on); b.setAttribute("aria-checked", on);
  });
  wrap.querySelectorAll("[data-p-theme]").forEach((b) => {
    const on = prof().theme === b.dataset.pTheme;
    b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on);
  });
}

/* ───────────────────────── Events ───────────────────────── */

document.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-p-edit], [data-p-share], [data-p-close], [data-p-cancel], [data-p-toggle], [data-p-set], [data-p-theme], [data-p-photo-reset]");
  if (!el) return;
  const d = el.dataset;
  const wrap = document.querySelector(".pe-wrap");

  if (d.pEdit !== undefined) return openEditor(d.pEdit);
  if (d.pShare !== undefined) {
    const link = `clyx.app/@${prof().handle || "you"}`;
    try { navigator.clipboard?.writeText(`https://${link}`); } catch {}
    return toast(`Profile link copied: ${link}`);
  }
  if (d.pClose !== undefined) { closeEditor(); return toast("Profile saved"); }
  if (d.pCancel !== undefined) {
    if (editorSnapshot) state.profile = editorSnapshot;
    profileChanged();
    return closeEditor();
  }
  if (d.pToggle !== undefined) {
    const list = getPath(prof(), d.pToggle) || [];
    const i = list.indexOf(d.v);
    const max = Number(el.parentElement.dataset.max) || Infinity;
    if (i >= 0) list.splice(i, 1);
    else if (list.length >= max) return toast(`Pick up to ${max}`);
    else list.push(d.v);
    setPath(prof(), d.pToggle, list);
  }
  if (d.pSet !== undefined) setPath(prof(), d.pSet, d.v);
  if (d.pTheme !== undefined) prof().theme = d.pTheme;
  if (d.pPhotoReset !== undefined) {
    prof().photo = null;
    el.remove();
  }
  profileChanged();
  if (wrap) {
    syncEditorControls(wrap);
    const img = wrap.querySelector("#pe-photo-img");
    if (img) img.src = PEOPLE.me.photo;
  }
});

document.addEventListener("input", (ev) => {
  const el = ev.target;
  if (!el.closest?.(".pe") || !el.dataset.field) return;
  const path = el.dataset.field;
  let value = el.type === "checkbox" ? el.checked : el.value;
  if (path === "handle") {
    value = value.toLowerCase().replace(/[^a-z0-9_.]/g, "");
    if (value !== el.value) el.value = value;
  }
  if (/^prompts\.\d+\.q$/.test(path)) value = Number(value);
  if (path.startsWith("prompts.")) {
    const i = Number(path.split(".")[1]);
    prof().prompts[i] ||= { q: i, a: "" };
  }
  setPath(prof(), path, value);
  const counter = document.querySelector(`[data-count-for="${path}"]`);
  if (counter) counter.textContent = `${String(value).length}/${counter.textContent.split("/")[1]}`;
  profileChanged();
});
document.addEventListener("change", (ev) => {
  if (ev.target.id === "pe-photo-input" && ev.target.files?.[0]) loadPhoto(ev.target.files[0]);
});

document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && document.querySelector(".pe-wrap")) closeEditor();
});

// Crops the chosen image to a 360px square so it stays small enough for localStorage.
function loadPhoto(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const im = new Image();
    im.onload = () => {
      const size = 360, s = Math.min(im.width, im.height);
      const c = document.createElement("canvas");
      c.width = c.height = size;
      c.getContext("2d").drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, size, size);
      prof().photo = c.toDataURL("image/jpeg", 0.85);
      profileChanged();
      const img = document.querySelector("#pe-photo-img");
      if (img) img.src = PEOPLE.me.photo;
      toast("Looking good");
    };
    im.onerror = () => toast("Couldn’t read that image");
    im.src = reader.result;
  };
  reader.readAsDataURL(file);
}
