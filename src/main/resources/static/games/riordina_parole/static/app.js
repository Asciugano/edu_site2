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

let punteggio = 0;
let round = 1;
const maxRound = 10;

let parola;
let draggedElement = null;

const parolaContainer = document.querySelector('#parola_container');
const rispostaContainer = document.querySelector('#risposta_container');

let isSolutionShowed = false;

const shuffleWord = (parola) => {
  const arr = parola.split('');
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.join('');
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

    if (target && (target.id === 'parola_container' || target.id === 'risposta_container')) {
      target.appendChild(draggedElement);

      if (rispostaContainer.querySelectorAll('.item').length === parola.length) {
        document.querySelector('#check_solution_btn').classList.remove('hidden');
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
      if (rispostaContainer.querySelectorAll('.item').length === parola.length) {
        document.querySelector('#check_solution_btn').classList.remove('hidden');
      }
    }
  });
};

allowDropZone(parolaContainer);
allowDropZone(rispostaContainer);

async function reader() {
  return fetch('static/res/source.txt')
    .then(res => res.text())
    .then(data => {
      const righe = data
        .split('\n')
        .map(riga => riga.trim())
        .filter(riga => riga.length > 0);

      const riga_casuale = righe[Math.floor(Math.random() * righe.length)];

      const [parola_letta, img] = riga_casuale.split(',');

      document.querySelector('#img').src = img;

      return parola_letta;
    })
}

async function main() {

  localStorage.setItem('audio', '../audios/riordina_parole.wav')
  parola = await reader();

  let showParola = shuffleWord(parola)

  if (isSolutionShowed)
    document.querySelector('#solution').innerHTML = parola;

  parolaContainer.innerHTML = '';
  rispostaContainer.innerHTML = '';
  document.querySelector('#check_solution_btn').classList.add('hidden');

  for (let chr of showParola) {
    const div = document.createElement('div');
    div.classList.add('item');
    div.textContent = chr;
    div.setAttribute('draggable', true);
    setupDragEvents(div);
    parolaContainer.appendChild(div);
  }
}

main()

const checkSolution = async () => {
  const chrs = rispostaContainer.querySelectorAll('.item');
  let parolaUtente = '';

  chrs.forEach(lettera => {
    parolaUtente += lettera.textContent;
  });

  if (parolaUtente === parola) {
    await alert("Bravo!!!\nLa parola è GIUSTA!!!");
    punteggio++;
  } else {
    await alert("Per poco!\nLa parola non è giusta.");
  }

  if (round < maxRound) {
    round++;
    main();
  } else {
    clearInterval(timerID);

    localStorage.setItem('punteggio', punteggio);
    localStorage.setItem('tempo', time);
    localStorage.setItem('max-round', maxRound);
    localStorage.setItem('path', './riordina_parole/index.html');

    await alert("Gioco finito");

    window.location.href = '../risultati.html';
  }
};

const showSolution = () => {
  isSolutionShowed = !isSolutionShowed;
  document.querySelector('#solution').innerHTML = isSolutionShowed ? parola : '';
}

document.addEventListener('keydown', (e) => {
  if (alertOpen) return;

  const keyPress = e.key.toLowerCase();

  if (e.key === 'Enter') {
    if (rispostaContainer.querySelectorAll('.item').length === parola.length)
      checkSolution();

    return;
  }

  if (e.key === 'Backspace') {
    const lettereInserite = rispostaContainer.querySelectorAll('.item');
    const ultimaLettera = lettereInserite[lettereInserite.length - 1];
    if (ultimaLettera) {
      parolaContainer.appendChild(ultimaLettera);

      if (!document.querySelector('#check_solution_btn').classList.contains('hidden')) {
        document.querySelector('#check_solution_btn').classList.add('hidden');
      }
    }

    e.preventDefault();
  }

  if (!/^[a-z]$/.test(keyPress)) return;

  const possibleKeys = Array.from(parolaContainer.querySelectorAll('.item'));

  const divToMove = possibleKeys.find(div => div.textContent.toLowerCase() === keyPress);

  if (divToMove) {
    rispostaContainer.appendChild(divToMove);

    if (rispostaContainer.querySelectorAll('.item').length === parola.length) {
      document.querySelector('#check_solution_btn').classList.remove('hidden');
    }
  }
})
