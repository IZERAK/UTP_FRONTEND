import React from "react";
import "./style/title-rc.css"

const TitleRC = ({ text, className }) => {
  return <h1 className={className}>{text}</h1>;
};

export default TitleRC;