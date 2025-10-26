let hrs = document.getElementById('hrs');
let mins = document.getElementById('mins');
let date = document.getElementById('date');
let timeimg = document.getElementById('timeimg');
let emptyImage = document.getElementById('emptyImage');
let theme = document.getElementById("theme");


setInterval(()=>{
    let currentTime = new Date();
    hrs.innerHTML = (currentTime.getHours()<10?"0":"") + currentTime.getHours();
    mins.innerHTML = (currentTime.getMinutes()<10?"0":"")  + currentTime.getMinutes();

    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    date.innerHTML = currentTime.toLocaleDateString('en-US', options);

    let hour = currentTime.getHours();

    if (hour >= 5 && hour < 10) {
        timeimg.src = "./img/morning.jpg";
    } else if (hour >= 10 && hour < 16) {   
        theme.href = "./css/afternoon.css";
        timeimg.src = "./img/afternoon.jpg";
        emptyImage.src = "./img/todolist-empty-afternoon.png";
    } else if (hour >= 16 && hour < 19) {
        timeimg.src = "./img/evening.jpg";
    } else {
        theme.href = "./css/night.css";
        timeimg.src = "./img/night.jpg";
        emptyImage.src = "./img/todolist-empty-night.png";    
    }
},1000);

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById ('input');
    const taskAddBtn = document.getElementById ('add-button');
    const taskList = document.getElementById ('list');

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'flex' : 'none';
    }

    const saveTask = () => {
        const task = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(task))
    }

    const loadTask = () => {
        const savedTask = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTask.forEach(({text, completed}) => addTask (text, completed, false));
        toggleEmptyState();  
    }

    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        if(!taskText) {
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
        <div class="left"><input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
        <span>${taskText}</span>
        </div>
        <div class="edit-del-btn">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="del-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editbtn = li.querySelector('.edit-btn');
        
        if (completed) {
            li.classList.add('completed');
            editbtn.disabled = true;
            editbtn.style.opacity = '0.5';
            editbtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editbtn.disabled = isChecked;
            editbtn.style.opacity = isChecked ? '0.5' : '1';
            editbtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            saveTask()
        })

        editbtn.addEventListener('click', () => {
            if(!checkbox.checked) {
                taskInput.value = li.querySelector ('span').textContent; 
                li.remove();
                toggleEmptyState();
                saveTask();
            }
        });

        li.querySelector('.del-btn').addEventListener('click',() => {
            li.remove();
            toggleEmptyState();
            saveTask();
        })

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        saveTask();
    };

    taskAddBtn.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
        e.preventDefault();
            addTask();                   
        }
    });
    loadTask();
});