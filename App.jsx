import { useEffect, useState } from "react";
import {
  auth,
  db,
  collection,
  addDoc,
  getDocs,
  query,
  deleteDoc,
  updateDoc,
  doc,
} from "./firebase";
import TodoForm from "./src/components/Todos/TodoForm";
import TodoList from "./src/components/Todos/TodoList";
import TodosActions from "./src/components/Todos/TodosActions";
import Clock from "./src/components/Clock/Clock";
import Login from "./src/components/Login/Login";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { writeBatch,serverTimestamp} from "firebase/firestore";

import styles from "./App.module.scss";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const fetchTodos = async () => {
          const q = query(collection(db, "users", currentUser.uid, "todos"));
          const querySnapshot = await getDocs(q);
          const todosArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTodos(todosArray.sort((a, b) => a.createdAt - b.createdAt)); // Сортируем после загрузки данных
        };
        fetchTodos();
      } else {
        setTodos([]);
      }
    });
    return () => unsubscribed();
  }, []);

  const addTodoHandler = async (text) => {
    if (text.trim() && user) {
      const newTodo = {
        text,
        isCompleted: false,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      try {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "todos"),
          newTodo
        );
        setTodos((prevTodos) => [...prevTodos, { id: docRef.id, ...newTodo }]);
        setNewTodo("");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const deleteTodoHandler = async (id) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "todos", id));
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (e) {
      console.error("Error deleting todo: ", e);
    }
  };

  const toggleTodoHandler = async (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    const updatedTodo = {
      ...todoToUpdate,
      isCompleted: !todoToUpdate.isCompleted,
    };

    try {
      await updateDoc(doc(db, "users", user.uid, "todos", id), updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? { ...todo, isCompleted: updatedTodo.isCompleted }
            : todo
        )
      );
    } catch (e) {
      console.error("Error updating todo: ", e);
    }
  };

  const deleteCompletedTodos = async () => {
    const batch = writeBatch(db);
    const completedTodos = todos.filter((todo) => todo.isCompleted);

    completedTodos.forEach((todo) => {
      const todoRef = doc(db, "users", user.uid, "todos", todo.id);
      batch.delete(todoRef);
    });

    try {
      await batch.commit();
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.isCompleted));
    } catch (e) {
      console.error("Error deleting completed todos: ", e);
    }
  };

  const resetTodos = async () => {
    const batch = writeBatch(db);
    todos.forEach((todo) => {
      const todoRef = doc(db, "users", user.uid, "todos", todo.id);
      batch.delete(todoRef);
    });

    try {
      await batch.commit();
      setTodos([]);
    } catch (e) {
      console.error("Error resetting todos: ", e);
    }
  };

  return (
    <div className={styles.app}>
      {user ? (
        <>
          <div className={styles.authoried}>
            <Clock />
            <div className={styles.authoried__bar}>
              <h2>{user.email}</h2>
              <button
                className={styles.authoried__button}
                onClick={() => signOut(auth)}
              >
                Выйти
              </button>
            </div>
          </div>

          <h1>Taskify</h1>
          <TodoForm addTodo={addTodoHandler} />
          <TodosActions
            todos={todos}
            resetTodos={resetTodos}
            deleteCompletedTodos={deleteCompletedTodos}
            completedTodosCount={
              todos.filter((todo) => todo.isCompleted).length
            }
          />
          <TodoList
            todos={todos}
            deleteTodo={deleteTodoHandler}
            toggleTodo={toggleTodoHandler}
            countCompleted={todos.filter((todo) => todo.isCompleted).length}
          />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
