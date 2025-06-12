let time = 0;
setInterval(() => {
    time++;
    document.getElementById('tempo').innerHTML = time + 's';
}, 1000);

let punteggio = 0;
let round = 1;
const maxRound = 3;

const parola = 'test';
let draggedElement = null;

const parolaContainer = document.querySelector('#parola_container');
const rispostaContainer = document.querySelector('#risposta_container');

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
};

const allowDropZone = (container) => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        if(draggedElement){
            container.appendChild(draggedElement);
            if(rispostaContainer.querySelectorAll('.lettera').length === parola.length) {
                document.querySelector('#check_solution_btn').classList.remove('hidden');
            }
        }
    });
};

allowDropZone(parolaContainer);
allowDropZone(rispostaContainer);

function main() {
    let showParola = shuffleWord(parola)

    parolaContainer.innerHTML = '';
    rispostaContainer.innerHTML = '';
    document.querySelector('#check_solution_btn').classList.add('hidden');

    for(let chr of showParola) {
        const div = document.createElement('div');
        div.classList.add('lettera');
        div.textContent = chr;
        div.setAttribute('draggable', true);
        setupDragEvents(div);
        parolaContainer.appendChild(div);
    }
}

main();

const checkSolution = () => {
    const chrs = rispostaContainer.querySelectorAll('.lettera');
    let parolaUtente = '';

    chrs.forEach(lettera => {
        parolaUtente += lettera.textContent;
    });

    if(parolaUtente === parola) {
        alert("Bravo!!!\nLa parola è GIUSTA!!!");
        punteggio++;
    } else {
        alert("Per poco!\nLa parola non è giusta.");
    }

    if(round < maxRound) {
        round++;
        main();
    } else {
        alert('Gioco finito');
        //TODO: aggiungere la schermata finale
    }
};