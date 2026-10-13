// Clyx prototype: a hash-routed single page app. No build step.

/* ───────────────────────── State ───────────────────────── */

const STORE_KEY = "clyx-state-v1";

const state = (() => {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORE_KEY)); } catch {}
  return Object.assign(structuredClone(SEED_STATE), saved || {});
})();

function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {}
}

function toggleIn(list, id) {
  const arr = state[list];
  const i = arr.indexOf(id);
  if (i >= 0) arr.splice(i, 1); else arr.push(id);
  persist();
  return i < 0;
}

// Explore filters live in memory only; they reset on reload.
const filters = { day: null, category: null, vibe: null, q: "" };

/* ───────────────────────── Helpers ───────────────────────── */

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_SHORT = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));

const dateFor = (offset) => { const d = new Date(TODAY); d.setDate(d.getDate() + offset); return d; };
const longDate = (offset) => { const d = dateFor(offset); return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`; };

const eventById = (id) => EVENTS.find((e) => e.id === id);
const isFriend = (pid) => state.following.includes(pid);
const amGoing = (e) => state.going.includes(e.id);

// Attendees with friends first; "me" goes up front when I'm going.
function attendees(e) {
  const ids = e.going.filter((p) => p !== "me");
  ids.sort((a, b) => isFriend(b) - isFriend(a));
  if (amGoing(e)) ids.unshift("me");
  return ids;
}
const goingCount = (e) => e.count + (amGoing(e) && !e.going.includes("me") ? 1 : 0);
const friendsGoing = (e) => e.going.filter((p) => p !== "me" && isFriend(p));

function friendLine(e) {
  const f = friendsGoing(e).map((p) => PEOPLE[p].name.split(" ")[0]);
  if (!f.length) return "";
  if (f.length === 1) return `<b>${f[0]}</b> is going`;
  if (f.length === 2) return `<b>${f[0]}</b> and <b>${f[1]}</b> are going`;
  return `<b>${f[0]}</b>, <b>${f[1]}</b> + ${f.length - 2} friend${f.length > 3 ? "s" : ""} going`;
}

const stack = (ids, n = 3, cls = "") =>
  `<span class="stack ${cls}">${ids.slice(0, n).map((p) => `<img src="${PEOPLE[p].photo}" alt="${esc(PEOPLE[p].name)}" loading="lazy">`).join("")}</span>`;

const ICON = {
  heart: `<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/></svg>`,
  back: `<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>`,
  pin: `<svg viewBox="0 0 24 24"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>`,
  search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>`,
  cal: `<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>`,
  share: `<svg viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  chev: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>`,
};

const heartBtn = (e, cls = "heart") =>
  `<button class="${cls} ${state.saved.includes(e.id) ? "is-on" : ""}" data-save="${e.id}" aria-label="Save ${esc(e.title)}" aria-pressed="${state.saved.includes(e.id)}">${ICON.heart}</button>`;

/* ───────────────────────── Components ───────────────────────── */

function eventCard(e, { badge } = {}) {
  const fl = friendLine(e);
  return `
  <a class="card" href="#/event/${e.id}">
    <div class="card__media">
      <img src="${e.photo}" alt="" loading="lazy">
      ${badge ? `<span class="badge badge--${badge.color}">${badge.label}</span>` : ""}
      ${heartBtn(e)}
    </div>
    <div class="card__body">
      <div class="card__when">${longDate(e.day)} · ${e.start}</div>
      <div class="card__title">${esc(e.title)}</div>
      <div class="card__where">${esc(e.venue)} · ${esc(e.area)}</div>
      <div class="card__social">${stack(attendees(e))}<span class="card__count">${goingCount(e)} going</span></div>
      ${fl ? `<div class="card__friends">${fl}</div>` : ""}
    </div>
  </a>`;
}

