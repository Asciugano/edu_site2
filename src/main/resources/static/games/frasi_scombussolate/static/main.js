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
  document.querySelector('#tempo').innerHTML = time + 's';
}, 1000);

const maxRound = 5;
let round = 1;
let punti = 0;

let soluzione = [];
let frase = [];

const frase_container = document.querySelector('#frase-container');
const risposta_container = document.querySelector('#risposta-container');

let draggedElement = null;

const shuffleFrase = async (frase) => {
  for (let i = 0; i < frase.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [frase[i], frase[j]] = [frase[j], frase[i]];
  }
}

let isShowedSolution = false;
const showSolution = () => {
  isShowedSolution = !isShowedSolution;

  document.querySelector('#solution').innerHTML = isShowedSolution ? soluzione.join('').replaceAll(',', '') : '';
}

const setupDragEvents = (div) => {
  div.addEventListener('dragstart', (e) => {
    draggedElement = div;
    e.dataTransfer.effectAllowed = 'move';
  });

  div.addEventListener('touchstart', (e) => {
    draggedElement = div;
    draggedElement.classList.add('dragging');
  });

  div.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (target && (target.id === 'frase-container' || target.id === 'risposta-container')) {
      target.appendChild(draggedElement);

      if (risposta_container.querySelectorAll('.item').length === frase.length) {
        document.querySelector('#check-solution-btn').classList.remove('hidden');
      }
    }

    draggedElement.classList.remove('dragging');
    draggedElement = null;
  });
};

const allowDropZone = (container) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedElement) {
      container.appendChild(draggedElement);
      if (risposta_container.querySelectorAll('.item').length === frase.length) {
        document.querySelector('#check-solution-btn').classList.remove('hidden');
      }
    }
  });
};

allowDropZone(frase_container);
allowDropZone(risposta_container);

const checkSolution = async () => {
  const user_input = risposta_container.querySelectorAll('.item');
  let err = false;
  user_input.forEach((item, i) => {
    if (item.textContent !== soluzione[i]) {
      err = true;
      alert('Sbagliato')
    }
  });
  if (!err) {
    alert('Giusto');
    punti++;
  }

  if (round < maxRound) {
    round++;
    main();
  }
  else {
    clearInterval(timerID);

    localStorage.setItem('punteggio', punti);
    localStorage.setItem('tempo', time);
    localStorage.setItem('max-round', maxRound);
    localStorage.setItem('path', './frasi_scombussolate/index.html');

    alert("Gioco finito");

    window.location.href = '../risultati.html';
  }
}

const main = async () => {
  frase_container.innerHTML = '';
  risposta_container.innerHTML = '';
  document.querySelector('#check-solution-btn').classList.add('hidden');

  document.querySelector('#solution').innerHTML = isShowedSolution ? soluzione.join('').replaceAll(',', '') : '';

  await fetch('./static/res/source.txt')
    .then(res => res.text())
    .then(data => {
      const righe = data
        .split('\n')
        .map(riga => riga.trim())
        .filter(riga => riga.length > 0);

      const riga_casuale = righe[Math.floor(Math.random() * righe.length)];

      frase = riga_casuale.split(',');
      soluzione = riga_casuale.split(',')
    });
  shuffleFrase(frase);

  frase.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('item');
    div.textContent = item;
    div.setAttribute('draggable', true);
    setupDragEvents(div);

    frase_container.appendChild(div);
  });
};

main();
