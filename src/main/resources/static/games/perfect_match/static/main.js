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

const img_container = document.querySelector('#img-container');
const parole_container = document.querySelector('#parole-container');

let parole = [];
let soluzione = '';

function checkSolution(parola) {
  tentativi++;
  if (parola.textContent === soluzione) {
    alert('Corretto');
    punti++;
    parole_container.querySelectorAll('p').forEach(item => {
      if (item === parola) {
        parole_container.removeChild(item);
      }
    });
  }
  else {
    alert('Sbagliato');
  }

  if (round < maxRound) {
    round++;
    main();
  }
  else {
    clearInterval(timerID);

    localStorage.setItem('punteggio', punti);
    localStorage.setItem('tempo', time);
    localStorage.setItem('max-round', tentativi);
    localStorage.setItem('path', './perfect_match/index.html');

    alert("Gioco finito");

    window.location.href = '../risultati.html';
  }
}

async function main() {
  img_container.querySelectorAll('img').forEach(item => img_container.removeChild(item));

  const getParole = async () => {
    await fetch('./static/res/parole.txt')
      .then(res => res.text())
      .then(data => {
        parole = data
          .split('\n')
          .map(parola => parola.trim())
          .filter(parola => parola.length > 0);
      });

    parole.forEach(parola => {
      const p = document.createElement('p');
      p.textContent = parola;
      p.addEventListener('click', () => checkSolution(p));

      parole_container.appendChild(p);
    });
  };

  if (parole.length <= 0) {
    getParole();
    maxRound = parole.length;
  }

  await fetch('./static/res/source.txt')
    .then(res => res.text())
    .then((data) => {
      const righe = data
        .split('\n')
        .map(riga => riga.trim())
        .filter(riga => riga.length > 0);

      const riga_casuale = righe[Math.floor(Math.random() * righe.length)];
      const [imgSrc, parola] = riga_casuale.split(',');
      soluzione = parola;
    });

  const img = document.createElement('img');
  img.src = imgSrc;
  img_container.appendChild(img);
}
