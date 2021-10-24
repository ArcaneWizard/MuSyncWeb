import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import ListPlayers from "../medium_components/ListPlayers";
import AudioRecorder from "../medium_components/AudioRecorder";
import axiosConfig from "../configs/axiosconfigs";

const AudioConductorPage = () => {
  const { id } = useParams();
  const { lobby, name } = useLocation().state;

  useEffect(() => {
    stopAllRecordings();
  });

  const startAllRecordings = () => {
    axiosConfig
      .put(`${lobby}/beginRecording`, {
        name: `${name}`,
      })
      .catch((err) => console.log(err.message));
  };

  const stopAllRecordings = () => {
    axiosConfig
      .put(`${lobby}/endRecording`, {
        name: `${name}`,
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="text-center">
      <h1 className="text-black pt-5 mb-5">{id}</h1>
      <div class="row pt-lg-4 mt-5">
        <button
          type="button"
          class="btn btn-primary m-auto float-none"
          onClick={() => startAllRecordings()}
          style={{ width: 200 }}
        >
          Start Recording
        </button>
        <button
          type="button"
          class="btn btn-secondary m-auto float-none"
          onClick={() => stopAllRecordings()}
          style={{ width: 200 }}
        >
          Stop Recording
        </button>
        <AudioRecorder />
        <div className="fixed-bottom mb-5">
          <ListPlayers />
        </div>
      </div>
    </div>
  );
};

export default AudioConductorPage;
