// Här har jag queryselectors som kommer ta .todo-form, 
// .todo-input, .todo-items från dokumentet och spara de
// i motsvarande const.

// Här selekterar jag <form> med calssen todo-form.
const todoForm = document.querySelector('.todo-form');
// Här sleketerar jag <input> med classen todo-input.
const todoInput = document.querySelector('.todo-input');
// Här selekterar jag <ul> med calssen todo-items.
const todoItemsList = document.querySelector('.todo-items');

// Har skriver jag en array som lagrar alla uppgifter/todos.
let todos = [];

// Lägger till en eventlistner på form, När en användare lägger in en ny uppgift/todo
// kommer sidan att laddas om för att hindra det kallar jag på event.preventDefault() 
// och passerar värdet användaren skrev till addTodo() funktionen. 
todoForm.addEventListener('submit', function(event) {
  event.preventDefault();
  // Anropar addTodo funktionen med input boxens nuvarnade värde.
  addTodo(todoInput.value); 
});

// Funktion för att lägga till uppgifter/todo. Tar (item) som första argument.
function addTodo(item) {
  // Jag kollar om här om item är tom eller inte, om den inte är tom så gör den 
  // en ny uppgift/todo.
  if (item !== '') {
    // Gör en uppgift/todo objekt med ett id, namn och en completed property.
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };

    // Sen här pushar jag objektet till (todo) arrayen.
    todos.push(todo);
    // sparar den på localstorage/localt
    addToLocalStorage(todos); 

    // Tar bort/clearar värdet från input boxen.
    todoInput.value = '';
  }
}

// funktion för att skriva ut/render angivna uppgifter/todos till skärmen.
function renderTodos(todos) {
  // Tar bort/clearar allt i <ul> med calss todo-items som innehåller alla uppgifter/todo items.
  todoItemsList.innerHTML = '';

  // Kör igenom varje item i todos arrayen och för varje item skapa en <li>.
  todos.forEach(function(item) {
    // Här kollar jag om den är completed.
    const checked = item.completed ? 'checked': null;

    // gör en lista och fyller ut den.   
    const li = document.createElement('li');    
    li.setAttribute('class', 'item');    
    li.setAttribute('data-key', item.id);    
    
    // jag kollar om item är completed/klar så lägger jag till en class till <li> som heter checked,
    // som kommer att kunna strycka över en uppgift/todo i CSS med en line-through.
    if (item.completed === true) {
      li.classList.add('checked');
    }

    // Om man anger check och klickar på rutan kommer det visas i (.check) om inte så blir det null och blir av checkad.
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
      <button class="delete-button">X</button>
    `;    
    // lägger <li> i <ul>
    todoItemsList.append(li);
  });

}

// funktion som sparar/lägger till uppgifter/todos i localstorage. Vi behöver då en nyckel (todos) och ett värde 
// (todos arrayen).
function addToLocalStorage(todos) {  
  //efteroms man inte kan spara/lagra en array i localstorage måste man först convertera det till en sträng först,
  //den kan man göra genom (JSON.stringify()).
  localStorage.setItem('todos', JSON.stringify(todos));
  // render them to screen
  //sen anropar jag renderTodos varje gång nåt läggs till i localstorage.
  renderTodos(todos);
}

// funktion som kommer att parsa alla items från localstorage när vi öppnar upp sidan/at göra listan.
function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  // om det finns refrenser kommer det att converterar tillbaka till en aray och lagars/sparas i todo arrayen.
  //converterar tillbaka till en array genom (JSON.parse()).
  if (reference) {
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}

// checkar för en uppgift/todo som klar eller inte klar.
function toggle(id) {
  todos.forEach(function(item) {    
    if (item.id == id) {      
      item.completed = !item.completed;
    }
  });

  // uppdaterar localstorage
  addToLocalStorage(todos);
}

// raderar en uppgift/todo från arrayen, uppdaterar localstorage och skriver ut/reder uppdaterad lista till skärmen.
function deleteTodo(id) {
  // filtrerar <li> med id och uppdaterar todos arrayen
  todos = todos.filter(function(item) {
    return item.id != id;
  });

  // uppdaterar localstorage
  addToLocalStorage(todos);
}

// hämtar allt från locklstorage
getFromLocalStorage();

// kollar på ett click event på hela <ul> om man clickar på .checkbox eller på delete knappen.
// om man clickar på .checkbox anropas toggle() genom att passera id.
// om man clickar på .delete-knappen så anropas deleteTodo() genom att pasera id.
// id kommer från data-key.
// event.target är elementet där eventet/cklicket sker.
todoItemsList.addEventListener('click', function(event) {
  // kollar om eventet/cklick är på checkbox.
  if (event.target.type === 'checkbox') {
    toggle(event.target.parentElement.getAttribute('data-key'));
  }

  // kollar om det är en delete knapp.
  if (event.target.classList.contains('delete-button')) {
    // hämta id från data-key attributets värde av parent <li> där delete kanppen beffiner sig.
    deleteTodo(event.target.parentElement.getAttribute('data-key'));
  }
});