import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import ListPlayers from "../medium_components/ListPlayers";
import AudioRecorder from "../medium_components/AudioRecorder";
import YoutubeFrame from "../small_components/InsertVidElement";
import axiosConfig from "../configs/AxiosConfigs";
import {processing, MergeAudioStatus} from "../audio_processing/MergeAudio";

const AudioConductorPage = () => {
  const { id } = useParams();
  const { lobby, name } = useLocation().state;
  const [ audioProcessingStatus, setProcessingStatus ] = useState("");

  
  useEffect(() => {
    console.log("sketch");
    const interval = setInterval(() => {
      setProcessingStatus(MergeAudioStatus)
    }, 100);

    return () => clearInterval(interval)
  }, []);

  const startAllRecordings = () => {
    console.log("start");
    axiosConfig
      .put(`${lobby}/beginRecording`, {
        name: `${name}`,
      })
      .catch((err) => console.log(err.message));
  };

  const stopAllRecordings = () => {
    console.log("stop");
    axiosConfig
      .put(`${lobby}/endRecording`, {
        name: `${name}`,
      })
      .then(
          axiosConfig
            .get(`${lobby}/userInfo`)
            .then((res) => processing(res.data))
            .catch(() => 
              setTimeout(() => {
                axiosConfig
                  .get(`${lobby}/userInfo`)
                  .then((res) => processing(res.data));
              }), 500)
      )
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="text-center">
      <h5 className="text-white pt-5">Lobby Code:</h5>
      <h1 className="text-white mb-5">{id}</h1>
      <div class="row pt-lg-4 mt-5">
        <button
          type="button"
          class="btn btn-primary m-auto float-none"
          onClick={() => startAllRecordings()}
          style={{ width: 200 }}
        >
          Start Recording
        </button>
        
      { <h1 className="text-white">{audioProcessingStatus}</h1> }
        <button
          type="button"
          class="btn btn-secondary m-auto float-none"
          onClick={() => stopAllRecordings()}
          style={{ width: 200 }}
        >
          Stop Recording
        </button>
        <div class="mt-5 container">
          <AudioRecorder />
        </div>
        <YoutubeFrame />

        <div className="fixed-bottom mb-5">
          <ListPlayers />
        </div>
      </div>
    </div>
  );
};

export default AudioConductorPage;