function rowCard(e) {
  return `
  <a class="rowcard" href="#/event/${e.id}">
    <div class="rowcard__media"><img src="${e.photo}" alt="" loading="lazy"></div>
    <div>
      <div class="card__when">${longDate(e.day)} · ${e.start}</div>
      <div class="card__title">${esc(e.title)}</div>
      <div class="card__where">${esc(e.venue)} · ${esc(e.area)}</div>
      <div class="rowcard__meta">${stack(attendees(e))}<span class="card__count">${goingCount(e)} going</span></div>
    </div>
    ${heartBtn(e, "heart heart--inline")}
  </a>`;
}

function personRow(pid, sub) {
  const p = PEOPLE[pid];
  const following = isFriend(pid);
  return `
  <div class="person">
    <img src="${p.photo}" alt="" loading="lazy">
    <div><div class="person__name">${esc(p.name)}</div>${sub ? `<div class="person__sub">${sub}</div>` : ""}</div>
    ${pid === "me" ? "" : `<button class="btn btn--sm ${following ? "btn--ghost" : "btn--ink"}" data-follow="${pid}">${following ? "Friends" : "Add friend"}</button>`}
  </div>`;
}

function commTile(id) {
  const c = COMMUNITIES[id];
  const joined = state.joined.includes(id);
  return `
  <a class="comm" href="#/community/${id}">
    <div class="comm__media">
      <img src="${c.cover}" alt="" loading="lazy">
      ${joined ? `<span class="badge badge--yellow">Joined</span>` : ""}
      <div class="comm__name">${esc(c.name)}</div>
    </div>
    <div class="comm__meta">${c.members.toLocaleString()} members · ${c.tags.join(", ")}</div>
  </a>`;
}

/* ───────────────────────── Views ───────────────────────── */

const upcoming = () => EVENTS.filter((e) => e.day >= 0).sort((a, b) => a.day - b.day);

