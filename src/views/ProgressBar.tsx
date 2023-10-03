import React from "react";

interface Props {
  value: number;
}

const ProgressBar: React.FC<Props> = ({ value }) => {
  const colors = ["#FF0000", "#FF4500", "#FFA500", "#FFFF00", "#00FF00", "#008000"];
  const colorIndex = Math.floor(value / 20);
  const color = colors[colorIndex];

  const backgroundStyle = {
    width: "10rem",
    height: "7px",
    marginTop: "1.4rem",
    marginLeft: "1rem",
    backgroundColor: "#ddd",
  };

  const progressStyle = {
    width: `${value}%`,
    height: "100%",
    backgroundColor: color,
  };

  return (
    <div className="friends-progress-bar" style={backgroundStyle}>
      <div style={progressStyle}></div>
    </div>
  );
};

export default ProgressBar;
