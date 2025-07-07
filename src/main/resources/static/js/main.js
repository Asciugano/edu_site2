let lightTheme = true;

document.querySelector('.title').addEventListener('click', () => {
  window.location.href = '/';
});

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
  btn.onclick = changeTheme;

  const icon = document.createElement('img')
  icon.src = lightTheme ? '/icon/light.png' : '/icon/light.png';

  btn.appendChild(icon)

  menu.appendChild(label);
  menu.appendChild(btn);

  document.body.appendChild(menu);
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
}

window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme') || 'theme-light';
  changeTheme(theme);
});
