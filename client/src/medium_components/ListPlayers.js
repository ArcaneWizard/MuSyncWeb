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
          console.log(res.data);
          console.log(players.length);
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 700);

    return () => clearInterval(interval);
  });

  return (
    <div class="">
      <ul class="container float-none m-auto d-flex">
        {players.map((player, index) => (
          <p
            className="fw-bold font-monospace bg-transparent text-black w-75
            float-none m-auto"
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
