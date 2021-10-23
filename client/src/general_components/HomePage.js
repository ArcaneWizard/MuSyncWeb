import React from "react";
import { useHistory } from "react-router";
import GameImagePreview from "../medium_components/GameImagePreview";

const HomePage = () => {
  var bob = [2, 3, 4];
  const history = useHistory();

  const ChangeToAnotherPage = () => {
    const location = {
      pathname: "/another",
      state: { Lucario: "awesome" },
    };

    history.push(location);
  };

  return (
    <div class="container mt-5">
      <div class="row">
        <div class="col-1">SORT BY Labels</div>
        <div class="col-sm">
          {bob.map((element, index) => (
            <GameImagePreview key={index} />
          ))}
        </div>
        <div class="col-sm">
          <button
            className="btn btn-danger"
            onClick={() => ChangeToAnotherPage()}
          >
            Delete
          </button>
        </div>
        <div class="col-sm">Creator, Testing Duration and Testing Wanted</div>
      </div>
    </div>
  );
};

export default HomePage;
