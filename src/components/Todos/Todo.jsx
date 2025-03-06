import { RiTodoFill } from "react-icons/ri";
import { BsTrashFill } from "react-icons/bs";
import { ImCheckmark } from "react-icons/im";
import { IoCreateOutline } from "react-icons/io5";

import styles from "./Todo.module.scss";
import { useState } from "react";
function Todo({ todo, deleteTodo, toggleTodo }) {
  const [createdDate, setCreatedDate] = useState(
    new Date().toLocaleDateString()
  );

  return (
    <div
      className={`${styles.todo} ${
        todo.isCompleted ? styles.completedTodo : ""
      }`}
    >
      <IoCreateOutline className={styles.createdDateIcon}></IoCreateOutline>
      <span className={styles.date}>{createdDate.slice(0, 5)}</span>
      <RiTodoFill className={styles.todoIcon} />
      <div className={styles.todoText}>{todo.text}</div>
      <BsTrashFill
        className={styles.trashFillIcon}
        onClick={() => deleteTodo(todo.id)}
      />
      <ImCheckmark
        className={styles.checkIcon}
        onClick={() => toggleTodo(todo.id)}
      />
    </div>
  );
}
export default Todo;
