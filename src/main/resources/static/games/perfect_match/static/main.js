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
const maxRound = 3;

alert('test')
