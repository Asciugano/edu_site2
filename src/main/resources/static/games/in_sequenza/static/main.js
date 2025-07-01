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

const maxRound = 3;
let round = 1;
let punti = 0;

let imgs = [];
let soluzione = [];

const shuffleImgs = (imgs) => {
  for (let i = 0; i < imgs.length; i++) {
    const j = Math.floor(Math.random() * imgs.length);

    [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
  }

  return imgs;
}

let draggedElement = null;

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

    if (target && (target.id === 'img-container' || target.id === 'soluzione-container')) {
      target.appendChild(draggedElement);

      if (rispostaContainer.querySelectorAll('div').length === soluzione.length) {
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
      if (rispostaContainer.querySelectorAll('div').length === soluzione.length) {
        document.querySelector('#check-solution-btn').classList.remove('hidden');
      }
    }
  });
};

const soluzione_container = document.querySelector('#soluzione-container');
const imgs_container = document.querySelector('#img-container');

allowDropZone(soluzione_container);
allowDropZone(imgs_container);

const check_solution = () => {
  alert('solutione: ' + soluzione);

  if (round < maxRound) {
    round++;
    main();
  }
  else {
    clearInterval(timerID);

    localStorage.setItem('punteggio', punti);
    localStorage.setItem('tempo', time);
    localStorage.setItem('max-round', maxRound);
    localStorage.setItem('path', 'in_sequenza/index.html');

    alert('Gioco finito');

    window.location.href = '../risultati.html';
  }
}

const main = async () => {

  imgs_container.querySelectorAll('div').forEach(item => document.removeChild(item));
  soluzione_container.querySelectorAll('div').forEach(item => document.removeChild(item));

  await fetch('./static/res/source.txt')
    .then(res => res.text())
    .then((data) => {
      const righe = data
        .split('\n')
        .map(riga => riga.trim())
        .filter(riga => riga.length > 0);

      const riga_casuale = righe[Math.floor(Math.random() * righe.length)];
      const [img1, img2, img3, parola] = riga_casuale.split(',');

      soluzione = [img1, img2, img3];

      document.querySelector('h2').textContent = parola;
    });

  imgs = shuffleImgs([...soluzione]);
  imgs.forEach(item => {
    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    setupDragEvents(div);

    const img = document.createElement('img');
    img.src = item;
    img.alt = document.querySelector('h2').textContent;

    div.appendChild(img)

    imgs_container.appendChild(div);
  });
}

main();
