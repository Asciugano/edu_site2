let lightTheme = true;

function outsideClickListener(e) {
  const menu = document.querySelector('#settings-menu');
  const settingBtn = document.querySelector('.settings-btn');

  if (!menu) {
    document.removeEventListener('click', outsideClickListener);
    return;
  }
  if ((menu && menu.contains(e.target)) || (settingBtn && settingBtn.contains(e.target))) return;

  menu.remove();
  document.removeEventListener('click', outsideClickListener);
}

let audio_on = false;
let last_audio = localStorage.getItem('audio');
let audio = new Audio(localStorage.getItem('audio'));

function playAudio() {
  if (localStorage.getItem('audio') !== last_audio) {
    audio = new Audio(localStorage.getItem('audio'));
    last_audio = localStorage.getItem('audio');
  }
  audio_on = !audio_on;
  if (audio_on) {
    audio.play();
  }
  else {
    audio.pause();
    audio.currentTime = 0;
  }
}

function openSettings() {
  const existingMenu = document.querySelector('#settings-menu');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  const menu = document.createElement('div');
  menu.classList.add('settings-menu');
  menu.id = 'settings-menu';

  const label_theme = document.createElement('label');
  label_theme.textContent = 'Tema: ';

  const label_audio = document.createElement('label');
  label_audio.textContent = 'Audio: ';

  const btn_theme = document.createElement('button');
  btn_theme.classList.add('menu-btn');
  btn_theme.onclick = () => changeTheme();

  const btn_audio = document.createElement('button');
  btn_audio.classList.add('menu-btn')
  btn_audio.onclick = () => playAudio();

  const audio_icon = document.createElement('img');
  audio_icon.src = '../../icon/speaker.png';

  const theme_icon = document.createElement('img')
  theme_icon.src = lightTheme ? '../../icon/dark.png' : '../../icon/light.png';

  btn_theme.appendChild(theme_icon);
  btn_audio.appendChild(audio_icon);

  menu.appendChild(label_theme);
  menu.appendChild(btn_theme);
  menu.appendChild(label_audio);
  menu.appendChild(btn_audio);

  document.body.appendChild(menu);

  setTimeout(() => {
    document.addEventListener('click', outsideClickListener)
  }, 0);
}

function changeTheme(theme = null) {
  document.body.classList.remove('theme-light', 'theme-dark');

  if (!theme) {
    lightTheme = !lightTheme;
    document.body.classList.add(lightTheme ? 'theme-light' : 'theme-dark');

    localStorage.setItem('theme', lightTheme ? 'theme-light' : 'theme-dark');
  }
  else {
    lightTheme = theme === 'theme-light';
    document.body.classList.add(theme);

    localStorage.setItem('theme', theme);
  }

  const settigsMenu = document.querySelector('#settings-menu');
  if (settigsMenu) {
    const icon = settigsMenu.querySelector('img');
    if (icon) {
      icon.src = lightTheme ? '/icon/dark.png' : '/icon/light.png';
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme') || 'theme-light';
  changeTheme(theme);
});
