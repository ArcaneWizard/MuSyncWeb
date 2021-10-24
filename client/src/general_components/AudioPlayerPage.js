import React from "react";
import { useLocation, useParams } from "react-router";
import ListPlayers from "../medium_components/ListPlayers";

const AudioPlayerPage = () => {
  const { id } = useParams();
  const location = useLocation();

  console.log(location.state);

  return (
    <div className="text-center">
      <h1 className="text-black pt-5">{id}</h1>
      <div class="row pt-lg-4"></div>

      <div className="fixed-bottom mb-5">
        <ListPlayers />
      </div>
    </div>
  );
};

export default AudioPlayerPage;
