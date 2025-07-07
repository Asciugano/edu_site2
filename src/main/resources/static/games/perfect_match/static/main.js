let alertOpen = false;

window.alert = (msg, timeout = 2000) => {
  return new Promise((resolve) => {
    alertOpen = true;

    const alertOverlay = document.createElement('div');
    const alertBox = document.createElement('div');
    const alertText = document.createElement('span');
    const alertButton = document.createElement('button');

    alertOverlay.classList.add('alert');

    alertText.textContent = msg;
    alertButton.textContent = 'OK';

    let closed = false;

    const closeAlert = () => {
      if (closed) return;
      closed = true;
      alertOverlay.remove();
      alertOpen = false;
      resolve();
      document.removeEventListener('keydown', keyHandler);
    };

    const keyHandler = (e) => {
      if (e.key === 'Enter') closeAlert();
    };

    alertButton.addEventListener('click', closeAlert);
    document.addEventListener('keydown', keyHandler);

    alertBox.appendChild(alertText);
    alertBox.appendChild(alertButton);
    alertOverlay.appendChild(alertBox);
    document.body.appendChild(alertOverlay);

    if (timeout) {
      setTimeout(closeAlert, Number(timeout));
    }
  });
};

let time = 0;
let timerID = setInterval(() => {
  time++;
  document.getElementById('tempo').innerHTML = time + 's';
}, 1000);

let punti = 0;
let round = 1;
let tentativi = 0;
const maxRound = 10;

const img_container = document.querySelector('#img-container');
const parole_container = document.querySelector('#parole-container');

let coppie = [];
let paroleMostrate = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getSolution() {
  return coppie[punti]?.parola || '';
}

function checkSolution(parolaElem) {
  tentativi++;
  const parola = parolaElem.textContent;

  if (parola === getSolution()) {
    alert('Corretto');
    punti++;
    parole_container.removeChild(parolaElem);
  } else {
    alert('Sbagliato');
  }

  if (round < maxRound) {
    round++;
    main();
  } else {
    clearInterval(timerID);
    localStorage.setItem('punteggio', punti);
    localStorage.setItem('tempo', time);
    localStorage.setItem('max-round', tentativi);
    localStorage.setItem('path', './perfect_match/index.html');
    alert('Gioco finito');
    window.location.href = '../risultati.html';
  }
}

async function loadCoppie() {
  const data = await fetch('./static/res/source.txt').then(res => res.text());
  const righe = data
    .split('\n')
    .map(r => r.trim())
    .filter(r => r.length > 0);

  const scelte = new Set();
  while (scelte.size < maxRound) {
    const riga = righe[Math.floor(Math.random() * righe.length)];
    scelte.add(riga);
  }

  coppie = Array.from(scelte).map(r => {
    const [img, parola] = r.split(',');
    return { img, parola };
  });

  shuffle(coppie);
  paroleMostrate = shuffle(coppie.map(c => c.parola));
}

async function main() {
  localStorage.setItem('audio', '../audios/perfect_match.wav')
  img_container.innerHTML = '';
  parole_container.innerHTML = '';

  if (coppie.length === 0) {
    await loadCoppie();
  }

  const img = document.createElement('img');
  img.src = coppie[punti].img;
  img_container.appendChild(img);

  paroleMostrate.forEach(parola => {
    const p = document.createElement('p');
    p.textContent = parola;
    p.classList.add('item');
    p.addEventListener('click', () => checkSolution(p));
    parole_container.appendChild(p);
  });
}

main();
