import React, { useRef, useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";
import axiosConfig from "../configs/axiosconfigs";
import { useLocation } from "react-router";

const AudioRecorder = () => {
  const { state } = useLocation();
  const { lobby, name } = state;
  const [recordingState, updateRecordingState] = useState("ended");
  const [prevRecordingState, updatePrevRecordingState] = useState("ended");

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({ video: false });

  const audio = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      axiosConfig
        .get(`/${lobby}/getRecordingState`)
        .then((res) => {
          updatePrevRecordingState(recordingState);
          updateRecordingState(res.data);
          checkRecordingState();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, 500);

    return () => clearInterval(interval);
  });

  const checkRecordingState = () => {
    if (recordingState == "in progress" && prevRecordingState == "ended")
      beginRecording();
    else if (recordingState == "ended" && prevRecordingState == "in progress")
      endRecording();
  };

  const beginRecording = () => {
    console.log("client recording has begun");
    startRecording();
    audio.current.pause();
  };

  const endRecording = () => {
    console.log("client recording has ended");
    stopRecording();
    setTimeout(() => {
      axios({
        baseURL: "",
        method: "get",
        url: audio.current.src,
        responseType: "blob",
      }).then((res) => {
        const reader = new FileReader();
        reader.readAsDataURL(res.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          const base64file = base64data.split(",")[1];
          console.log(base64file);

          if (base64file != "") {
            axiosConfig
              .put(`${lobby}/user/audio`, {
                name: `${name}`,
                audioFile: base64file,
              })
              .then((res) => res.json)
              .catch((err) => console.log(err.message));
          }
        };
      });
    });
  };

  return (
    <div>
      <audio ref={audio} src={mediaBlobUrl} controls />
    </div>
  );
};

export default AudioRecorder;
