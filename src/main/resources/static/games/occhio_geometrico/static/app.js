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

const container = document.querySelector('.container')

const checkSolution = async (btn) => {
    if(round < maxRound) {
        main();
        round++;
    }
    else {
        clearInterval(timerID);

        localStorage.setItem('punteggio', punti);
        localStorage.setItem('tempo', time);
        localStorage.setItem('max-round', maxRound);
        localStorage.setItem('path', 'occhio_geometrico/index.html');

        alert('Gioco finito');

        window.location.href = '../risultati.html';
    }
}

const main = async () => {
    container.querySelectorAll('button').forEach(button => container.removeChild(button));
    for(let i = 0; i < 4; i++) {
        const button = document.createElement('button');

        const img = document.createElement('img');
        img.src = '#';

        button.appendChild(img);

        const p = document.createElement('p');
        p.textContent = i + 1;
        button.appendChild(p);

        button.onclick = () => checkSolution(button);

        container.appendChild(button);
    }
}

main();