const inputEmailRef = document.querySelector('#inputEmail');
const inputPasswordRef = document.querySelector('#inputPassword');
const loginButtonRef = document.querySelector('#loginButtonRef');
const baseUrlAPI = 'https://todo-api.ctd.academy/v1';

const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};


var formErrors = {
    inputEmail: true,
    inputPassword: true
};

function checkFormValidity() {
    const formErrorsArray = Object.values(formErrors);
    const formValidity = formErrorsArray.every(item => item === false);
    loginButtonRef.disabled = !formValidity;
};

function validateInput(inputRef) {
    const inputValid = inputRef.checkValidity();
    const elementFatherRef = inputRef.parentElement;

    if (inputValid) {
        elementFatherRef.classList.remove('error');
    } else {
        elementFatherRef.classList.add('error');
    }

    formErrors[inputRef.id] = !inputValid;

    checkFormValidity();

};

function resetForm() {

    inputEmailRef.value = ''
    inputPasswordRef.value = ''

}

function authUser(event) {

    event.preventDefault()

    let user = {
        email: inputEmailRef.value,
        password: inputPasswordRef.value
    }

    var requestConfig = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(user)
    }

    fetch(`${baseUrlAPI}/users/login`, requestConfig).then(
        response => {
            if (response.ok) {
                response.json().then(
                    data => {
                        localStorage.setItem('authToken', data.jwt);
                        window.location.href = '../pages/tasks.html';
                    }
                );
            } else {
                alert('O seu usuário ou senha está incorreto')
            }
        }
    );

    loginButtonRef.disabled = true;
    resetForm();

};

inputEmailRef.addEventListener('keyup', () => validateInput(inputEmailRef));

inputPasswordRef.addEventListener('keyup', () => validateInput(inputPasswordRef));

loginButtonRef.addEventListener('click', (event) => authUser(event));