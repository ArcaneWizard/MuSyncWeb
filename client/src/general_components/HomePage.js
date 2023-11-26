import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import axiosConfig from "../configs/AxiosConfigs";
import whiteLogo from "../images/white_logo_3.png";
import styled from 'styled-components';
import { join } from "path";

const HomePage = () => {
  const [code, setCode] = useState(""); // lobby code
  const [name, setName] = useState(""); // user name
  const [errorMsg, updateErrorMsg] = useState("");
  const history = useHistory();

  const controller = new AbortController();
  let isCreatingLobby = false;
  let isUpdatingJoinableLobby = false;

  // generates a random 5-letter lobby code, all capital letters
  let generateLobbyCode = () => {
    let code = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 1; i <= 5; i++) {
      code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return code;
  };

  // parameters: (string newCode, boolean clickedJoin)
  // find the lobby that matches with the specified code. If a lobby can't be joined.
  // give an error message. Join the lobby only if the user clicked join
  let joinLobby = async (newCode, clickedJoin) => {
    if (isUpdatingJoinableLobby)
      return;

    isUpdatingJoinableLobby = true;
    setCode(newCode);

    if (name == "" && clickedJoin) {
      updateErrorMsg("Please enter a name before joining a lobby.");
      isUpdatingJoinableLobby = false;
      return;
    }
    
    else if (name == "" && !clickedJoin) {
      updateErrorMsg("Please enter a name before creating a lobby.");
      isUpdatingJoinableLobby = false;
      return;
    }
    
    else if (newCode.length == 0 && !clickedJoin) {
      updateErrorMsg("");
      isUpdatingJoinableLobby = false;
      return;
    }

    else if (newCode.length != 5) {
      updateErrorMsg("A lobby code must be 5 letters long");
      isUpdatingJoinableLobby = false;
      return;
    }

    else {
      try {
        // abort get request if stale for 1 second
        let timer = setTimeout(() => { controller.abort()}, 1000)
        const res = await axiosConfig.get(`/${newCode}`, { signal: controller.signal });
        clearTimeout(timer);

        if (!res.data.exists)
          updateErrorMsg("Lobby could not be found");
        else if (!clickedJoin)
          updateErrorMsg("Lobby found! Click to join");
        else {
          let timer = setTimeout(() => { controller.abort()}, 1000)
          let res = await axiosConfig.get(`/${newCode}/user`, { params: {name: name}});
          clearTimeout(timer);
          
          if (res.data.exists) {
            updateErrorMsg("Username is taken in the lobby entered.");
            isUpdatingJoinableLobby = false;
            return;
          }

          const nextPageLocation = {
            pathname: `${newCode}/player`,
            state: {
              name: name,
              lobby: newCode,
            },
          };
          
          history.push(nextPageLocation);
        }
      }
      catch {
        updateErrorMsg("Network Error. Couldn't connect to server");
      }
      
      isUpdatingJoinableLobby = false;
    }
  };

  const LobbyCreationStatus = {
    SUCCESS: 1,
    FAIL_ERROR: 2,
    RETRY_ERROR: 3,
  };
  
  // returns whether or not a lobby with the specified code can be created
  let tryToCreateLobby = async (newCode) => {
    try {
      // abort post request after 1 second. will enter catch statement if aborted
      let timer = setTimeout(() => { controller.abort()}, 1000)
      const res = await axiosConfig.post(`/${newCode}`, null,  { signal: controller.signal });
      clearTimeout(timer);

      if (res.data.success)
        return LobbyCreationStatus.SUCCESS;
      else
        return LobbyCreationStatus.RETRY_ERROR;
    }
    catch(err) {
      return LobbyCreationStatus.FAIL_ERROR;
    }
  }
  
  // create a lobby and load it. Throw an error if applicable
  let createLobby = async (e) => {
    e.preventDefault();

    // wait till this async func completes before starting a new one
    if (isCreatingLobby)
      return;
    isCreatingLobby = true;
    
    // invalid username error
    if (name == "") {
      updateErrorMsg("Please enter a name before joining a lobby");
      isCreatingLobby = false; 
      return;
    }

    // try to create lobby with unique code
    let status = LobbyCreationStatus.RETRY_ERROR;
    let newCode;
    while (status == LobbyCreationStatus.RETRY_ERROR) {
      newCode = generateLobbyCode();
      status = await tryToCreateLobby(newCode);
    }

    // add user to lobby and load it
    if (status == LobbyCreationStatus.SUCCESS) {
      axiosConfig
      .post(`/${newCode}/user`, {
        name:name
      })
      .then(res => {
          if (res.data.success) {
            const nextPageLocation = {
              pathname: `${newCode}/conductor`,
              state: {
                name: name,
                lobby: newCode,
              },
            };
            isCreatingLobby = false; 
            history.push(nextPageLocation);
        }
      })
      .catch(() => {
        updateErrorMsg("Network Error. Couldn't connect to server");
        isCreatingLobby = false; 
      })
    }
    else if (status == LobbyCreationStatus.FAIL_ERROR) {
      updateErrorMsg("Network Error. Couldn't connect to server");
      isCreatingLobby = false; 
    }
  };

  return (
    <div>
      <div class="row min-vh-100">
        <div class="col-sm"></div>
        <div class="col-sm my-auto float-none text-center pt-5">
          <img
            src={whiteLogo}
            alt="..."
            class="img m-auto float-none mb-4"
            width="150"
          />
          <form>
            <div class="form-group w-50 text-center m-auto float-none ">
              <input
                type="text"
                class="form-control font-monospace fs-5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="example"
                aria-describedby="emailHelp"
                placeholder="Enter name"
              />
            </div>
            <div class="pt-3 text-center">
              <LobbyButton
                onClick={(e) => createLobby(e)}>
                Create Lobby
              </LobbyButton>
            </div>
            <Or>OR</Or>
            <div class="pt-3 text-center">
              <LobbyCode
                value={code}
                onChange={(e) => joinLobby(e.target.value.toUpperCase(), false)}
                placeholder="Enter Code"
              />  
              <JoinButton
                 onClick={(e) => {
                  e.preventDefault();
                  joinLobby(code, true);}}>
                Join
              </JoinButton>
            </div>
          </form> 
        </div>
        <div class="col-sm"></div>
        
        <ErrorDiv>
            <ErrorMsg>{errorMsg}</ErrorMsg>
          </ErrorDiv>
      </div>
    </div>
  );
};
const LobbyButton = styled.button`
  type: text; 
  background-color: #64aee3;
  border: 0px solid #000000;
  border-radius: 5px;c
  text-align: center
  width: 14vw
  color: #000000;
  font-family: monospace
  font-size: 18px
  height: 40px;

  :hover {
    background-color: #3d85c6;
    border:  1px solid #ffffff;
    color: #ffffff;
  }
`;

const JoinButton = styled.button`
  type: text; 
  background-color: #c45897;
  border: 0px solid #000000;
  border-radius: 5px;
  padding: 0px 0px
  margin: -10px 0px 0px 5px
  width: 4vw
  color: #ffffff;
  font-family: monospace
  height: 40px;

  :hover {
    background-color: #943784;
    border:  1px solid #ffffff;
    color: #ffffff;
  }
`;

const LobbyCode = styled.input`
  type: text; 
  background-color: #4743b5;
  border: 0px solid #000000;
  border-radius: 5px;
  text-align: center
  margin: -10px 0px
  width: 8vw
  color: #ffffff;
  font-family: monospace
  height: 40px;

  ::placeholder {
    text: hi;
    color: #ffffff;
  }
`;

const ErrorDiv = styled.div`
  text-align: center
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 4vw;
  center:50%;
`;

const ErrorMsg = styled.h5`
  text-align: center
  color: #ffffff;
  font-family: monospace
`;

const Or = styled.h5`
  text-align: center
  color: #ffffff;
  font-family: monospace
  margin: 10px 0px;
`;

export default HomePage;
