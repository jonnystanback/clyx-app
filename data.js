// Mock data for the Clyx prototype. Everything the UI renders comes from here.
// "Today" is pinned so dates stay coherent no matter when the mockup is opened.

const TODAY = new Date(2026, 9, 12); // Mon Oct 12 2026

const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const PEOPLE = {
  me:     { name: "Jonny S.",   handle: "jonny",  photo: "assets/me.jpg", city: "Los Angeles" },
  maya:   { name: "Maya Chen",  handle: "maya",   photo: img("1494790108377-be9c29b29330", 200), friend: true },
  leo:    { name: "Leo Brandt", handle: "leo",    photo: img("1500648767791-00dcc994a43e", 200), friend: true },
  kayla:  { name: "Kayla Ruiz", handle: "kayla",  photo: img("1438761681033-6461ffad8d80", 200), friend: true },
  ryan:   { name: "Ryan Okafor",handle: "ryan",   photo: img("1506794778202-cad84cf45f1d", 200), friend: true },
  sofia:  { name: "Sofia Marin",handle: "sofia",  photo: img("1534528741775-53994a69daeb", 200), friend: true },
  dev:    { name: "Dev Patel",  handle: "dev",    photo: img("1539571696357-5a69c17a67c6", 200), friend: true },
  ava:    { name: "Ava Laurent",handle: "ava",    photo: img("1517841905240-472988babdf9", 200) },
  noah:   { name: "Noah Kim",   handle: "noah",   photo: img("1488426862026-3ee34a7d66df", 200) },
  zoe:    { name: "Zoe Hart",   handle: "zoe",    photo: img("1524504388940-b1c1722653e1", 200) },
  sam:    { name: "Sam Rivera", handle: "sam",    photo: img("1531123897727-8f129e1688ce", 200) },
  iris:   { name: "Iris Novak", handle: "iris",   photo: img("1544005313-94ddf0286df2", 200) },
};

const COMMUNITIES = {
  coffeechill: {
    name: "Coffee & Chill",
    tagline: "Run first. Coffee after. Friends forever.",
    about: "Coffee & Chill is a community lifestyle company that brings people together through bonding wellness activities: weekend run clubs, sunrise yoga, and a long coffee after every single one.",
    leader: "kayla",
    members: 2140,
    cover: img("1552674605-db6ffd4facb5", 1400),
    tags: ["Wellness", "Sports"],
  },
  supperclub: {
    name: "Long Table",
    tagline: "Strangers at 7. Friends by dessert.",
    about: "Long Table hosts communal dinners at the best small restaurants in the city. One table, twenty seats, no phones until the plates are cleared.",
    leader: "leo",
    members: 860,
    cover: img("1414235077428-338989a2e8c0", 1400),
    tags: ["Food & Drink"],
  },
  lowend: {
    name: "Low End Social",
    tagline: "House music for people who actually dance.",
    about: "Rooftops, warehouses and backyards. Low End Social curates small-capacity dance parties with local selectors and a crowd that came to move.",
    leader: "dev",
    members: 3420,
    cover: img("1470229722913-7c0e2dbbafd3", 1400),
    tags: ["Music", "Nightlife"],
  },
  saltwater: {
    name: "Saltwater Club",
    tagline: "Get outside. Get in the water.",
    about: "Sailing days, surf mornings and beach cleanups along the coast. No experience needed, just show up.",
    leader: "sofia",
    members: 1180,
    cover: img("1507525428034-b723cf961d3e", 1400),
    tags: ["Sports", "Community"],
  },
  openstudio: {
    name: "Open Studio",
    tagline: "Make things with your hands, with other people.",
    about: "Figure drawing, ceramics nights and gallery walks for people who want art to be something you do, not just something you look at.",
    leader: "maya",
    members: 940,
    cover: img("1460661419201-fd4cecdf8a8b", 1400),
    tags: ["Arts"],
  },
};

const CATEGORIES = ["Music", "Food & Drink", "Nightlife", "Wellness", "Arts", "Community", "Sports"];

