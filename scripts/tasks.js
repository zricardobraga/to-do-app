const authToken = localStorage.getItem("authToken");
const createTaskBtnRef = document.querySelector("#createTaskbtn");
//const exitAppRef = document.querySelector("#exitApp");
const inputNovaTarefaRef = document.querySelector("#novaTarefa");
const openedTasksListRef = document.querySelector("#openedAppointmentsList");
const closedTasksListRef = document.querySelector("#closedAppointmentsList");
const userNameRef = document.querySelector("#userName");
const divDadosUsuarioRef = document.querySelector('#divDadosUsuario');

const baseUrlAPI = "https://todo-api.ctd.academy/v1";

var openedTasks= [];
var closedTasks = [];
var tasks = [];

const requestHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: authToken,
};


function limparInput() {
    inputNovaTarefaRef.value = '';
}

//desloga se os dados do usuário enviados(jwt)) pelo localStorage estiverem incorretos
function logout() {
    console.log("Foi")
    window.location.href = "../pages/index.html";
    localStorage.clear();

}

//checa se o jwt recebido existe, se existe ele pega os dados do usuário
function checkIfAuthTokenExist() {
    if (authToken === null) {
        logout();
    } else {
        getUserData();
    }
}

//pega da API os dados do usuário
function getUserData() {
    var requestConfig = {
        method: "GET",
        headers: requestHeaders,
    };

    fetch(`${baseUrlAPI}/users/getMe`, requestConfig).then((response) => {
        if (response.ok) {
            response.json().then((user) => {
                //Chamar aqui a função que mostra o nome do usuário
               // console.log(`${user.firstName} ${user.lastName}
               //console.log(user)

                divDadosUsuarioRef.innerHTML = `
    
                <p>Bem vindo <b id="userName">${user.firstName} ${user.lastName}</b></p>
                <div class="user-image"></div>
                <button id="exitApp">Finalizar sessão</button>
                `
               
                
                
            })
            getTasks();
        } else {
            if (response.status === 401) {
                logout();
            }
        }
    });
}

//cria a task
function createTask(event) {

    event.preventDefault();

    if(inputNovaTarefaRef.checkValidity()) {
        var userTask = insertTask();

        var requestConfig = {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(userTask),
        };

        fetch(`${baseUrlAPI}/tasks`, requestConfig).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    console.log("Aqui que vamos fazer a confirmação");
                    getTasks();
                });
            }
            
        })

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
            // didOpen: (toast) => {
            //   toast.addEventListener('mouseenter', Swal.stopTimer)
            //   toast.addEventListener('mouseleave', Swal.resumeTimer)
            // }
        })
        Toast.fire({
            icon: 'success',
            title: 'Tarefa Adicionada'
        })
    }

    else {
        alert("Deu ruim")
    }

}

//pega a informação digitada no input e insere em um objeto para depois ser inserido no array de tasks 
function insertTask() {
    const task = {
        description: inputNovaTarefaRef.value,
        completed: false,
    };

    return task;
}

//pega as tarefas, através da API, do banco de dados
function getTasks() {
    var requestConfig = {
        method: "GET",
        headers: requestHeaders,
    };

    fetch(`${baseUrlAPI}/tasks`, requestConfig).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                // console.log(data)        
                tasks = data;
                resetSplitedAppointments(); 
                splitTasks(tasks);
            });
        }
    });
}

//separas as tarefas em cumpridas e não cumpridas
function splitTasks(tasks) {
    tasks.map((task) => {
        if (task.completed === false) {
            openedTasks.push(task);
        } else {
            closedTasks.push(task);
        }
    });
    
    insertTasksInHTML();
    limparInput();

    //   console.log(openedAppointments);
    //   console.log(closedAppointments);
}

//reseta os arrays de tarefas cumpridas e não cumpridas
function resetSplitedAppointments() {
    openedTasks = [];
    closedTasks = [];
}

//mostra as tarefas separadas no html
function  insertTasksInHTML() {
    openedTasksListRef.innerHTML = "";
    closedTasksListRef.innerHTML = "";

    openedTasks.map((appointment) => {
        const createdAtDate = new Date(appointment.createdAt);
        const createAtFormated = new Intl.DateTimeFormat("pt-BR").format(
            createdAtDate
        );

        openedTasksListRef.innerHTML += `
            <div>
                <li class="tarefa">
                    <div class="not-done"></div>
                        <div class="descricao">
                            <p class="nome">${appointment.description}</p>
                            <p class="timestamp">${createAtFormated}</p>
                        </div>
                </li>
            </div>
            `;

            
    });

    closedTasks.map((appointment) => {
        const createdAtDate = new Date(appointment.createdAt);
        const createAtFormated = new Intl.DateTimeFormat("pt-BR").format(
            createdAtDate
        );

        closedTasksListRef.innerHTML += `
                <div>    
                    <li class="tarefa">
                        <div class="descricao">
                            <p class="nome">${appointment.description}</p>
                            <p class="timestamp">${createAtFormated}</p>
                            <button>
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                        
                    </li>
                </div>
            </div>
        `;
    });

    addEventListenersBtn();
}

function updateTasks(taskIndex) {

    const id = taskIndex.id;
    
    const updatedTasks = {
        description: taskIndex.description,
        completed: true,
    } 

    var requestConfig = {
        method: "PUT",
        headers: requestHeaders,
        body: JSON.stringify(updatedTasks),
    };

    fetch(`${baseUrlAPI}/tasks/${id}`, requestConfig).then(() => {
        console.log("Atualizado");
        getTasks();
    })

    
    console.log(requestConfig);
    // console.log(taskIndex);
}

function deleteTasks(taskIndex) {

    const id = taskIndex.id;
    
    var requestConfig = {
        method: "DELETE",
        headers: requestHeaders,
    };

    fetch(`${baseUrlAPI}/tasks/${id}`, requestConfig).then(() => {
        console.log("Deletado");
        getTasks();
    })

    
    console.log(requestConfig);
    // console.log(taskIndex);
}


function addEventListenersBtn() {    

    const exitAppRef = divDadosUsuarioRef.children[2];
    exitAppRef.addEventListener('click', () => logout())

    const openedItems = Array.from(openedTasksListRef.children);
    
    openedItems.map(
        (item, index)  => {
            
            const updateBtnRef = item.children[0].children[0];
            
            const taskIndex = openedTasks[index];
            updateBtnRef.addEventListener('click', () => updateTasks(taskIndex));

            // console.log(updateBtnRef);
        }
    );

    const closedItems = Array.from(closedTasksListRef .children);
    
    closedItems.map( 
        (item, index) => {
            const deleteBtnRef = item.children[0].children[0].children[2];
            const taskIndex = closedTasks[index];
            deleteBtnRef.addEventListener('click', () => deleteTasks(taskIndex));
            //console.log(deleteBtnRef)

        }
        

    )

}

checkIfAuthTokenExist();

inputNovaTarefaRef.addEventListener("click", () => insertTask());

createTaskBtnRef.addEventListener("click", (event) => createTask(event));