function viewExplore() {
  const dates = Array.from({ length: 8 }, (_, i) => {
    const d = dateFor(i);
    const label = i === 0 ? "Today" : DAYS_SHORT[d.getDay()];
    return `<button class="datechip ${filters.day === i ? "is-on" : ""}" data-day="${i}">${label}<br>${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}</button>`;
  }).join("");

  const cats = CATEGORIES.map((c) => `<button class="chip ${filters.category === c ? "is-on" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  const anyFilter = filters.day !== null || filters.category || filters.vibe || filters.q;

  let body;
  if (anyFilter) {
    const q = filters.q.toLowerCase();
    const list = upcoming().filter((e) =>
      (filters.day === null || e.day === filters.day) &&
      (!filters.category || e.category === filters.category) &&
      (!filters.vibe || e.vibes.includes(filters.vibe)) &&
      (!q || [e.title, e.venue, e.area, e.category, COMMUNITIES[e.community].name].join(" ").toLowerCase().includes(q))
    );
    const labels = [
      filters.day !== null && (filters.day === 0 ? "Today" : longDate(filters.day)),
      filters.category, filters.vibe && VIBES.find((v) => v.id === filters.vibe).label,
      filters.q && `“${esc(filters.q)}”`,
    ].filter(Boolean).join(" · ");
    body = `
      <div class="results-head"><h2 class="h2">${list.length} thing${list.length === 1 ? "" : "s"} to do</h2><span class="lede">${labels}</span><button class="clear" data-clear>Clear</button></div>
      ${list.length ? `<div class="grid-3">${list.map((e) => eventCard(e)).join("")}</div>`
        : `<div class="empty">Nothing matches yet. Try another day or vibe.<br><button class="btn btn--yellow" data-clear>Show everything</button></div>`}`;
  } else {
    const trending = upcoming().filter((e) => e.trending);
    const withFriends = upcoming().filter((e) => friendsGoing(e).length && !amGoing(e))
      .sort((a, b) => friendsGoing(b).length - friendsGoing(a).length).slice(0, 3);
    const recommended = upcoming().filter((e) => !e.trending && !withFriends.includes(e)).slice(0, 4);
    const commIds = Object.keys(COMMUNITIES).sort((a, b) => state.joined.includes(a) - state.joined.includes(b)).slice(0, 4);

    body = `
      <section class="section">
        <div class="section__head"><h2 class="h2">Trending in Los Angeles <span class="emoji">👋</span></h2></div>
        <div class="grid-3 rail">${trending.map((e) => eventCard(e)).join("")}</div>
      </section>

      <section class="section">
        <div class="section__head"><div><h2 class="h2">Your friends are going</h2><p class="lede">Plans are better with people you know.</p></div><a class="see-all" href="#/friends">See All ›</a></div>
        <div class="friendstrip rail">${withFriends.map((e) => {
          const f = friendsGoing(e);
          return `<a class="fcard" href="#/event/${e.id}">
            <img class="fcard__thumb" src="${e.photo}" alt="" loading="lazy">
            <div>
              <div class="fcard__line">${esc(PEOPLE[f[0]].name.split(" ")[0])}${f.length > 1 ? ` + ${f.length - 1}` : ""} → ${esc(e.title)}</div>
              <div class="fcard__sub">${DAYS_SHORT[dateFor(e.day).getDay()]} · ${e.start} · ${esc(e.area)}</div>
              ${stack(f, 4)}
            </div></a>`;
        }).join("")}</div>
      </section>

      <section class="section">
        <div class="section__head"><h2 class="h2">Explore By Vibe <span class="emoji">👉</span></h2></div>
        <div class="vibes rail">${VIBES.map((v) => `
          <button class="vibe" data-vibe="${v.id}" aria-label="${v.label}">
            <img src="${v.photo}" alt="" loading="lazy"><span class="badge badge--${v.color}">${v.label}</span>
          </button>`).join("")}</div>
      </section>

      <section class="section">
        <div class="section__head"><div><h2 class="h2">Communities worth joining</h2><p class="lede">Curated crews, led by people who actually show up.</p></div></div>
        <div class="comms rail">${commIds.map(commTile).join("")}</div>
      </section>

      <section class="section">
        <div class="section__head"><h2 class="h2">Recommended For You</h2></div>
        <div class="grid-2">${recommended.map(rowCard).join("")}</div>
      </section>`;
  }

  return `
  <div class="page">
    <h1 class="display">Find your<br>next thing.</h1>
    <div class="search-row">
      <button class="pill-input pill-input--loc" data-toast="Location picker coming soon">${ICON.pin} Los Angeles, CA ${ICON.chev}</button>
      <label class="pill-input pill-input--search">${ICON.search}<input id="search" type="search" placeholder="Search for events, places, communities..." value="${esc(filters.q)}" autocomplete="off"></label>
    </div>
    <div class="scroller">
      <button class="datechip ${filters.day === null ? "is-on" : ""}" data-day="">Any Time</button>
      ${dates}
      <button class="datechip" data-toast="Calendar view coming soon" aria-label="Pick a date">${ICON.cal}</button>
    </div>
    <div class="scroller chips">
      <button class="chip ${!filters.category ? "is-on" : ""}" data-cat="">All Events</button>
      ${cats}
    </div>
    ${body}
  </div>`;
}

function viewEvent(id) {
  const e = eventById(id);
  if (!e) return viewNotFound();
  const c = COMMUNITIES[e.community];
  const going = amGoing(e);
  const ppl = attendees(e);
  const fl = friendLine(e);
  const past = e.day < 0;
  const free = e.price === 0;
  const memberPrice = Math.round(e.price * 0.8);
  const ctaLabel = going ? `${ICON.check} You’re going` : free ? "RSVP" : "Get Ticket";

  return `
  <div class="page page--event">
    <a class="back" href="#/explore" data-back>${ICON.back} Back</a>
    <div class="event">
      <div>
        <div class="event__media">
          <a class="back-float" href="#/explore" data-back aria-label="Back">${ICON.back}</a>
          <img src="${e.photo}" alt="">
        </div>
        <div class="presented">
          <div class="presented__head">
            <a href="#/community/${e.community}"><h3>Presented by<br>${esc(c.name)}</h3></a>
            <button class="btn btn--sm ${state.joined.includes(e.community) ? "btn--ghost" : "btn--ink"}" data-join="${e.community}">${state.joined.includes(e.community) ? "Joined" : "Join"}</button>
          </div>
          <p class="prose">${esc(c.about)}</p>
        </div>
      </div>

      <div>
        <h1 class="event__title">${esc(e.title)}</h1>
        <div class="event__facts">
          <p>${longDate(e.day)}</p>
          <p>${e.start} - ${e.end}</p>
          <p class="gap">${esc(e.venue)} · ${esc(e.area)}</p>
        </div>
        <div class="event__actions">
          ${heartBtn(e, "iconbtn")}
          <button class="iconbtn" data-toast="Link copied. Send it to the group chat." aria-label="Share">${ICON.share}</button>
        </div>

        ${past ? "" : `
        <div class="ticket">
          <h3>${free ? "Save Your Spot" : "Get Tickets"}</h3>
          ${free
            ? `<div class="ticket__opt is-on">Free RSVP <small>${goingCount(e)} going</small></div>`
            : `<button class="ticket__opt is-on" data-tier>Early Bird Ticket <small>$${e.price}</small></button>
               <button class="ticket__opt" data-tier>CLYX Member Ticket <small>$${memberPrice}</small></button>`}
          <button class="btn btn--block ${going ? "btn--done" : "btn--yellow"}" data-go="${e.id}">${ctaLabel}</button>
          <p class="ticket__note">${going ? "We’ll remind you the day before." : fl ? fl.replace(/<\/?b>/g, "") + " · go together" : "Bring a friend. Plans are better together."}</p>
        </div>`}

        <div class="about">
          <h3>About Event</h3>
          <p class="prose">${esc(e.about || "A Clyx community event.")}</p>
        </div>

        <div class="going">
          ${stack(ppl, 3, "stack--lg")}
          <div class="going__count">${goingCount(e)} ${past ? "went" : "going"}</div>
          ${fl ? `<div class="going__friends">${fl}</div>` : ""}
          <div class="people">${ppl.slice(0, 6).map((p) => personRow(p, p === "me" ? "You" : isFriend(p) ? "Friend" : `Also into ${c.tags[0]}`)).join("")}</div>
        </div>
      </div>
    </div>

    ${past ? "" : `
    <div class="cta-bar">
      <div class="cta-bar__price"><b>${free ? "Free" : `$${e.price}`}</b>${goingCount(e)} going</div>
      <button class="btn ${going ? "btn--done" : "btn--yellow"}" data-go="${e.id}">${ctaLabel}</button>
    </div>`}
  </div>`;
}

let myTab = "upcoming";
function viewMyEvents() {
  const going = state.going.map(eventById).filter(Boolean);
  const lists = {
    upcoming: going.filter((e) => e.day >= 0).sort((a, b) => a.day - b.day),
    saved: state.saved.map(eventById).filter((e) => e && e.day >= 0),
    past: going.filter((e) => e.day < 0).sort((a, b) => b.day - a.day),
  };
  const list = lists[myTab];
  const empty = {
    upcoming: "No plans yet. Your friends have some.",
    saved: "Tap the heart on anything that looks good.",
    past: "Your memories will live here.",
  }[myTab];

  const row = (e) => {
    const d = dateFor(e.day);
    const met = e.going.filter((p) => p !== "me");
    const past = e.day < 0;
    return `
    <div class="myrow ${past ? "is-past" : ""}">
      <a class="myrow__date" href="#/event/${e.id}"><span class="m">${MONTHS_SHORT[d.getMonth()]}</span><span class="d">${d.getDate()}</span></a>
      <a class="myrow__media" href="#/event/${e.id}"><img src="${e.photo}" alt="" loading="lazy"></a>
      <a href="#/event/${e.id}">
        <div class="card__when">${DAYS[d.getDay()]} · ${e.start}</div>
        <div class="card__title">${esc(e.title)}</div>
        <div class="card__where">${esc(e.venue)} · ${esc(e.area)}</div>
        <div class="myrow__met">${stack(past ? met : attendees(e).filter((p) => p !== "me"), 4)}
          ${past ? `You met ${met.length} people here` : friendLine(e) ? friendLine(e).replace(/<\/?b>/g, "") : `${goingCount(e)} going`}</div>
      </a>
      ${past
        ? `<a class="btn btn--sm btn--ghost" href="#/friends">See who you met</a>`
        : myTab === "saved"
          ? `<button class="btn btn--sm btn--yellow" data-go="${e.id}">${amGoing(e) ? "Going" : e.price ? "Get Ticket" : "RSVP"}</button>`
          : `<button class="btn btn--sm btn--ghost" data-toast="Invite link copied">Invite friends</button>`}
    </div>`;
  };

  return `
  <div class="page">
    <h1 class="display">My Events</h1>
    <div class="tabs" role="tablist">
      ${["upcoming", "saved", "past"].map((t) => `<button role="tab" class="${myTab === t ? "is-on" : ""}" data-tab="${t}" aria-selected="${myTab === t}">${t[0].toUpperCase() + t.slice(1)} · ${lists[t].length}</button>`).join("")}
    </div>
    ${list.length ? `<div class="mylist">${list.map(row).join("")}</div>`
      : `<div class="empty">${empty}<br><a class="btn btn--yellow" href="#/explore">Explore</a></div>`}
  </div>`;
}

function viewFriends() {
  const ago = (h) => (h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`);
  const feed = ACTIVITY.map((a) => {
    const p = PEOPLE[a.who];
    const e = a.event && eventById(a.event);
    const c = a.community && COMMUNITIES[a.community];
    const target = e ? `<a href="#/event/${e.id}">${esc(e.title)}</a>` : `<a href="#/community/${a.community}">${esc(c.name)}</a>`;
    const thumb = e ? e.photo : c.cover;
    const invite = a.verb.startsWith("invited");
    return `
    <div class="feeditem">
      <img src="${p.photo}" alt="" loading="lazy">
      <div>
        <div class="feeditem__text"><b>${esc(p.name.split(" ")[0])}</b> ${a.verb} ${target}</div>
        <div class="feeditem__time">${ago(a.t)}${e ? ` · ${DAYS_SHORT[dateFor(e.day).getDay()]} ${e.start}` : ""}</div>
        ${e && !amGoing(e) ? `<div class="feeditem__actions">
          <button class="btn btn--sm ${invite ? "btn--yellow" : "btn--ghost"}" data-go="${e.id}">${invite ? "Accept" : "Join them"}</button>
        </div>` : e ? `<div class="feeditem__actions"><span class="btn btn--sm btn--done">${ICON.check} Going</span></div>` : ""}
      </div>
      <a href="${e ? `#/event/${e.id}` : `#/community/${a.community}`}"><img class="feeditem__thumb" src="${thumb}" alt="" loading="lazy"></a>
    </div>`;
  }).join("");

  // People met at past events that you haven't added yet.
  const met = new Map();
  EVENTS.filter((e) => e.day < 0 && state.going.includes(e.id)).forEach((e) =>
    e.going.forEach((p) => { if (p !== "me" && !met.has(p)) met.set(p, e); }));
  const metRows = [...met].map(([p, e]) => personRow(p, `Met at ${esc(e.title)}`)).join("");
  const friendRows = state.following.map((p) => personRow(p, PEOPLE[p].handle && `@${PEOPLE[p].handle}`)).join("");

  return `
  <div class="page">
    <h1 class="display">Friends</h1>
    <div class="two-col">
      <section>
        <div class="section__head"><h2 class="h2">What your friends are up to</h2></div>
        <div class="feed">${feed}</div>
      </section>
      <aside>
        <div class="panel">
          <h3>See who clyx with you</h3>
          <p class="lede">People you met at events. Keep the connection going.</p>
          ${metRows || `<p class="lede">Go to an event to meet people.</p>`}
        </div>
        <div class="panel">
          <h3>Your friends · ${state.following.length}</h3>
          ${friendRows}
        </div>
      </aside>
    </div>
  </div>`;
}

function viewCommunity(id) {
  const c = COMMUNITIES[id];
  if (!c) return viewNotFound();
  const joined = state.joined.includes(id);
  const events = upcoming().filter((e) => e.community === id);
  const leader = PEOPLE[c.leader];
  const memberIds = [...new Set(EVENTS.filter((e) => e.community === id).flatMap((e) => e.going))].filter((p) => p !== "me");
  const friendMembers = memberIds.filter(isFriend);

  return `
  <div class="page page--comm">
    <a class="back" href="#/explore" data-back>${ICON.back} Back</a>
    <div class="hero">
      <img src="${c.cover}" alt="">
      <div class="hero__text"><h1>${esc(c.name)}</h1><p>${esc(c.tagline)}</p></div>
    </div>
    <div class="comm-bar">
      <div class="leader"><img src="${leader.photo}" alt=""><div><div class="person__name">${esc(leader.name)}</div><span class="tag">Community Leader</span></div></div>
      <div class="stat"><b>${(c.members + (joined && !SEED_STATE.joined.includes(id) ? 1 : 0)).toLocaleString()}</b><span>members</span></div>
      <div class="stat"><b>${events.length}</b><span>upcoming</span></div>
      ${friendMembers.length ? `<div class="stat">${stack(friendMembers, 4)}<span>${friendMembers.length} friend${friendMembers.length > 1 ? "s" : ""} here</span></div>` : ""}
      <button class="btn ${joined ? "btn--ghost" : "btn--yellow"}" data-join="${id}">${joined ? `${ICON.check} Joined` : "Join Community"}</button>
    </div>
    <p class="prose" style="max-width:62ch;margin-top:20px">${esc(c.about)}</p>

    <section class="section">
      <div class="section__head"><h2 class="h2">Upcoming</h2></div>
      ${events.length ? `<div class="grid-3">${events.map((e) => eventCard(e)).join("")}</div>` : `<div class="empty">New dates drop soon.</div>`}
    </section>

    <section class="section">
      <div class="section__head"><h2 class="h2">Members</h2></div>
      <div class="people" style="max-width:520px">${memberIds.slice(0, 6).map((p) => personRow(p, p === c.leader ? "Leader" : isFriend(p) ? "Friend" : "Member")).join("")}</div>
    </section>
  </div>`;
}

function viewProfile() {
  const me = PEOPLE.me;
  const past = state.going.map(eventById).filter((e) => e && e.day < 0);
  const metCount = new Set(past.flatMap((e) => e.going)).size - (past.length ? 1 : 0);
  return `
  <div class="page">
    <div class="profile-head">
      <img src="${me.photo}" alt="">
      <div>
        <h1>${esc(me.name)}</h1>
        <div class="lede">@${me.handle} · ${me.city}</div>
        <div class="profile-stats">
          <div class="stat"><b>${past.length}</b><span>experiences</span></div>
          <div class="stat"><b>${metCount}</b><span>people met</span></div>
          <div class="stat"><b>${state.following.length}</b><span>friends</span></div>
        </div>
      </div>
    </div>
    <section class="section">
      <div class="section__head"><h2 class="h2">Your communities</h2></div>
      ${state.joined.length ? `<div class="comms">${state.joined.map(commTile).join("")}</div>` : `<div class="empty">Join a community to see it here.</div>`}
    </section>
    <section class="section">
      <div class="section__head"><h2 class="h2">Memories</h2></div>
      <div class="grid-3">${past.map((e) => eventCard(e)).join("")}</div>
    </section>
    <section class="section">
      <button class="btn btn--ghost btn--sm" data-reset>Reset demo data</button>
    </section>
  </div>`;
}

function viewNotFound() {
  return `<div class="page"><h1 class="display">Lost?</h1><a class="btn btn--yellow" href="#/explore">Back to Explore</a></div>`;
}

/* ───────────────────────── Router ───────────────────────── */

const view = $("#view");
let lastRoute = "";

function render({ keepScroll = false } = {}) {
  let [, name, arg] = (location.hash || "#/").split("/");
  name = name || "home";
  document.body.classList.toggle("is-landing", name === "home");
  const html = {
    home: viewHome,
    explore: viewExplore,
    event: () => viewEvent(arg),
    "my-events": viewMyEvents,
    friends: viewFriends,
    community: () => viewCommunity(arg),
    profile: viewProfile,
  }[name];
  const y = window.scrollY;
  view.innerHTML = (html || viewNotFound)();

  const section = ["event", "community", "home"].includes(name) ? null : name;
  document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === section));

  const route = location.hash;
  if (keepScroll) window.scrollTo(0, y);
  else if (route !== lastRoute) window.scrollTo(0, 0);
  lastRoute = route;

  if (name === "home") { initHome(); fitGlass(); }
  queueTone();
  view.querySelectorAll("img").forEach((im) => im.addEventListener("error", () => im.classList.add("img-missing"), { once: true }));
}

// Re-render in place (after a state change) without replaying the entrance animation.
function refresh() {
  render({ keepScroll: true });
  view.firstElementChild?.style.setProperty("animation", "none");
}

let navCount = 0;
window.addEventListener("hashchange", () => { navCount++; render(); });

/* ───────────────────────── Interactions ───────────────────────── */

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  t.style.animation = "none"; t.offsetHeight; t.style.animation = "";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2400);
}

document.addEventListener("click", (ev) => {
  const el = ev.target.closest("button, a");
  if (!el) return;
  const d = el.dataset;

  if (d.save !== undefined) {
    ev.preventDefault();
    const on = toggleIn("saved", d.save);
    toast(on ? "Saved to My Events" : "Removed from saved");
    return refresh();
  }
  if (d.go !== undefined) {
    ev.preventDefault();
    const e = eventById(d.go);
    if (amGoing(e)) {
      toggleIn("going", e.id);
      toast("You’re no longer going");
    } else {
      toggleIn("going", e.id);
      const f = friendsGoing(e);
      toast(f.length ? `You’re going with ${PEOPLE[f[0]].name.split(" ")[0]}${f.length > 1 ? ` + ${f.length - 1}` : ""}` : "You’re going. See you there.");
    }
    return refresh();
  }
  if (d.join !== undefined) {
    ev.preventDefault();
    const on = toggleIn("joined", d.join);
    toast(on ? `Welcome to ${COMMUNITIES[d.join].name}` : `Left ${COMMUNITIES[d.join].name}`);
    return refresh();
  }
  if (d.follow !== undefined) {
    ev.preventDefault();
    const on = toggleIn("following", d.follow);
    toast(on ? `Friend request sent to ${PEOPLE[d.follow].name.split(" ")[0]}` : "Removed friend");
    return refresh();
  }
  if (d.day !== undefined) {
    filters.day = d.day === "" ? null : Number(d.day);
    return refresh();
  }
  if (d.cat !== undefined && el.tagName === "BUTTON") {
    filters.category = d.cat || null;
    return refresh();
  }
  if (d.vibe !== undefined) {
    filters.vibe = filters.vibe === d.vibe ? null : d.vibe;
    refresh();
    return $(".results-head")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (d.clear !== undefined) {
    Object.assign(filters, { day: null, category: null, vibe: null, q: "" });
    return refresh();
  }
  if (d.tab !== undefined) { myTab = d.tab; return refresh(); }
  if (d.tier !== undefined) {
    el.parentElement.querySelectorAll("[data-tier]").forEach((b) => b.classList.toggle("is-on", b === el));
    return;
  }
  if (d.scroll !== undefined) {
    const go = () => document.getElementById(d.scroll)?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (document.body.classList.contains("is-landing")) return go();
    location.hash = "#/";
    return setTimeout(go, 60);
  }
  if (d.toast !== undefined) { ev.preventDefault(); return toast(d.toast); }
  if (d.back !== undefined && navCount > 0) {
    ev.preventDefault();
    return history.back();
  }
  if (d.reset !== undefined) {
    try { localStorage.removeItem(STORE_KEY); } catch {}
    Object.assign(state, structuredClone(SEED_STATE));
    toast("Demo data reset");
    return refresh();
  }
});

// Newsletter signup on the landing page. Mockup only: nothing is sent anywhere.
document.addEventListener("submit", (ev) => {
  if (!ev.target.matches("[data-newsletter]")) return;
  ev.preventDefault();
  ev.target.reset();
  toast("You’re on the list. See you Thursday.");
});

// Live search: re-render results but keep the caret in the input.
document.addEventListener("input", (ev) => {
  if (ev.target.id !== "search") return;
  filters.q = ev.target.value.trim();
  const pos = ev.target.selectionStart;
  refresh();
  const s = $("#search");
  s.focus();
  s.setSelectionRange(pos, pos);
});

/* ───────────────────────── Glass pill (landing) ───────────────────────── */

// Only Chromium can run an SVG filter inside backdrop-filter; everyone else keeps the frosted CSS.
const HAS_LIQUID = !!navigator.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand));
if (HAS_LIQUID) document.documentElement.classList.add("has-liquid");

// Draws a displacement map for a pill of w x h. Red/green encode x/y offsets (128 = none).
// Near the rim, pixels sample from further inside, so content bends like light through a lens edge.
function glassMap(w, h) {
  const r = h / 2, band = Math.min(r * 0.95, 26);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  const data = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5, py = y + 0.5;
      const cx = Math.min(Math.max(px, r), w - r);        // nearest point on the pill's spine
      let dx = px - cx, dy = py - r;
      const len = Math.hypot(dx, dy) || 1;
      const depth = r - len;                             // distance in from the rim
      let ox = 0, oy = 0;
      if (depth > 0 && depth < band) {
        const k = Math.pow(1 - depth / band, 2.2);       // strongest right at the edge
        ox = -(dx / len) * k; oy = -(dy / len) * k;
      }
      const i = (y * w + x) * 4;
      data.data[i] = 128 + ox * 127;
      data.data[i + 1] = 128 + oy * 127;
      data.data[i + 2] = 128;
      data.data[i + 3] = 255;
    }
  }
  ctx.putImageData(data, 0, 0);
  return c.toDataURL();
}

const pill = $(".topbar__inner");
let pillSize = "";
function fitGlass() {
  if (!HAS_LIQUID || !document.body.classList.contains("is-landing")) return;
  const w = Math.round(pill.offsetWidth), h = Math.round(pill.offsetHeight);
  if (!w || `${w}x${h}` === pillSize) return;
  pillSize = `${w}x${h}`;
  const map = $("#liquid-glass-map");
  map.setAttribute("href", glassMap(w, h));
  map.setAttribute("width", w);
  map.setAttribute("height", h);
}
if (HAS_LIQUID) new ResizeObserver(fitGlass).observe(pill);

// Flip the pill's text to white while it floats over dark imagery.
const DARK = ".hero2, .feature, .path__media, .poster--blur, .poster--photo, .poster--red, .poster--olive, .host";
const topbar = $(".topbar");
let toneQueued = false;
function updateTone() {
  toneQueued = false;
  if (!document.body.classList.contains("is-landing")) return topbar.classList.remove("on-dark");
  const b = pill.getBoundingClientRect();
  const y = b.top + b.height / 2;
  // Sample a few points along the pill and go dark if most of them are over dark content.
  const xs = [0.2, 0.5, 0.8].map((f) => b.left + b.width * f);
  const dark = xs.filter((x) => document.elementsFromPoint(x, y).find((el) => !topbar.contains(el))?.closest(DARK)).length;
  topbar.classList.toggle("on-dark", dark >= 2);
}
const queueTone = () => { if (!toneQueued) { toneQueued = true; requestAnimationFrame(updateTone); } };
window.addEventListener("scroll", queueTone, { passive: true });
window.addEventListener("resize", queueTone);

$("#me-avatar").src = PEOPLE.me.photo;
render();
