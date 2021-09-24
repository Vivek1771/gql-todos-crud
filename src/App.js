import { React, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import './App.css'
import { ADD_TODO, TOGGLE_TODOS, DELETE_TODO } from './graphql/mutations/mutation'
import { GET_TODOS } from './graphql/queries/query'

function App() {
  const [todoText, setTodoText] = useState('');
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODOS);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText('')
  });
  const [deleteTodo] = useMutation(DELETE_TODO);

  async function handleToggleTodo({ id, done }) {
    await toggleTodo({
      variables: { id, done: !done }
    });
  }
  async function handleDeleteTodo({ id }) {
    const isConfirmed = window.confirm('Do you want to delete it')
    if (isConfirmed) {
      await deleteTodo({
        variables: { id },
        update: cache => {
          const prevData = cache.readQuery({ query: GET_TODOS });
          const newTodos = prevData.todos.filter(todo => todo.id !== id);
          cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } });
        }
      });
    }
  }


  async function handleAddTodo(event) {
    event.preventDefault();
    if (!todoText.trim()) return;

    await addTodo({
      variables: { text: todoText },
      refetchQueries: [
        { query: GET_TODOS }
      ]
    });
  }


  if (loading) {
    return (
      <div className="App">Loading...</div>
    );
  }
  if (error) return <div>error fetching todos</div>


  return (
    <>

      <div className="App">
        <h1>GraphQL Todos</h1>
        <form onSubmit={handleAddTodo}>
          <input
            type="text"
            placeholder="Add A Todo"
            onChange={event => setTodoText(event.target.value)}
            value={todoText}
          />
          <button
            type="submit">Create</button>
        </form>
        <h4>Double click on todo to complete</h4>
        <h4>Tap * to delete the todo</h4>
        <hr width="45%"></hr>
        <div>
          {data.todos.map(todo => (
            <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
              <span style={{ "textDecorationLine": todo.done ? "line-through" : "none" }}>
                {todo.text}
              </span>
              {" "}
              <button onClick={() => handleDeleteTodo(todo)}>
                <span>&times;</span>
              </button>
            </p>
          ))}

        </div>
      </div>
    </>

  );
}

export default App;

