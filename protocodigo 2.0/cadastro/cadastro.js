import {User} from "../assets/js/User.js";
import {Repository} from "../assets/js/Repository.js";

const username = document.getElementById('username');//input de nome de usuário
const email = document.getElementById('email');//input de email
const password = document.getElementById('password'); //input de senha
const confirmPasswordInput = document.getElementById('confirmPassword');//input de confirmação de senha

const userIinfo = document.getElementById('userInfo');
const confirmPassword = document.getElementById('passwordSection');
const securityQuestion = document.getElementById('securityQuestionsSection');

const pergunta1 = document.getElementById('pergunta1');
const resposta1 = document.getElementById('resposta1');
const pergunta2 = document.getElementById('pergunta2');
const resposta2 = document.getElementById('resposta2');

const avanceBt = document.querySelectorAll('.avanceBt');
const returnBt = document.querySelectorAll(".returnBt");
const repository = new Repository();

let nameValue = '';
let emailValue = '';    
let passwordValue = '';
let securityQuestions = [];
let securityAnswers = [];

returnBt[0].addEventListener("click",()=>{
    confirmPassword.style.opacity = '0';
    setTimeout(() => {
        userIinfo.style.display = 'flex';
        confirmPassword.style.display = 'none';
        setTimeout(() => {
            userIinfo.style.opacity = '1';
        }, 100);
    }, 300);
});

returnBt[1].addEventListener("click",()=>{
    securityQuestion.style.opacity = '0';
    setTimeout(() => {
        confirmPassword.style.display = 'flex';
        securityQuestion.style.display = 'none';
        setTimeout(() => {
            confirmPassword.style.opacity = '1';
        }, 100);
    }, 300);
});

const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
avanceBt[0].addEventListener('click', () => {
    if(username.value === '' || email.value === '' ){
        alert('Por favor, preencha todos os campos.');
        return;
    }
    nameValue = username.value;
    emailValue = email.value;

    if (!padrao.test(emailValue)) {
        alert("email invalido!");
        return;
    }

   if (repository.existByName(nameValue)) {
        alert("Nome de usuário já cadastrado");
        return
   }

   if (repository.existisByEmail(emailValue)) {
        alert("Este email já está em uso!");
        return;
   }

    userIinfo.style.opacity = '0';
    setTimeout(() => {
        userIinfo.style.display = 'none';
        confirmPassword.style.display = 'flex';
        setTimeout(() => {
            confirmPassword.style.opacity = '1';
        }, 100);
    }, 300);

});  

avanceBt[1].addEventListener('click', () => {
    if(password.value === '' || confirmPasswordInput.value === ''){
        alert('Por favor, preencha todos os campos.');
        return;
    }
    if(password.value.length < 8){
        alert('A senha deve ter pelo menos 8 caracteres.');
        return;
    }
    if(password.value !== confirmPasswordInput.value){
        alert('As senhas não coincidem. Por favor, tente novamente.');
        return;
    }else{
        passwordValue = password.value;
    }
    
    confirmPassword.style.opacity = '0';
    setTimeout(() => {
        confirmPassword.style.display = 'none';
        securityQuestion.style.display = 'flex';
        setTimeout(() => {
            securityQuestion.style.opacity = '1';
        }, 100);
    }, 300);

});

avanceBt[2].addEventListener('click', () => {
    if(pergunta1.value === '' || resposta1.value === '' || pergunta2.value === '' || resposta2.value === ''){
        alert('Por favor, preencha todos os campos.');
        return;
    }else {
        securityQuestions.push(pergunta1.value);
        securityQuestions.push(pergunta2.value);
        securityAnswers.push(resposta1.value);
        securityAnswers.push(resposta2.value);
    
        const newUser = new User(nameValue, emailValue, passwordValue, securityQuestions, securityAnswers);
        alert("foi")
        repository.saveUser(newUser);
    
        alert('Usuário cadastrado com sucesso!');
        window.location.href = '../login/login.html';
    }

});

document.getElementById('logoImg').addEventListener('click', () => {
    window.location.href = '../index.html';
});