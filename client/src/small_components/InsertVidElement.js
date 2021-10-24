import React, { useState } from "react";
import axiosConfig from "../configs/axiosconfigs";
import { useLocation } from "react-router";

const YoutubeFrame = () => {
  const [embeddedLink, setEmbeddedLink] = useState("");
  const { lobby, name } = useLocation().state;

  const changeEmbeddedLink = (e) => {
    const link = e.target.value;
    setEmbeddedLink(link);
    axiosConfig
      .put(`${lobby}/embeddedLink`, {
        name: name,
        embeddedLink: link,
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div>
      <div className="video-responsive mt-5">
        <input
          type="text"
          class="form-control w-25 m-auto float-center mt-3"
          value={embeddedLink}
          onChange={(e) => changeEmbeddedLink(e)}
          aria-describedby="emailHelp"
          placeholder="Enter Embedded Youtube Link"
        />
        <div class="embed-responsive embed-responsive-16by9 mt-4 mb-4">
          <iframe
            class="embed-responsive-item"
            src={embeddedLink}
            frameborder="0"
            width="850"
            height="480"
            allowfullscreen
            title="video"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default YoutubeFrame;
