import { useState } from 'react'
import styles from './TodoForm.module.scss'
import Button from '../UI/Button/Button'
function TodoForm({ addTodo }) {
  const [text, setText] = useState('')

  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (text.trim() !== '') {
      addTodo(text)
      setText('')
    }
  }

  return (
    <div className={styles.todoFormContainer}>
      <form onSubmit={onSubmitHandler}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the todo"
        ></input>
        <Button type="submit" title="Добавить">
          Добавить
        </Button>
      </form>
    </div>
  )
}

export default TodoForm
