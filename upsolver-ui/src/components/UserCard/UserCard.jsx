import React, { useContext } from "react";
import "./UserCard.css";
import { UserContext } from "../../UserContext.js";
import Tilt from "react-parallax-tilt";
import { RANKING_COLORS } from "../../constants/config.js";

export default function UserCard() {
  const { user } = useContext(UserContext);
  const [frontVisible, setFrontVisible] = React.useState(true);
  return (
    <Tilt
      style={{ height: 500, width: 300 }}
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      tiltReverse={true}
      scale={1.1}
      glareEnable={true}
      glareMaxOpacity={0.8}
      glareColor="#ffffff"
      glarePosition="bottom"
      glareBorderRadius="20px"
      flipHorizontally={!frontVisible}
    >
      <button
        className="flip-button"
        onClick={() => setFrontVisible(!frontVisible)}
      >
        <div className="rainbow card">
          {frontVisible ? (
            <div className="front">
              <img
                className="avatar"
                src={user.titlePhoto}
                alt={user.username}
              />
              <div className="card-content">
                <div className="content-header">
                  <h1 className="name">{user.name}</h1>
                  <h2
                    className="username"
                    style={{ color: RANKING_COLORS[user.rank] }}
                  >
                    {user.username}
                  </h2>
                </div>
                <div className="content-footer">
                  <p className="member-since">
                    Member Since{" "}
                    <span className="date">
                      {new Date(user.createdAt).toLocaleString([], {
                        year: "2-digit",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="back">
              <div className="card-content">
                <div className="content-header">
                  <h1 className="country">{"Country: " + user.country}</h1>
                  <h2 className="city">{"City: " + user.city}</h2>
                </div>
              </div>
            </div>
          )}
        </div>
      </button>
    </Tilt>
  );
}
