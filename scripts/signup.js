// ES6 Modules or TypeScript
// import Swal from 'sweetalert2';

// // CommonJS
// const Swal = require('sweetalert2');

const inputFirstNameRef = document.querySelector("#firstName");
const inputLastNameRef = document.querySelector("#lastName");
const inputEmailRef = document.querySelector("#email");
const inputPasswordRef = document.querySelector("#password");
const inputPasswordConfirmRef = document.querySelector("#passwordConfirm");
const createAccountBtnRef = document.querySelector("#createAccountBtn");

const baseUrlAPI = 'https://todo-api.ctd.academy/v1'

const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

var formErrors = {
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    passwordConfirm: true
}

function checkFormValidity() {
    const formErrorsArray = Object.values(formErrors);
    const formValidity = formErrorsArray.every(item => item === false);
    if(formValidity && inputPasswordRef.value === inputPasswordConfirmRef.value) {
    createAccountBtnRef.disabled = !formValidity;
    }
}

function validateInput(inputRef) {
    const inputValid = inputRef.checkValidity();
    const elementFatherRef = inputRef.parentElement;

    if (inputValid) {
        elementFatherRef.classList.remove('error');
    } else if (!inputValid || inputPasswordRef.value === inputPasswordConfirmRef.value){
        elementFatherRef.classList.add('error');
    } else {
        elementFatherRef.classList.add('error'); 
    }

    formErrors[inputRef.id] = !inputValid;

    checkFormValidity();

}


function resetForm() {

    inputFirstNameRef.value = ''
    inputLastNameRef.value = ''
    inputEmailRef.value = ''
    inputPasswordRef.value = ''
    inputPasswordConfirmRef.value = ''

}


function register(event) {

    event.preventDefault();

    let user = {
        firstName: inputFirstNameRef.value,
        lastName: inputLastNameRef.value,
        email: inputEmailRef.value,
        password: inputPasswordRef.value,
    }



    var requestConfig = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(user)
    }

    fetch(`${baseUrlAPI}/users`, requestConfig).then(
        response => {
            if (response.ok) {
                response.json().then(
                    userData => {
                window.location.href = '../pages/index.html';
                })
            } else {
                alert('O usuário ja foi cadastrado')
            }
    })
    
    createAccountBtnRef.disabled = true;

    resetForm();
}

inputFirstNameRef.addEventListener('keyup', () => validateInput(inputFirstNameRef));

inputLastNameRef.addEventListener('keyup', () => validateInput(inputLastNameRef));

inputEmailRef.addEventListener('keyup', () => validateInput(inputEmailRef));

inputPasswordRef.addEventListener('keyup', () => validateInput(inputPasswordRef));

inputPasswordConfirmRef.addEventListener('keyup', () => validateInput(inputPasswordConfirmRef));

createAccountBtnRef.addEventListener('click', (event) => register(event));


