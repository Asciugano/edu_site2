document.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', e => {
        alert(img.id + ' é stato cliccato');
    })
})