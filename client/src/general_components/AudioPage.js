import React from "react";
import { useLocation, useParams } from "react-router";

const AudioPage = () => {
  const { id } = useParams();
  const location = useLocation();

  console.log(location.state);

  return (
    <div className="text-center">
      <h1 className="text-black pt-5">{id}</h1>
      <div class="row pt-lg-4">
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
      </div>
    </div>
  );
};

export default AudioPage;
