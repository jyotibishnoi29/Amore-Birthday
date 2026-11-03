const scenes = ["scene-countdown", "scene-cake", "scene-letter", "scene-name", "scene-memories", "scene-final"];
let currentScene = 0;

const pageNumber = document.getElementById("pageNumber");
const song = document.getElementById("loveSong");
const musicToggle = document.getElementById("musicToggle");
const petals = document.getElementById("petalLayer");

// Falling petals and hearts
if (petals && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const petalGlyphs = ["✿", "❀", "❁", "♥", "✧"];

  for (let i = 0; i < 22; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = petalGlyphs[i % petalGlyphs.length];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.fontSize = `${12 + Math.random() * 15}px`;
    petal.style.setProperty("--fall", `${10 + Math.random() * 13}s`);
    petal.style.setProperty("--delay", `${-Math.random() * 20}s`);
    petal.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
    petals.appendChild(petal);
  }
}

// Blurred memory background
const firstPhoto = document.querySelector(".polaroid img");

if (firstPhoto) {
  firstPhoto.addEventListener("load", () => {
    const backdrop = document.getElementById("memoryBackdrop");

    if (backdrop) {
      backdrop.style.backgroundImage = `url('${firstPhoto.src}')`;
      document.body.classList.add("has-memory-bg");
    }
  });

  if (firstPhoto.complete && firstPhoto.naturalWidth > 0) {
    const backdrop = document.getElementById("memoryBackdrop");

    if (backdrop) {
      backdrop.style.backgroundImage = `url('${firstPhoto.src}')`;
      document.body.classList.add("has-memory-bg");
    }
  }
}

