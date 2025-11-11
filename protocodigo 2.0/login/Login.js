import { Repository } from "../assets/js/Repository.js";

const loginButton = document.querySelector('.login-container button');
const emailInput = document.getElementById('userEmail');
const passwordInput = document.getElementById('password');

const repository = new Repository();

loginButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        const authenticated = repository.autenticateUser(email, password);
        if (authenticated) {
            alert('Login bem-sucedido!');
            window.location.href = '../dashboard/dashboard.html'; 
        } else {
            alert('Senha incorreta. Tente novamente.');
        }
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('showPassword').addEventListener('input', togglePasswordVisibility);

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('showPassword');
    if (showPasswordCheckbox.checked) {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

document.getElementById('logoImg').addEventListener('click', () => {
    window.location.href = '../index.html';
});