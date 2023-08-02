import React, { useContext } from "react";
import "./UserCard.css";
import { UserContext } from "../../UserContext.js";
import Tilt from "react-parallax-tilt";
import { RANKING_COLORS } from "../../constants/config.js";

export default function UserCard() {
  const { user } = useContext(UserContext);
  return (
    <Tilt
      style={{ height: 500, width: 300 }}
      tiltReverse={true}
      scale={1.1}
      glareEnable={true}
      glareMaxOpacity={0.8}
      glareColor="#ffffff"
      glarePosition="bottom"
      glareBorderRadius="20px"
    >
      <div className="rainbow card">
        <img className="avatar" src={user.titlePhoto} alt={user.username} />
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
    </Tilt>
  );
}
