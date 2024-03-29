import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import AudioRecorder from "../medium_components/AudioRecorder";
import ListPlayers from "../medium_components/ListPlayers";
import VidElement from "../small_components/VidElement";
import axiosConfig from "../configs/AxiosConfigs";

const AudioPlayerPage = () => {
  const { id } = useParams();
  const { lobby, name } = useLocation().state;
  const [embeddedLink, setEmbeddedLink] = useState("");

  useEffect(() => {
    axiosConfig
    .post(`/${lobby}/user`, {
      name:name
    });
    
    const interval = setInterval(() => {
      axiosConfig
      .post(`/${lobby}/user`, {
        name:name
      });
      // axiosConfig
      //   .get(`/${lobby}/embeddedLink`)
      //   .then((link) => {
      //     console.log(link.data);
      //     setEmbeddedLink(link.data);
      //   })
      //   .catch((err) => {
      //     console.log(err.message);
      //   });
    }, 1500);


    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {clearInterval(interval); console.log("hehehehe"); handleBeforeUnload();}
  }, []);

  const handleBeforeUnload = () => {
    console.log(lobby + ", " + name + ", high");
    axiosConfig.delete(`${lobby}`,{
      params: {
        name: `${name}`
      }
    });
  }

  return (
    <div className="text-center">
      <h5 className="text-white pt-5">Lobby Code:</h5>
      <h1 className="text-white mb-5">{id}</h1>
      <div class="row pt-lg-4"></div>

      <div className="fixed-bottom mb-5">
        <ListPlayers />
      </div>
      <AudioRecorder />
      <VidElement embeddedLink={embeddedLink} />
    </div>
  );
};

export default AudioPlayerPage;
