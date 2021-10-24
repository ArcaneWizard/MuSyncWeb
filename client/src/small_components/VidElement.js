import React from "react";

const VidElement = ({ embeddedLink }) => {
  return (
    <div>
      <div className="video-responsive mt-5">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe
            class="embed-responsive-item"
            src={embeddedLink}
            frameborder="0"
            width="1000"
            height="560"
            allowfullscreen
            title="video"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VidElement;
