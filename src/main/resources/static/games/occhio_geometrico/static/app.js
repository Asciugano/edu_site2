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

const checkSolution = async (risposta) => {
    if(risposta === soluzione) {
        punti++;
        await alert('Corretto');
    }
    else {
        await alert('Sbagliato');
    }
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

let soluzione = null;

const main = async () => {
    container.querySelectorAll('button').forEach(button => container.removeChild(button));

    const res = await fetch('static/res/source.txt');
    const data = await res.text();

    const righe = data
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const rigaCasuale = righe[Math.floor(Math.random() * righe.length)];
    const [img, img_domanda, risposta] = rigaCasuale.split(',');

    document.querySelector('#img').src = img;
    let btn_img = img_domanda;
    soluzione = risposta.trim();
    const solInt = parseInt(soluzione);

    const posizione_corretta = Math.floor(Math.random() * 4);

    let numeri_possibili = [];
    let moltiplicatore = soluzione < 2 ? 4 : soluzione >= 4 ? 1 : 2;
    for (let i = 1; i <= solInt * moltiplicatore; i++) {
        if (i !== solInt) numeri_possibili.push(i);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffle(numeri_possibili);


    for (let i = 0; i < 4; i++) {
        const button = document.createElement('button');

        const img = document.createElement('img');
        img.src = btn_img;
        img.style.height = '50px';
        img.style.width = '50px';

        button.appendChild(img);

        const p = document.createElement('p');
        if (i === posizione_corretta) {
            p.textContent = soluzione;
        } else {
            p.textContent = numeri_possibili.pop().toString();
        }
        button.appendChild(p);

        button.onclick = () => checkSolution(button.querySelector('p').textContent);

        container.appendChild(button);
    }
};


main();