import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import "./App.css";

//components
import HomePage from "./general_components/HomePage";

function App() {
  return (
    <Router>
      <div className="container-fluid min-vh-100 bg-success">
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/another">
            <AnotherPage />
          </Route>
          <Route path="/bored">
            <BoredPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

const AnotherPage = () => {
  const history = useHistory();

  const ReturnToHomePage = () => {
    history.push("/");
  };

  return (
    <div>
      <h2>Another</h2>
      <button className="btn btn-dark" onClick={() => ReturnToHomePage()}>
        Hello
      </button>
    </div>
  );
};

const BoredPage = () => {
  return <h2>Bored</h2>;
};

export default App;
