// darkMode.js - Sistema de modo oscuro
class DarkModeManager {
  constructor() {
    this.isDark = this.getStoredTheme();
    this.init();
  }

  init() {
    // Aplicar tema inicial
    this.applyTheme();
    // Crear botón toggle
    this.createToggleButton();
    // Listener para cambios del sistema
    this.watchSystemTheme();
  }

  getStoredTheme() {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    // Si no hay preferencia guardada, usar la del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  applyTheme() {
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', this.isDark.toString());
  }

  toggle() {
    this.isDark = !this.isDark;
    this.applyTheme();
  }

  createToggleButton() {
    // Buscar el header donde agregar el botón
    const header = document.querySelector('header .flex');
    if (!header) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = `
      <i class="fas fa-moon dark:hidden"></i>
      <i class="fas fa-sun hidden dark:block"></i>
    `;
    toggleBtn.className = 'ml-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200';
    toggleBtn.onclick = () => this.toggle();

    header.appendChild(toggleBtn);
  }

  watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
          this.isDark = e.matches;
          this.applyTheme();
        }
      });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new DarkModeManager();
});