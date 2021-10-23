import React from "react";
import { useHistory } from "react-router";
import GameImagePreview from "../medium_components/GameImagePreview";

const HomePage = () => {
  var bob = [2, 3, 4];
  const history = useHistory();

  const ChangeToAnotherPage = () => {
    const location = {
      pathname: "/another",
      state: { Lucario: "awesome" },
    };

    history.push(location);
  };

  let generateLobbyCode = () => {
    let code = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 1; i <= 5; i++) {
      code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return code;
  };

  let goToAudioPage = () => {
    const code = generateLobbyCode();

    const location = {
      pathname: `/${code}`,
      state: code,
    };

    history.push(location);
  };

  return (
    <div>
      <div class="row min-vh-100 pb-5">
        <div class="col-sm"></div>
        <div class="col-sm my-auto">
          <h1 class="text-white text-center pb-3 fst-italic">MuSync</h1>
          <form>
            <div class="form-group w-50 text-center m-auto float-none">
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter name"
              />
            </div>
            <div className="pt-3 text-center">
              <button
                type="submit"
                class="btn btn-primary w-50"
                onClick={() => goToAudioPage()}
              >
                Create Lobby
              </button>
            </div>
            <div class="form-group pt-3 center">
              <input
                type="password"
                class="form-control bg-info text-center text-black w-50 m-auto float-none"
                id="exampleInputPassword1"
                placeholder="Enter Lobby Code"
              />
            </div>
            <h2 class="text-white text-center pt-5 fst-italic">
              Generated Code:
            </h2>
          </form>
        </div>
        <div class="col-sm">Creator, Testing Duration and Testing Wanted</div>
      </div>
    </div>
  );
};

export default HomePage;
