  import Carousel from "react-spring-3d-carousel";
  import { useState, useEffect } from "react";
  import { config } from "react-spring";
  import "./Card.module.css";
  import { useSelector } from "react-redux";
  import { selectEventsData } from "../../store/slice/events";

  export default function Carroussel(props) {
    const table = props?.cards || [];
    const eventsData = useSelector(selectEventsData);
    const [offsetRadius, setOffsetRadius] = useState(2);
    const [showArrows, setShowArrows] = useState(false);
    const cards = [...table];
    let screenWidth = window.innerWidth;
    function updateLeftProperty() {
      screenWidth = window.innerWidth;
    }
    window.addEventListener("resize", updateLeftProperty);
    const style1 = (child) => {
      child.className = 'css-1fzpoyk css-1fzpoyk1 '
      // left: -15vw;
      child.style = `
      left: 0;
      width: 60vw;
      display: flex;
      position: absolute;
      top: 50%;
      align-items: center;
      transition: 0.2s ease-in-out;
      transform: translateY(-50%) translateX(-75%) scale(0.8);
      opacity: 0.25
      `
    };
    // animation: slideLeft 0.3s ease-in-out;
    const style2 = (child) => {
      child.className = 'css-1fzpoyk css-1fzpoyk2 '
      // left: ${screenWidth < 325 ? '50%' : screenWidth < 400 ? '49.3%' : '48.5%'};
      child.style = `
      left: 0;
      width: 60vw;
      display: flex;
      position: absolute;
      top: 50%;
      alignItems: center;
      transition: 0.2s ease-in-out;
      transform: translateY(-50%) translateX(28%) scale(1);
      `
      // child.style.animation = slideRight 0.3s ease-in-out;
    };
    const style3 = (child) => {
      child.className = 'css-1fzpoyk css-1fzpoyk3' 
      // left: 107vw;
      child.style = `
      left: 0;
      width: 60vw;
      display: flex;
      position: absolute;
      top: 50%;
      alignItems: center;
      position: absolute;
      transition: 0.2s ease-in-out;
      transform: translateY(-50%) translateX(129%) scale(0.8);
      opacity: 0.25
      `
      // child.style.animation = slideRight 0.3s ease-in-out;
    };
    const changeStyle = () => {
      const parentDiv = document.querySelector(".css-doq0dk");
      if (parentDiv) {
        const childElements = parentDiv.children;
        if (childElements?.length == 1) style2(childElements[0]);
        else
          for (let i = 0; i < childElements.length; i++) {
            const child = childElements[i];
            switch (i) {
              case 0:
                style1(child);
                break;
              case 1:
                style2(child);
                break;
              case 2:
                style3(child);
                break;
              default:
                break;
            }
          }
      }
    };
    useEffect(() => {
      const intervalId = setInterval(() => {
        changeStyle();
      }, 10);
      setTimeout(() => {
        clearInterval(intervalId);
        changeStyle();
      }, 800);
    }, [props?.goToSlide, eventsData]);

    useEffect(() => {
      setOffsetRadius(props.offset);
      setShowArrows(props.showArrows);
    }, [props.offset, props.showArrows]);

    return (
      <div
        style={{ width: props.width, height: props.height, margin: props.margin }}
      >
        <Carousel
          slides={cards}
          goToSlide={props.goToSlide}
          offsetRadius={offsetRadius}
          showNavigation={showArrows}
          animationConfig={config.gentle}
        />
      </div>
    );
  }
