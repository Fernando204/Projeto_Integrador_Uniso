export function initializeConfiguracoes() {
    const themeSelect = document.getElementById('themeSelect');
    if (!themeSelect) return;

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'auto';
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    });
}

export function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
    } else {
        // auto: remove attribute, let CSS media query decide
        root.removeAttribute('data-theme');
    }
}

export function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    applyTheme(savedTheme);
}
