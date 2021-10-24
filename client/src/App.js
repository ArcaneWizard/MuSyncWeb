import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import "./App.css";

//components
import HomePage from "./general_components/HomePage";
import AudioConductorPage from "./general_components/AudioConductorPage";
import AudioPlayerPage from "./general_components/AudioPlayerPage";

import background from "../src/images/background.png";

function App() {
  var sectionStyle = {
    backgroundImage: `url(${background})`,
  };

  return (
    <Router>
      <div className="container-fluid min-vh-100 view" style={sectionStyle}>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/:id/conductor">
            <AudioConductorPage />
          </Route>
          <Route exact path="/:id/player">
            <AudioPlayerPage />
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
