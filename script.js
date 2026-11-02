const scenes = ["scene-countdown", "scene-cake", "scene-letter", "scene-name", "scene-memories", "scene-final"];
let currentScene = 0;
const pageNumber = document.getElementById("pageNumber");
const song = document.getElementById("loveSong");
const musicToggle = document.getElementById("musicToggle");

function showScene(index) {
  currentScene = Math.max(0, Math.min(index, scenes.length - 1));
  document.querySelectorAll(".scene").forEach((scene, i) => {
    scene.classList.toggle("active", i === currentScene);
  });
  pageNumber.textContent = `${String(currentScene + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function nextScene(index) { showScene(index); }

const birthday = new Date("2026-11-05T00:00:00+05:30").getTime();
function updateCountdown() {
  const now = Date.now();
  const distance = birthday - now;
  if (distance <= 0) {
    ["days","hours","minutes","seconds"].forEach(id => document.getElementById(id).textContent = "00");
    document.getElementById("countdownNote").textContent = "Your special day is here. Happy Birthday, Amore! ♡";
    document.getElementById("beginBtn").textContent = "Your birthday surprise is ready ♡";
    return;
  }
  document.getElementById("days").textContent = String(Math.floor(distance / 86400000)).padStart(2,"0");
  document.getElementById("hours").textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2,"0");
  document.getElementById("minutes").textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2,"0");
  document.getElementById("seconds").textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

musicToggle.addEventListener("click", async () => {
  if (song.paused) {
    try { await song.play(); musicToggle.innerHTML = "♫ <span>Pause song</span>"; }
    catch (e) { alert("Add your song file to the audio folder and name it your-song.mp3, then try again."); }
  } else {
    song.pause(); musicToggle.innerHTML = "♫ <span>Our song</span>";
  }
});
document.getElementById("beginBtn").addEventListener("click", () => nextScene(1));

const flame = document.getElementById("flame");
const blowBtn = document.getElementById("blowBtn");
const cutBtn = document.getElementById("cutBtn");
let candleOut = false;
blowBtn.addEventListener("click", () => {
  if (candleOut) return;
  flame.classList.add("out");
  candleOut = true;
  blowBtn.textContent = "Wish made ♡";
  document.getElementById("cakeMessage").textContent = "Wish made! I hope this year brings you every beautiful thing.";
  cutBtn.disabled = false;
});
cutBtn.addEventListener("click", () => {
  document.getElementById("cakeMessage").textContent = "A sweet little beginning… now open something from my heart.";
  cutBtn.textContent = "Cake cut! Continue →";
  setTimeout(() => nextScene(2), 650);
});

const letterMessage = `Happy Birthday, my favourite person. ♡

If you could see yourself through my eyes, even for a moment, I think you would understand why you mean so much to me.

You have a beautiful way of making ordinary moments feel special. Your smile, your little habits, and the person you are have found a very precious place in my heart.

Today, I hope life is gentle with you. I hope your dreams come closer, your worries feel lighter, and you always have reasons to smile. I hope you never forget how capable, special, and loved you are.

I may not have the perfect words for everything I feel, but I know this: I am so grateful that you are part of my life.

Happy Birthday, Rajkumar. My Bishnoi. My Amore.

May this year bring you the happiness your heart deserves. ♡`;
const openEnvelope = document.getElementById("openEnvelope");
const typedLetter = document.getElementById("typedLetter");
let typedStarted = false;
openEnvelope.addEventListener("click", () => {
  if (typedStarted) return;
  typedStarted = true;
  openEnvelope.classList.add("opened");
  setTimeout(() => {
    typedLetter.classList.remove("hidden");
    const target = document.getElementById("letterText");
    let i = 0;
    target.textContent = "";
    const timer = setInterval(() => {
      target.textContent = letterMessage.slice(0, i);
      i += 3;
      if (i >= letterMessage.length) {
        target.textContent = letterMessage;
        clearInterval(timer);
      }
    }, 18);
  }, 700);
});
document.getElementById("toNameBtn").addEventListener("click", () => nextScene(3));

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
  button.className = "letter-tile";
  button.textContent = letter;
  button.setAttribute("aria-label", `Reveal the meaning of letter ${letter}`);
  button.addEventListener("click", () => {
    button.classList.add("opened");
    openedLetters.add(index);
    document.getElementById("meaningText").textContent = meaning;
    if (openedLetters.size === meanings.length) {
      document.getElementById("assembledMessage").classList.remove("hidden");
      document.getElementById("toMemoriesBtn").classList.remove("hidden");
    }
  });
  nameLetters.appendChild(button);
});
document.getElementById("toMemoriesBtn").addEventListener("click", () => nextScene(4));
document.getElementById("toFinalBtn").addEventListener("click", () => nextScene(5));
document.getElementById("restartBtn").addEventListener("click", () => {
  flame.classList.remove("out"); candleOut = false; blowBtn.textContent = "Blow out candle ✧"; cutBtn.disabled = true; cutBtn.textContent = "Cut the cake →";
  openEnvelope.classList.remove("opened"); typedLetter.classList.add("hidden"); typedStarted = false;
  openedLetters.clear(); document.querySelectorAll(".letter-tile").forEach(b => b.classList.remove("opened"));
  document.getElementById("assembledMessage").classList.add("hidden"); document.getElementById("toMemoriesBtn").classList.add("hidden");
  nextScene(0);
});

// Missing photo placeholders remain decorative and explain how to replace them.
document.querySelectorAll(".polaroid img").forEach(img => {
  img.addEventListener("error", () => {
    img.style.display = "none";
    const placeholder = document.createElement("div");
    placeholder.className = "photo-placeholder";
    placeholder.textContent = "Add your photo";
    placeholder.style.cssText = "height:clamp(100px,14vw,165px);display:grid;place-items:center;background:linear-gradient(145deg,#e7d2b2,#c5a087);color:#765444;font:italic 1rem 'Cormorant Garamond',serif;text-align:center;padding:8px;";
    img.parentNode.insertBefore(placeholder, img);
  });
});
