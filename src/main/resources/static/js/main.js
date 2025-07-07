let lightTheme = true;

document.querySelector('.title').addEventListener('click', () => {
  window.location.href = '/';
});

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

function openSettings() {
  const existingMenu = document.querySelector('#settings-menu');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  const menu = document.createElement('div');
  menu.classList.add('settings-menu');
  menu.id = 'settings-menu';

  const label = document.createElement('label');
  label.textContent = 'Tema: ';

  const btn = document.createElement('button');
  btn.classList.add('theme-btn');
  btn.onclick = () => changeTheme();

  const icon = document.createElement('img')
  icon.src = lightTheme ? '/icon/dark.png' : '/icon/light.png';

  btn.appendChild(icon)

  menu.appendChild(label);
  menu.appendChild(btn);

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
