import React from "react";
import { useLocation, useParams } from "react-router";
import ListPlayers from "../medium_components/ListPlayers";

const AudioConductorPage = () => {
  const { id } = useParams();
  const location = useLocation();

  console.log(location.state);

  return (
    <div className="text-center">
      <h1 className="text-black pt-5 mb-5">{id}</h1>
      <div class="row pt-lg-4 mt-5">
        <button
          type="button"
          class="btn btn-primary m-auto float-none"
          style={{ width: 200 }}
        >
          Start Recording
        </button>
        <button
          type="button"
          class="btn btn-secondary m-auto float-none"
          style={{ width: 200 }}
        >
          Start Playing
        </button>
        <div className="fixed-bottom mb-5">
          <ListPlayers />
        </div>
      </div>
    </div>
  );
};

export default AudioConductorPage;
