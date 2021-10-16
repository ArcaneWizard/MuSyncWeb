import React, { Fragment, useEffect, useState } from "react";
import EditTodo from "./EditTodo";

const ListTodos = () => {
  const [todos, setTodos] = useState([]);

  const deleteTodo = (id) => {
    try {
      const deleteTodo = fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
    } catch (err) {
      console.error(err.messsage);
    }
  };

  const getTodos = () => {
    try {
      const response = fetch("http://localhost:5000/todos")
        .then((res) => res.json())
        .then((data) => setTodos(data));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <Fragment>
      {}
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.description}</td>
              <td>
                <EditTodo todo={todo} />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          ;
        </tbody>
      </table>
    </Fragment>
  );
};

export default ListTodos;
