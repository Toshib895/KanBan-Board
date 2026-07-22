let tasksData = {};

let todo = document.querySelector('#todo');
let progress = document.querySelector('#progress');
let done = document.querySelector('#done');
let dragElement = null;
let columns = [todo, progress, done];

// 1. FIXED: Corrected parameter names to match variables inside the function
function addTask(title, desc, column) {
  let div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = `
               <h2>${title}</h2>
               <p>${desc}</p>
               <button class="delete-btn">Delete</button>
              `;
  column.appendChild(div);

  // FIXED: Changed "drag" event to "dragstart" for proper drag tracking
  div.addEventListener("dragstart", () => {
    dragElement = div;
  });

  // NEW: Added functionality to the Delete button
  div.querySelector(".delete-btn").addEventListener("click", () => {
    div.remove();
    updateTaskCount();
  });

  return div;
}

// 2. Task Counter and Local Storage Synchronizer
function updateTaskCount() {
  columns.forEach(col => {
    let tasks = col.querySelectorAll(".task");
    let count = col.querySelector(".right");
    
    tasksData[col.id] = Array.from(tasks).map(t => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText
      };
    });
    
    localStorage.setItem("tasks", JSON.stringify(tasksData));
    count.innerText = tasks.length;
  });
}

// 3. Load Data from Local Storage OR Initialize with Default Task
if (localStorage.getItem("tasks")) {
  let data = JSON.parse(localStorage.getItem("tasks"));
  for (let col in data) {
    let column = document.querySelector(`#${col}`);
    data[col].forEach(task => {
      addTask(task.title, task.desc, column);
    });
  }
  updateTaskCount();
}
//  else {
//   // Executes ONLY on the first run when LocalStorage is empty
//   addTask("Task 1", "Task 1 desc", todo);
//   updateTaskCount(); // This saves "task 1" into local storage automatically
// }

// 4. Column Drag and Drop Events
function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });
  
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });
  
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragElement) {
      column.appendChild(dragElement);
      column.classList.remove("hover-over");
      updateTaskCount(); // FIXED: Removed redundant localStorage duplication code here
    }
  });
}

columns.forEach(col => addDragEventsOnColumn(col));

// 5. Popup Modal Logic
let toggleModalBtn = document.querySelector("#toggle-modal");
let modalBg = document.querySelector(".modal .bg");
let modal = document.querySelector(".modal");
let addTaskBtn = document.querySelector("#add-new-task");
let titleInput = document.querySelector("#task-title-input");
let descInput = document.querySelector("#task-desc-input");

toggleModalBtn.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskBtn.addEventListener("click", () => {
  let taskTitle = titleInput.value.trim();
  let taskDesc = descInput.value.trim();

  if (taskTitle === "") {
    alert("Please enter a task title");
    return;
  }

  addTask(taskTitle, taskDesc, todo);
  updateTaskCount();
  
  // Reset input field values so the modal opens clean next time
  titleInput.value = "";
  descInput.value = "";
  modal.classList.remove("active");
});