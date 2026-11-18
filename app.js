const openButton = document.getElementById('open');
const seal = document.getElementById('seal');
const replay = document.getElementById('replay');
const letter = document.getElementById('letter');
const hint = document.getElementById('hint');
let state = 'closed';
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const delay = ms => new Promise(resolve => setTimeout(resolve, reducedMotion() ? 0 : ms));
function waitForMotion(element, duration) {
  if (reducedMotion()) return Promise.resolve();
  return new Promise(resolve => {
    const finish = event => {
      if (event && (event.target !== element || event.propertyName !== 'transform')) return;
      clearTimeout(timeout);
      element.removeEventListener('transitionend', finish);
      resolve();
    };
    const timeout = setTimeout(finish, duration + 150);
    element.addEventListener('transitionend', finish);
  });
}
async function openInvitation() {
  if (state !== 'closed') return;
  state = 'opening';
  openButton.disabled = true;
  seal.disabled = true;
  document.body.classList.add('opened');
  letter.setAttribute('aria-hidden', 'false');
  hint.textContent = 'La invitación de Sarahí y Alan está abierta.';
  await delay(2850);
  state = 'open';
  replay.hidden = false;
  replay.focus({preventScroll:true});
}
async function closeInvitation() {
  if (state !== 'open') return;
  state = 'closing';
  replay.disabled = true;
  replay.textContent = 'Cerrando el sobre…';
  letter.setAttribute('aria-hidden', 'true');
  // Keep the flap open and the seal aside until the whole sheet is inside.
  document.body.classList.add('closing', 'closing-letter');
  await waitForMotion(letter, 900);
  document.body.classList.add('closing-flap');
  document.body.classList.remove('opened', 'closing-letter');
  await waitForMotion(document.querySelector('.flap'), 1000);
  // Return the candy only after the flap has finished closing.
  document.body.classList.add('resealing');
  document.body.classList.remove('closing-flap');
  await waitForMotion(seal, 1200);
  document.body.classList.remove('closing', 'resealing');
  replay.hidden = true;
  replay.disabled = false;
  replay.textContent = '↺  Cerrar el sobre';
  hint.textContent = 'Un dulce comienzo para nuestra historia';
  state = 'closed';
  openButton.disabled = false;
  seal.disabled = false;
  openButton.focus({preventScroll:true});
}
openButton.addEventListener('click', openInvitation);
seal.addEventListener('click', openInvitation);
replay.addEventListener('click', closeInvitation);
