// React import
import React from "react";
// Jumbotron component import
import Jumbotron from "../components/Jumbotron";

// Just a jsx page for unusual routes
const NoMatch = () => {
  return (
    <div>
      <Jumbotron>
        <h1>404 Page Not Found</h1>
        <h1>
          <span role="img" aria-label="Face With Rolling Eyes Emoji">
            🙄
          </span>
        </h1>
      </Jumbotron>
    </div>
  );
};

export default NoMatch;
