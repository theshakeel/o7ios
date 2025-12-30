import Styles from "./Card.module.css";
import React, { useState } from "react";
import CustomCard from "../CustomCard";
import { useNavigate } from "react-router-dom";

function Card({ index, item, pages, width, goToSlide, setGoToSlide }) {
  const [show, setShown] = useState(false);
  const [startXY, setStartXY] = useState(false);
  const [clickCheck, setClickCheck] = useState(false);
  const navigate = useNavigate();

  const handleMouseMove = async (event) => {
    const deltaXY = await {
      x: event?.changedTouches[0]?.clientX,
      y: event?.changedTouches[0]?.clientY,
    };
    if (!!startXY && !clickCheck && deltaXY.y > 185 && startXY.y > 185) {
      const direction = startXY.x > deltaXY.x + 80 ? 1 : startXY.x < deltaXY.x - 80 ? -1 : 0;
      setGoToSlide(goToSlide + direction);
      setShown(true);
      setStartXY(false);
    }
  };

  return (
    <div
      className={Styles.card}
      onTouchStart={(e) =>
        setStartXY({ x: e?.touches[0]?.clientX, y: e?.touches[0]?.clientY })
      }
      onTouchEnd={handleMouseMove}
      onClick={() => navigate(`/event-details/${item.slug}`)}
    >
      <CustomCard goToSlide={goToSlide} key={index} data={item} />
    </div>
  );
}

export default Card;
