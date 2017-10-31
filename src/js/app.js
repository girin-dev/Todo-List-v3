import axios from 'axios';

(function () {
  let todos;
  const todoList = document.getElementById('todo-list');
  const todoInput = document.getElementById('input-todo');

  // todolist를 출력하는 기능
  const render = () => {
    let html = '';
    todos.forEach((todo) => {
      html += `<li class="list-group-item">
                <div class="hover-anchor">
                  <a class="hover-action text-muted">
                    <span class="glyphicon glyphicon-remove-circle pull-right" data-id="${todo.id}"></span>
                  </a>
                  <label class="i-checks" for="${todo.id}">
                    <input type="checkbox" id="${todo.id}" ${todo.completed ? 'checked' : ''}><i></i>
                    <span>${todo.content}</span>
                  </label>
                </div>
              </li>`;
    });
    todoList.innerHTML = html;
  };

  // checkbox 상태에 따라 todos의 completed 프로퍼티 값을 변경하는 기능
  const ToggleTodoComplete = (id) => {
    let todoSelected
    todoSelected = todos.find((todo) => {
      return todo.id === parseInt(id, 10) 
    });
    console.log('todos란', todoSelected)
    let todoCompleted = { completed: `${!(todoSelected.completed)}` };
    
    axios.patch(`/todos/${id}`, todoCompleted)
      .then(res => {
        console.log('[TOGGLE]\n', res.data);
        getTodo()})
      .catch(err => console.log(err));
  };

  // todos의 특정 id의 요소를 삭제하는 기능
  const removeTodo = (id) => {
   
    axios.delete(`/todos/${id}`)
      .then(res => {
        console.log('[DELETE]\n', res.data);
        getTodo()})
      .catch(err => console.log(err));
  };

  // 새롭게 생성할 객체에 id를 부여하는 기능
  const lastTodoId = () => {
    return Math.max.apply(null, todos.map(item => item.id)) + 1;
  };

  // todos에 todoInput.value를 추가하는 기능
  const addTodo = () => {
    const content = todoInput.value;
    todoInput.value = '';
    
    let todo;
    
    if (!todos || !todos.length) {
      todo = { id: 1, content, completed: false };
    } else {
      // 새롭게 생성한 객체를 포함한 배열에 기존의 todos를 뒤에 붙임
      todo = { id: lastTodoId(), content, completed: false }
      // [{ id: lastTodoId(), content, completed: false }].concat(todos);
      // 새롭게 생성한 객체를 기존의 todos 앞에 붙임.
      // unshift()는 성능이슈가 있음.
      // todos.unshift({ id: lastTodoId(), content, completed: false })
    }
    console.log(todo)

    axios.post('/todos', todo)
      .then(res => { 
        console.log('[CREATE]\n', res.data);
        getTodo();
       })
      .catch(err => console.log('[CREATE]가 불가능합니다.'));
  };

  const getTodo = () => {
    axios.get('/todos')
      .then(res => {
        todos = res.data;
        render();
        console.log('[GET]\n', todos)
      })
      .catch(err => console.log('[GET]이 불가능합니다.'));
  };

  // 웹페이지 시작과 동시에 getTodo() 호출
  window.addEventListener('load', () => getTodo());

  // input에 값을 입력하고 엔터를 누르면 addTodo() 호출
  todoInput.addEventListener('keyup', (e) => {
    if (e.keyCode !== 13 || todoInput === '') return;
    addTodo();
  });

  // remove circle을 누르면 removeTodo() 호출
  todoList.addEventListener('click', (e) => {
    if (e.target.nodeName !== 'SPAN' || e.target.parentNode.nodeName === 'LABEL') return;
    removeTodo(e.target.dataset.id);
  });

  // checkbox를 상태 변경이 일어나면 ToggleTodoComplete() 호출
  todoList.addEventListener('change', (e) => {
    ToggleTodoComplete(e.target.id);
  });
}());
