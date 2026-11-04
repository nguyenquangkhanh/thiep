const name = new URLSearchParams(window.location.search).get('name');
const guest = name?.replace(/\s+/gu, ' ').trim();
if (guest) {
  const displayName = Array.from(guest).slice(0, 80).join('');
  for (const label of document.querySelectorAll('.recipient')) {
    label.textContent = displayName;
    label.classList.toggle('compact', displayName.length > 28);
  }
}

const music = document.querySelector('#nhac-nen');
const musicButton = document.querySelector('.music');
musicButton.hidden = false;

function playMusic() {
  music.play().catch(() => {
    // Keep manual playback available if the browser declines playback.
    musicButton.setAttribute('aria-pressed', 'false');
  });
}

const openButton = document.querySelector('.open');
const welcome = document.querySelector('.welcome');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const skipOpening = document.querySelector('.skip-opening');
let openingTimer;

function enterInvitation() {
  window.clearTimeout(openingTimer);
  welcome.classList.remove('opening');
  skipOpening.hidden = true;
  history.replaceState(null, '', '#thiep');
  const card = document.querySelector('#thiep');
  card.focus({preventScroll: true});
  card.scrollIntoView();
}

openButton.addEventListener('click', event => {
  event.preventDefault();
  if (welcome.classList.contains('opening')) return;
  if (music.paused) playMusic();
  if (reducedMotion.matches) {
    enterInvitation();
    return;
  }

  welcome.classList.add('opening');
  skipOpening.hidden = false;
  openingTimer = window.setTimeout(enterInvitation, 3200);
});
skipOpening.addEventListener('click', enterInvitation);
musicButton.addEventListener('click', () => {
  if (music.paused) {
    playMusic();
  } else {
    music.pause();
  }
});
music.addEventListener('play', () => musicButton.setAttribute('aria-pressed', 'true'));
music.addEventListener('pause', () => musicButton.setAttribute('aria-pressed', 'false'));

const mapPicker = document.querySelector('.map-picker');
const places = document.querySelector('.places');
function showPlace() {
  const selected = mapPicker.querySelector('input:checked').value;
  for (const place of places.children) {
    place.hidden = place.id !== selected;
  }
}
mapPicker.hidden = false;
places.classList.add('filtered');
mapPicker.addEventListener('change', showPlace);
showPlace();

const starlight = document.querySelector('.starlight');
const stars = document.createDocumentFragment();
for (let index = 0; index < 24; index += 1) {
  const star = document.createElement('i');
  star.style.setProperty('--x', ((index * 37 + 5) % 97) + '%');
  star.style.setProperty('--y', ((index * 61 + 9) % 97) + '%');
  star.style.setProperty('--size', (index % 3 + 1) + 'px');
  star.style.setProperty('--period', (3 + index % 5) + 's');
  star.style.setProperty('--delay', (-index % 7) + 's');
  stars.append(star);
}
starlight.append(stars);

const countdown = document.querySelector('.countdown');
const eventTime = Date.parse(document.querySelector('.quick-info time').dateTime);
const clockDigits = Object.fromEntries(
  [...countdown.querySelectorAll('[data-clock]')].map(digit => [digit.dataset.clock, digit])
);

function updateCountdown() {
  const remaining = Math.max(0, Math.ceil((eventTime - Date.now()) / 1000));
  countdown.hidden = remaining === 0;
  if (remaining === 0) return;
  const values = {
    days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining / 3600) % 24,
    minutes: Math.floor(remaining / 60) % 60,
    seconds: remaining % 60
  };
  for (const [unit, value] of Object.entries(values)) {
    clockDigits[unit].textContent = String(value).padStart(2, '0');
  }
  window.setTimeout(updateCountdown, 1000);
}
updateCountdown();

const printViewer = document.querySelector('.print-view');
for (const link of document.querySelectorAll('#mat-thiep a, .vocation-gallery a')) {
  link.addEventListener('click', event => {
    if (!printViewer.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const image = printViewer.querySelector('img');
    image.src = link.href;
    image.alt = link.querySelector('img')?.alt ?? link.textContent.trim();
    printViewer.showModal();
  });
}

const greetingBox = document.querySelector('#greeting-box');
const greeting = document.querySelector('#greeting');
const greetingStatus = document.querySelector('#greeting-status');
const whatsappContact = document.querySelector('#whatsapp-contact');
const emailContact = document.querySelector('#email-contact');

function updateGreetingLinks() {
  const message = encodeURIComponent(greeting.value.trim());
  whatsappContact.href = 'https://wa.me/84966517531?text=' + message;
  emailContact.href = 'mailto:hier.nguyenkhanh@gmail.com?subject='
    + encodeURIComponent('Lời chúc mừng Tân Linh mục') + '&body=' + message;
}

greeting.value = (guest ? 'Tôi là ' + Array.from(guest).slice(0, 80).join('') + '. ' : '')
  + 'Xin gửi lời chúc mừng Tân Linh mục Giêrônimô Nguyễn Quang Khánh. '
  + 'Nguyện xin Chúa ban cho cha luôn tràn đầy bình an và niềm vui trong sứ vụ.';
greetingBox.hidden = false;
updateGreetingLinks();
greeting.addEventListener('input', () => {
  updateGreetingLinks();
  greetingStatus.textContent = '';
});
document.querySelector('#copy-greeting').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(greeting.value);
    greetingStatus.textContent = 'Đã sao chép. Anh chị có thể dán lời chúc vào Zalo hoặc Messenger.';
  } catch {
    greeting.focus();
    greeting.select();
    greetingStatus.textContent = 'Hãy sao chép phần văn bản đã được chọn.';
  }
});
