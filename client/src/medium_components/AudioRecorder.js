import React, { useRef, useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";
import axiosConfig from "../configs/AxiosConfigs";
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
    
    const controller = new AbortController();
    const interval = setInterval(() => {
        
        axiosConfig
          .get(`/${lobby}/getRecordingState`)
          .then((res) => {
            console.log("updating recording state");
            updatePrevRecordingState(recordingState);
            updateRecordingState(res.data);
            actBasedOnRecordingState();
          })
          .catch((err) => {
            console.log("error with recoridng state");
            console.log(err.message);
          });
      }, 100);

    return () => {
      clearInterval(interval);
      controller.abort();
    }
  }, []);

  const actBasedOnRecordingState = () => {
  //  console.log("decide whether to begin or end recording");
  //  console.log(recordingState + ", " + prevRecordingState);
    if (recordingState == "in progress" && prevRecordingState != "in progress")
      beginRecording();
    else if (recordingState != "in progress" && prevRecordingState == "in progress")
      endRecording();
  };

  const beginRecording = () => {
    console.log("begin recording audio");
    startRecording();
    audio.current.pause();
  };

  const endRecording = () => {
    console.log("stop recording audio");
    stopRecording();
    setTimeout(() => {
      axios({
        method: "get",
        url: audio.current.src,
        responseType: "blob",
      }).then((res) => {
    console.log("woah");
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
