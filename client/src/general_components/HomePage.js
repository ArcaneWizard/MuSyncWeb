import React, { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import axiosConfig from "../configs/axiosconfigs";

const HomePage = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const history = useHistory();

  let generateLobbyCode = () => {
    let code = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 1; i <= 5; i++) {
      code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return code;
  };

  let enterLobbyCode = (e) => {
    const newCode = e.target.value.toUpperCase();
    setCode(newCode);

    if (newCode.length == 5) {
      axiosConfig
        .post(`/${newCode}/user`, {
          name: name,
        })
        .then((res) => res.json)
        .then((json) => console.log(json))
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          const location = {
            pathname: `${newCode}/player`,
            state: {
              name: name,
              lobby: newCode,
            },
          };

          history.push(location);
        });
    }
  };

  let createLobby = (e) => {
    e.preventDefault();
    const code = generateLobbyCode();

    axiosConfig
      .post(`/${code}/user`, {
        name: name,
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        const location = {
          pathname: `${code}/conductor`,
          state: {
            name: name,
            lobby: code,
          },
        };
        history.push(location);
      });
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
                type="text"
                class="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="example"
                aria-describedby="emailHelp"
                placeholder="Enter name"
              />
            </div>
            <div className="pt-3 text-center">
              <button
                class="btn btn-primary w-50"
                onClick={(e) => createLobby(e)}
              >
                Create Lobby
              </button>
            </div>
            <div class="form-group pt-3 center">
              <input
                type="text"
                value={code}
                onChange={(e) => enterLobbyCode(e)}
                class="form-control bg-warning text-center text-black w-50 m-auto float-none"
                id="exampleInputPassword1"
                placeholder="Enter Lobby Code"
              />
            </div>
          </form>
        </div>
        <div class="col-sm">Creator, Testing Duration and Testing Wanted</div>
      </div>
    </div>
  );
};

export default HomePage;