const VIBES = [
  { id: "loose",   label: "Let Loose",       color: "blue",   photo: img("1492684223066-81342ee5ff30", 600) },
  { id: "outside", label: "Get Outside",     color: "pink",   photo: img("1500530855697-b586d89ba3ee", 600) },
  { id: "meet",    label: "Meet New People", color: "yellow", photo: img("1529156069898-49953e39b3ac", 600) },
  { id: "date",    label: "Date Night",      color: "white",  photo: img("1559339352-11d035aa65de", 600) },
  { id: "good",    label: "Good Vibes",      color: "blue",   photo: img("1501281668745-f7f57925c3b4", 600) },
];

// day: offset from TODAY. going: people ids that are attending (friends surface first).
const EVENTS = [
  {
    id: "rooftop-sessions", title: "Rooftop Sessions", community: "lowend",
    day: 4, start: "7:00 PM", end: "1:00 AM",
    venue: "The Victorian", area: "Santa Monica", category: "Nightlife", vibes: ["loose", "good"],
    photo: img("1514525253161-7a46d19cd819", 1200),
    going: ["dev", "maya", "ava", "noah", "zoe"], count: 84, price: 25, trending: true,
    about: "Sunset to late on the best rooftop on the Westside. Three local selectors, one long golden-hour set, and a crowd that came to dance.\n\nCapacity is small on purpose. Come early, bring friends, stay for the last record.",
  },
  {
    id: "venice-run-club", title: "Run The Boardwalk", community: "coffeechill",
    day: 5, start: "9:00 AM", end: "11:00 AM",
    venue: "Venice Boardwalk", area: "Venice Beach", category: "Sports", vibes: ["outside", "meet"],
    photo: img("1452626038306-9aae5e071dd3", 1200),
    going: ["kayla", "ryan", "sofia", "iris", "sam"], count: 12, price: 0, trending: true,
    about: "A no-drop 5K along the boardwalk at conversation pace, followed by cold brew on the sand. Every pace welcome; we regroup at every turn.\n\nFirst time? Look for the yellow flag at the Windward Ave rotunda. Someone will introduce you to everyone.",
  },
  {
    id: "pasta-night", title: "Pasta Night", community: "supperclub",
    day: 4, start: "7:00 PM", end: "10:00 PM",
    venue: "Nudo", area: "Silver Lake", category: "Food & Drink", vibes: ["meet", "date"],
    photo: img("1565299624946-b28f40a0ae38", 1200),
    going: ["leo", "maya", "zoe"], count: 12, price: 45, trending: true,
    about: "Twenty seats at one long table. Four courses of handmade pasta, natural wine, and a seat next to someone you haven't met yet.\n\nWe shuffle seats between courses, so you'll leave knowing the whole table.",
  },
  {
    id: "boat-day", title: "Boat Day Marina del Rey", community: "saltwater",
    day: 6, start: "11:00 AM", end: "4:00 PM",
    venue: "Mother's Beach Dock", area: "Marina del Rey", category: "Sports", vibes: ["outside", "good"],
    photo: img("1500514966906-fe245eea9344", 1200),
    going: ["sofia", "ryan", "noah"], count: 11, price: 60,
    about: "Five hours on two 40-foot sailboats. Learn to trim a sail, jump off the stern, eat sandwiches in the sun. No experience needed.",
  },
  {
    id: "sunrise-yoga", title: "Sunrise Yoga", community: "coffeechill",
    day: 6, start: "7:00 AM", end: "8:30 AM",
    venue: "Palisades Park", area: "Santa Monica", category: "Wellness", vibes: ["outside"],
    photo: img("1506126613408-eca07ce68773", 1200),
    going: ["kayla", "iris"], count: 21, price: 0,
    about: "Slow vinyasa as the sun comes up over the city, then coffee and pastries on the grass. Bring a mat, or borrow one of ours.",
  },
  {
    id: "figure-drawing", title: "Figure Drawing & Wine", community: "openstudio",
    day: 2, start: "7:30 PM", end: "9:30 PM",
    venue: "Hauser Annex", area: "Arts District", category: "Arts", vibes: ["date", "meet"],
    photo: img("1513364776144-60967b0f800f", 1200),
    going: ["maya", "ava"], count: 18, price: 20,
    about: "Two hours of timed poses with a live model, guided by a working illustrator. Paper, charcoal and a glass of wine included. Zero experience is the most common experience.",
  },
  {
    id: "backyard-disco", title: "Backyard Disco", community: "lowend",
    day: 11, start: "8:00 PM", end: "2:00 AM",
    venue: "Secret Location", area: "Echo Park", category: "Music", vibes: ["loose"],
    photo: img("1533174072545-7a4b6ad7a6c3", 1200),
    going: ["dev", "leo", "kayla", "zoe"], count: 140, price: 20,
    about: "Disco, boogie and edits under string lights. Address drops to attendees the morning of.",
  },
  {
    id: "beach-cleanup", title: "Beach Cleanup + Tacos", community: "saltwater",
    day: 3, start: "10:00 AM", end: "12:30 PM",
    venue: "Dockweiler Beach", area: "Playa del Rey", category: "Community", vibes: ["outside", "meet"],
    photo: img("1618477461853-cf6ed80faba5", 1200),
    going: ["sofia", "sam"], count: 36, price: 0,
    about: "Two hours of cleanup, then a taco truck on us. Gloves and bags provided.",
  },
  {
    id: "listening-party", title: "Vinyl Listening Party", community: "lowend",
    day: 0, start: "8:00 PM", end: "11:00 PM",
    venue: "Gold Line Bar", area: "Highland Park", category: "Music", vibes: ["good", "date"],
    photo: img("1459749411175-04bf5292ceea", 1200),
    going: ["dev", "ryan"], count: 30, price: 0,
    about: "A full album, front to back, on a hi-fi system worth more than the bar. Tonight: a 1977 jazz-funk record you've never heard of and will never forget.",
  },
  {
    id: "ceramics-night", title: "Ceramics Night", community: "openstudio",
    day: 9, start: "6:30 PM", end: "9:00 PM",
    venue: "Clay LA", area: "Frogtown", category: "Arts", vibes: ["date"],
    photo: img("1565193566173-7a0ee3dbe261", 1200),
    going: ["maya"], count: 14, price: 55,
    about: "Wheel-throwing basics with a small group. You'll leave with two pieces to glaze next week.",
  },
  {
    id: "supper-in-the-garden", title: "Supper in the Garden", community: "supperclub",
    day: 12, start: "6:00 PM", end: "9:30 PM",
    venue: "Arlington Garden", area: "Pasadena", category: "Food & Drink", vibes: ["date", "meet"],
    photo: img("1555396273-367ea4eb4db5", 1200),
    going: ["leo", "sofia", "kayla"], count: 24, price: 70,
    about: "A family-style harvest dinner at a long table among the olive trees.",
  },
  // Past events (negative day) power "People you've met" and memories.
  {
    id: "past-dinner", title: "Taco Tuesday Takeover", community: "supperclub",
    day: -6, start: "7:00 PM", end: "10:00 PM",
    venue: "Sonoratown", area: "Downtown", category: "Food & Drink", vibes: ["meet"],
    photo: img("1504674900247-0877df9cc836", 1200),
    going: ["me", "leo", "ava", "noah"], count: 20, price: 30,
    about: "",
  },
  {
    id: "past-run", title: "Griffith Trail Run", community: "coffeechill",
    day: -9, start: "8:00 AM", end: "10:00 AM",
    venue: "Griffith Observatory", area: "Los Feliz", category: "Sports", vibes: ["outside"],
    photo: img("1469474968028-56623f02e42e", 1200),
    going: ["me", "kayla", "iris", "sam"], count: 18, price: 0,
    about: "",
  },
];

// Starting state for the signed-in user.
const SEED_STATE = {
  going: ["past-dinner", "past-run", "venice-run-club"],
  saved: ["boat-day"],
  joined: ["coffeechill"],
  following: ["maya", "leo", "kayla", "ryan", "sofia", "dev"],
};

// Friend activity feed. `t` is hours ago.
const ACTIVITY = [
  { who: "maya",  verb: "is going to",       event: "pasta-night",     t: 1 },
  { who: "dev",   verb: "is hosting",        event: "backyard-disco",  t: 3 },
  { who: "kayla", verb: "invited you to",    event: "sunrise-yoga",    t: 5 },
  { who: "ryan",  verb: "is going to",       event: "boat-day",        t: 8 },
  { who: "sofia", verb: "joined",            community: "saltwater",   t: 20 },
  { who: "leo",   verb: "saved",             event: "supper-in-the-garden", t: 26 },
  { who: "maya",  verb: "is going to",       event: "figure-drawing",  t: 30 },
];
