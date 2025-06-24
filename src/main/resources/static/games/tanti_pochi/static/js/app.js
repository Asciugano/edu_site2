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

const checkSolution = async (img) => {
    if(img.src === immagine_giusta) {
        await alert('Corretto');
        punteggio++;
    }
    else {
        await alert('Sbagliato');
    }

    if(round < maxRound) {
        round++;
        main();
    }
    else {
        clearInterval(timerID);

        localStorage.setItem('punteggio', punteggio);
        localStorage.setItem('tempo', time);
        localStorage.setItem('max-round', maxRound);

        await alert('Gioco finito');

        window.location.href = '../risultati.html';
    }
}

document.addEventListener('keydown', async (e) => {
    if(alertOpen) return;

    if(e.key === 'ArrowLeft') {
        await checkSolution(document.querySelector('#img1'));
    }
    if(e.key === 'ArrowRight') {
        await checkSolution(document.querySelector('#img2'));
    }
})

document.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', async e => {
        await checkSolution(img);
    })
});

let time = 0;
let timerID = setInterval(() => {
    time++;
    document.querySelector('#tempo').innerHTML = time + 's';
}, 1000);


const maxRound = 10;
let round = 1;
let punteggio = 0;

let immagine_giusta = null;

function main() {
    fetch('./static/res/source.txt')
        .then(res => res.text())
        .then(data => {
            const righe = data
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            const riga_casuale = righe[Math.floor(Math.random() * righe.length)];

            const [imgPochi, imgTanti, parola, finale] = riga_casuale.split(',');


            let tanti_pochi = Math.random() < 0.5 ? 'poch' : 'tant';
            tanti_pochi += finale + ' ';

            immagine_giusta = tanti_pochi === 'poche ' ? imgPochi : imgTanti;

            document.querySelector('#img1').src = Math.random() < 0.5 ? imgTanti : imgPochi;
            if(document.querySelector('#img1').src === imgTanti) {
                document.querySelector('#img2').src = imgPochi;
            }
            else {
                document.querySelector('#img2').src = imgTanti;
            }

            document.querySelector('#stringa').innerHTML = tanti_pochi + parola;
        });
}

main();