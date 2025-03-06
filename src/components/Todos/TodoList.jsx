import Todo from './Todo'
import styles from './TodoList.module.css'
function TodoList({ todos, deleteTodo, toggleTodo, countCompleted }) {
  return (
    <div className={styles.todoListContainer}>
      {!todos.length && <h2>Todo list is empty...</h2>}
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
        />
      ))}
      <div className={styles.completedTodos}>
        {countCompleted > 0 && (
          <h2>{`You have completed ${countCompleted} ${
            countCompleted > 1 ? 'todos' : 'todo'
          }`}</h2>
        )}
      </div>
    </div>
  )
}

export default TodoList
