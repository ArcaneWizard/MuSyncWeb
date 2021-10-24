import React from "react";
import axios from "../configs/axiosconfigs";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";

const ListPlayers = () => {
  const { state } = useLocation();
  const { lobby } = state;

  const [players, updatePlayers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`/${lobby}/users`)
        .then((res) => {
          updatePlayers(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 2000);

    return () => clearInterval(interval);
  });

  return (
    <div class="">
      <h3 class=" text-white mb-4">Participants</h3>
      <ul class=" container-fluid float-none m-auto d-flex">
        {players.map((player, index) => (
          <p
            className="fw-bold font-monospace bg-transparent 
            text-white w-100 float-none m-auto"
            key={index}
          >
            {player.name}
          </p>
        ))}
      </ul>
    </div>
  );
};

export default ListPlayers;
