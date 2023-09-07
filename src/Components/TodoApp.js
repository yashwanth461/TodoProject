import React, { useState, useEffect } from "react";
import "./Todo.css";

const TodoApp = () => {
  // State variables
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch todos from the API when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch todos from the API endpoint
  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1/todos"
      );
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  // Add a new task to the list
  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTodo = {
        id: Date.now(),
        title: newTask,
        completed: false,
      };
      setTodos([newTodo, ...todos]);
      setNewTask("");
      setErrorMessage(""); // Clear the error message
    } else {
      setErrorMessage("Task should not be empty");
    }
  };

  // Toggle the completion status of a task
  const toggleTaskCompletion = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  // Edit the title of a task
  const editTask = (id, newTitle) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    );
    setTodos(updatedTodos);
  };

  // Delete a task from the list
  const deleteTask = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  // Filter the tasks based on the selected filter
  const filteredTodos = todos.filter((todo) =>
    filter === "completed" ? todo.completed : true
  );

  // Handle input field change
  const handleInputChange = (e) => {
    setNewTask(e.target.value);
    setErrorMessage(""); // Clear the error message
  };

  // Handle edit task
  const handleEdit = (id, title) => {
    const updatedTitle = prompt("Enter new task title:", title);
    if (updatedTitle && updatedTitle.trim() !== "") {
      editTask(id, updatedTitle);
    }
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      <div className="input-field">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={handleInputChange}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      {errorMessage && (
        <div className="error-message" style={{ color: "red" }}>
          {errorMessage}
        </div>
      )}
      <div className="filter-buttons">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTaskCompletion(todo.id)}
            />
            <div className="task-container">
              <div
                className={`task-title ${todo.completed ? "completed" : ""}`}
                onClick={() => handleEdit(todo.id, todo.title)}
                style={{ width: 323 }}
              >
                {todo.title}
              </div>
            </div>

            <div className="button-group">
              <button
                onClick={() => handleEdit(todo.id, todo.title)}
                style={{ backgroundColor: "green" }}
              >
                Edit
              </button>
              <button onClick={() => deleteTask(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
