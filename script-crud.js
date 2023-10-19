const taskListContainer = document.querySelector('.app__section-task-list')

const formTask = document.querySelector('.app__form-add-task')
const toggleFormTaskBtn = document.querySelector('.app__button--add-task')
const formLabel = document.querySelector('.app__form-label')

const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel')
const btnCancelar = document.querySelector('.app__form-footer__button--cancel')

const btnDeletar = document.querySelector('.app__form-footer__button--delete')

const taskAtiveDescription = document.querySelector('.app__section-active-task-description')

const textArea = document.querySelector('.app__form-textarea')

const localStorageTarefas = localStorage.getItem('tarefas')
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas):[]

const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`

let tarefaSelecionada = null
let itemTarefaSelecionada = null

let tarefaEdicao = null
let paragraphEdicao = null

const selecionaTarefa = (tarefa, elemento) => {

    if(tarefa.concluida){
        return
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
    })
    
    if (tarefaSelecionada == tarefa) {
        taskAtiveDescription.textContent = null
        itemTarefaSelecionada = null
        tarefaSelecionada = null
        return
    }
    
    tarefaSelecionada = tarefa
    itemTarefaSelecionada = elemento
    taskAtiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
    }

const limpaForm = () => {
    tarefaEdicao = null
    paragraphEdicao = null
    textArea.value = ''
    formTask.classList.add('hidden')
}

const selecionaTarefaEdicao = (tarefa, elemento) => {
    if(tarefaEdicao == tarefa) {
        limpaForm()
        return
    }

    formLabel.textContent = 'Editando tarefa'
    tarefaEdicao = tarefa
    paragraphEdicao = elemento
    textArea.value = tarefa.descricao
    formTask.classList.remove('hidden')
}

function createTask(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = taskIconSvg

    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')

    paragraph.textContent = tarefa.descricao

    const button = document.createElement('button')

    button.classList.add('app_button-edit')
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')

    button.appendChild(editIcon)

    button.addEventListener('click', (event) => {
        event.stopPropagation()
        selecionaTarefaEdicao(tarefa, paragraph)
    })

    li.onclick = () =>{
        selecionaTarefa(tarefa, li)
    }

    svgIcon.addEventListener('click', (evento) => {
        if(tarefa == tarefaSelecionada) {
            evento.stopPropagation()
            button.setAttribute('disable', true)
            li.classList.add('app__section-task-list-item-complete') 
            tarefaSelecionada.concluida = true
            updateLocalStorage()
        }

    })

    if(tarefa.concluida){
        button.setAttribute('disable', true)
        li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)

    return li
}

// localStorage.setItem('quantidade', 300)
tarefas.forEach(task => {
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
})

toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando Tarefa'
    formTask.classList.toggle('hidden')
})

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault()
    if(tarefaEdicao) {
        tarefaEdicao.descricao = textArea.value,
        paragraphEdicao.textContent = textArea.value
    }
    else {
        const task = {
            descricao : textArea.value,
            concluida : false
        }
        tarefas.push(task)
        const taskItem = createTask(task)   
        taskListContainer.appendChild(taskItem)
    }
        
        updateLocalStorage()
        limpaForm()
})

cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden')
})

btnCancelar.addEventListener('click', limpaForm)

btnDeletar.addEventListener('click', () => {
    if(tarefaSelecionada) {
        const index = tarefas.indexOf(tarefaSelecionada)

        if(index !== -1){
            tarefas.splice(index, 1)
        }

        itemTarefaSelecionada.remove()
        tarefas.filter(t=> t!= tarefaSelecionada)
        itemTarefaSelecionada = null
        tarefaSelecionada = null
    }
    updateLocalStorage()
})

document.addEventListener('TarefaFinalizada', function (e) {
    if(tarefaSelecionada) {
        tarefaSelecionada.concluida = true
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        itemTarefaSelecionada.querySelector('button').setAttribute('disable', true)
        updateLocalStorage()
    }
})
