import React, { Fragment, useState } from "react";

const InputTodo = () => {
  const [description, setDescription] = useState("");

  const onSubmitForm = (e) => {
    e.preventDefault();
    try {
      const body = { description };
      fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((window.location = "/"));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">Game Dev Testing List</h1>
      <form className="d-flex mt-4" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <button className="btn btn-success">Add</button>
      </form>
    </Fragment>
  );
};

export default InputTodo;