// Scene navigation
function showScene(index) {
  currentScene = Math.max(0, Math.min(index, scenes.length - 1));

  document.querySelectorAll(".scene").forEach((scene, i) => {
    scene.classList.toggle("active", i === currentScene);
  });

  pageNumber.textContent =
    `${String(currentScene + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;

  document.getElementById("backBtn").classList.toggle("hidden", currentScene === 0);

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (currentScene === 3) {
    revealNameAutomatically();
  }
}

function nextScene(index) {
  showScene(index);
}

// Birthday countdown
const birthday = new Date("2026-11-05T00:00:00+05:30").getTime();

function updateCountdown() {
  const distance = birthday - Date.now();

  if (distance <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => {
      document.getElementById(id).textContent = "00";
    });

    document.getElementById("countdownNote").textContent =
      "Your special day is here. Happy Birthday! ♡";

    document.getElementById("beginBtn").textContent =
      "Enter your birthday surprise ♡";

    return;
  }

  document.getElementById("days").textContent =
    String(Math.floor(distance / 86400000)).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Background music
async function startMusic() {
  try {
    await song.play();
    musicToggle.innerHTML = "♫ <span>Pause song</span>";
  } catch (error) {
    musicToggle.innerHTML = "♫ <span>Tap for our song</span>";
  }
}

window.addEventListener("load", () => {
  startMusic();
});

musicToggle.addEventListener("click", async () => {
  if (song.paused) {
    await startMusic();
  } else {
    song.pause();
    musicToggle.innerHTML = "♫ <span>Our song</span>";
  }
});

document.getElementById("beginBtn").addEventListener("click", async () => {
  await startMusic();
  nextScene(1);
});

document.getElementById("backBtn").addEventListener("click", () => {
  showScene(currentScene - 1);
});

// Birthday cake and candle interaction
let cakeDone = false;

function cakeClickHandler() {
  if (cakeDone) return;

  cakeDone = true;

  const button = document.getElementById("cakeMomentBtn");
  const message = document.getElementById("cakeMessage");

  button.disabled = true;
  button.textContent = "Make a beautiful wish… ♡";

  message.textContent =
    "I hope every beautiful wish finds its way to you. ♡";

  setTimeout(() => {
    document.getElementById("flameOne").classList.add("out");
    document.getElementById("flameTwo").classList.add("out");

    document.querySelector(".cake-stage").classList.add("cake-glitter");

    message.textContent = "Wish made. Let the magic find you… ✨";

    burstHearts();
  }, 950);

  setTimeout(() => {
    nextScene(2);
  }, 3400);
}

document.getElementById("cakeMomentBtn").addEventListener("click", cakeClickHandler);

// Sparkle animation
function burstHearts() {
  const symbols = ["✧", "✦", "♡", "✿", "✨", "❀", "♥"];

  for (let i = 0; i < 54; i++) {
    const spark = document.createElement("span");

    spark.className = "cake-spark";
    spark.textContent = symbols[i % symbols.length];

    spark.style.left = `${35 + Math.random() * 30}%`;
    spark.style.top = `${28 + Math.random() * 30}%`;

    spark.style.setProperty("--x", `${-260 + Math.random() * 520}px`);
    spark.style.setProperty("--y", `${-300 + Math.random() * 420}px`);

    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 2100);
  }
}

// Love letter
const letterMessage = `Happy Birthday, my favourite person. ♡

If you could see yourself through my eyes, even for a moment, I think you would understand why you mean so much to me.

You have a beautiful way of making ordinary moments feel special. Your smile, your little habits, and the person you are have found a very precious place in my heart.

Today, I hope life is gentle with you. I hope your dreams come closer, your worries feel lighter, and you always have reasons to smile. I hope you never forget how capable, special, and loved you are.

I may not have the perfect words for everything I feel, but I know this: I am so grateful that you are part of my life.

Happy Birthday, my love.

May this year bring you the happiness your heart deserves. ♡`;

const openEnvelope = document.getElementById("openEnvelope");
const typedLetter = document.getElementById("typedLetter");

let typedStarted = false;
let typingTimer = null;

// Envelope opens only when he clicks the seal
function openLetter() {
  if (typedStarted) return;

  typedStarted = true;

  openEnvelope.classList.add("opened");
  openEnvelope.disabled = true;

  setTimeout(() => {
    typedLetter.classList.remove("hidden");

    const target = document.getElementById("letterText");
    let i = 0;

    target.textContent = "";

    typingTimer = setInterval(() => {
      target.textContent = letterMessage.slice(0, i);
      i += 3;

      if (i >= letterMessage.length) {
        target.textContent = letterMessage;
        clearInterval(typingTimer);
      }
    }, 25);

  }, 850);
}

openEnvelope.addEventListener("click", openLetter);

// Continue from letter
document.getElementById("toNameBtn").addEventListener("click", () => {
  nextScene(3);
});

// Name gift boxes
const meanings = [
  ["R", "Radiant — your presence makes even an ordinary day feel warmer."],
  ["A", "Adored — I hope you always feel appreciated for the person you are."],
  ["J", "Joy — your happiness matters to me more than you know."],
  ["K", "Kind heart — one of the things I treasure most about you."],
  ["U", "Unforgettable — you have made memories that I hold close."],
  ["M", "My favourite — the person I want to tell all my little stories to."],
  ["A", "Always — I hope we keep choosing kindness and care for each other."],
  ["R", "Remember — you are worthy of love, peace, laughter, and beautiful things."]
];

const nameLetters = document.getElementById("nameLetters");
const openedLetters = new Set();

meanings.forEach(([letter, meaning], index) => {
  const button = document.createElement("button");

  button.className = "letter-tile gift-tile";

  button.innerHTML =
    '<span class="gift-bow">✧</span><span class="gift-ribbon"></span><span class="gift-question">?</span>';

  button.style.setProperty("--i", index);

  button.setAttribute(
    "aria-label",
    `Unwrap gift ${index + 1} to reveal a letter`
  );

  button.addEventListener("click", () => revealLetter(index));

  nameLetters.appendChild(button);
});

// Reveal each letter only when clicked
function revealLetter(index) {
  if (openedLetters.has(index)) return;

  const button = nameLetters.children[index];

  button.classList.add("opened");

  button.innerHTML =
    `<span class="revealed-letter">${meanings[index][0]}</span><span class="tiny-gift-spark">✧</span>`;

  button.setAttribute(
    "aria-label",
    `Revealed letter ${meanings[index][0]}`
  );

  openedLetters.add(index);

  document.getElementById("meaningText").textContent = meanings[index][1];

  if (openedLetters.size === meanings.length) {
    document.getElementById("assembledMessage").classList.remove("hidden");
    document.getElementById("toMemoriesBtn").classList.remove("hidden");
  }
}

// Instructions for the name scene
function revealNameAutomatically() {
  document.getElementById("meaningText").textContent =
    "Choose a little gift and unwrap the letters one by one. ♡";
}

// Continue buttons
document.getElementById("toMemoriesBtn").addEventListener("click", () => {
  nextScene(4);
});

document.getElementById("toFinalBtn").addEventListener("click", () => {
  nextScene(5);
});

// Restart the complete experience
document.getElementById("restartBtn").addEventListener("click", () => {

  cakeDone = false;

  document.querySelector(".cake-stage").classList.remove("cake-glitter");

  document.getElementById("flameOne").classList.remove("out");
  document.getElementById("flameTwo").classList.remove("out");

  document.getElementById("cakeMessage").textContent =
    "Twenty-two looks beautiful on you. Make a wish, my love…";

  const cakeButton = document.getElementById("cakeMomentBtn");

  cakeButton.disabled = false;
  cakeButton.textContent = "Blow the candles ♡";

  // Reset envelope
  openEnvelope.classList.remove("opened");
  openEnvelope.disabled = false;

  typedLetter.classList.add("hidden");
  typedStarted = false;

  if (typingTimer) {
    clearInterval(typingTimer);
  }

  document.getElementById("letterText").textContent = "";

  // Reset name gifts
  openedLetters.clear();

  document.querySelectorAll(".letter-tile").forEach((button, index) => {
    button.classList.remove("opened");

    button.innerHTML =
      '<span class="gift-bow">✧</span><span class="gift-ribbon"></span><span class="gift-question">?</span>';

    button.setAttribute(
      "aria-label",
      `Unwrap gift ${index + 1} to reveal a letter`
    );
  });

  document.getElementById("meaningText").textContent =
    "Choose a little gift and unwrap the letters one by one. ♡";

  document.getElementById("assembledMessage").classList.add("hidden");
  document.getElementById("toMemoriesBtn").classList.add("hidden");

  nextScene(0);
});

// Photo placeholders if an image is missing
document.querySelectorAll(".polaroid img").forEach(img => {

  img.addEventListener("error", () => {

    img.style.display = "none";

    const placeholder = document.createElement("div");

    placeholder.className = "photo-placeholder";
    placeholder.textContent = "your memory goes here ♡";

    placeholder.style.cssText =
      "height:clamp(100px,14vw,165px);display:grid;place-items:center;background:linear-gradient(145deg,#e7d2b2,#c5a087);color:#765444;font:italic 1rem 'Cormorant Garamond',serif;text-align:center;padding:8px;";

    img.parentNode.insertBefore(placeholder, img);

  });

});
