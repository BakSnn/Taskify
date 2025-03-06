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
       
          const q = query(
            collection(db, "users", currentUser.uid, "todos") 
          );
          const querySnapshot = await getDocs(q);
          const todosArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTodos(todosArray);
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
      setTodos(todos.filter((todo) => todo.id !== id));
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

    const todoRef = doc(db, "users", user.uid, "todos", id);
    await updateDoc(todoRef, updatedTodo);

    setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
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

          <h1>Todo App List</h1>
          <TodoForm addTodo={addTodoHandler} />
          <TodosActions
            todos={todos}
            resetTodos={() => setTodos([])}
            deleteCompletedTodos={() =>
              setTodos(todos.filter((todo) => !todo.isCompleted))
            }
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
