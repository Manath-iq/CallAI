import React, { useState, useRef, useEffect } from 'react';
import '../styles/WeightHeightScreen.css';

function WeightHeightScreen({ onNext }) {
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(178);
  const [isWeightDragging, setIsWeightDragging] = useState(false);
  const [isHeightDragging, setIsHeightDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  
  const weightContainerRef = useRef(null);
  const heightContainerRef = useRef(null);

  // Handle weight slider interactions
  const handleWeightTouchStart = (e) => {
    setIsWeightDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleWeightTouchMove = (e) => {
    if (!isWeightDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    
    if (Math.abs(diff) > 10) { // Threshold to prevent micro adjustments
      const weightChange = Math.floor(diff / 20); // Adjust sensitivity
      if (weightChange !== 0) {
        setWeight(prevWeight => {
          const newWeight = Math.max(30, Math.min(200, prevWeight - weightChange));
          return newWeight;
        });
        setStartX(clientX);
      }
    }
  };

  const handleWeightTouchEnd = () => {
    setIsWeightDragging(false);
  };

  // Handle height slider interactions - изменено на горизонтальное перетаскивание для соответствия дизайну
  const handleHeightTouchStart = (e) => {
    setIsHeightDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleHeightTouchMove = (e) => {
    if (!isHeightDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    
    if (Math.abs(diff) > 10) { // Threshold to prevent micro adjustments
      const heightChange = Math.floor(diff / 20); // Adjust sensitivity
      if (heightChange !== 0) {
        setHeight(prevHeight => {
          const newHeight = Math.max(100, Math.min(250, prevHeight - heightChange));
          return newHeight;
        });
        setStartX(clientX);
      }
    }
  };

  const handleHeightTouchEnd = () => {
    setIsHeightDragging(false);
  };

  // Handle direct weight change
  const handleWeightClick = (e) => {
    const containerRect = weightContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX || e.touches[0].clientX;
    const containerWidth = containerRect.width;
    const clickPosition = (clickX - containerRect.left) / containerWidth;
    
    // If clicking on the left third, decrease weight
    if (clickPosition < 0.33) {
      setWeight(prevWeight => Math.max(30, prevWeight - 1));
    } 
    // If clicking on the right third, increase weight
    else if (clickPosition > 0.66) {
      setWeight(prevWeight => Math.min(200, prevWeight + 1));
    }
  };

  // Handle direct height change
  const handleHeightClick = (e) => {
    const containerRect = heightContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX || e.touches[0].clientX;
    const containerWidth = containerRect.width;
    const clickPosition = (clickX - containerRect.left) / containerWidth;
    
    // If clicking on the left third, decrease height
    if (clickPosition < 0.33) {
      setHeight(prevHeight => Math.max(100, prevHeight - 1));
    } 
    // If clicking on the right third, increase height
    else if (clickPosition > 0.66) {
      setHeight(prevHeight => Math.min(250, prevHeight + 1));
    }
  };

  const handleNext = () => {
    onNext({ weight, height });
  };

  // Add event listeners for when the user drags outside the components
  useEffect(() => {
    const handleMouseUp = () => {
      setIsWeightDragging(false);
      setIsHeightDragging(false);
    };

    const handleMouseMove = (e) => {
      if (isWeightDragging) {
        handleWeightTouchMove(e);
      }
      if (isHeightDragging) {
        handleHeightTouchMove(e);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
    };
  }, [isWeightDragging, isHeightDragging]);

  return (
    <div className="weight-height-screen">
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '40%' }}></div>
        </div>
      </div>

      <div className="content">
        <h1 className="title">Вес и рост</h1>
        <p className="subtitle">
          Нам нужна эта информация для расчета вашей нормы калорий
        </p>

        <div 
          className="weight-container"
          ref={weightContainerRef}
          onMouseDown={handleWeightTouchStart}
          onTouchStart={handleWeightTouchStart}
          onMouseUp={handleWeightTouchEnd}
          onTouchEnd={handleWeightTouchEnd}
          onClick={handleWeightClick}
        >
          <div className="weight-header">Вес</div>
          <div className="weight-slider">
            <div className="weight-value-prev">{weight - 1} кг</div>
            <div className="weight-value-current">{weight} кг</div>
            <div className="weight-value-next">{weight + 1} кг</div>
          </div>
        </div>

        <div 
          className="height-container"
          ref={heightContainerRef}
          onMouseDown={handleHeightTouchStart}
          onTouchStart={handleHeightTouchStart}
          onMouseUp={handleHeightTouchEnd}
          onTouchEnd={handleHeightTouchEnd}
          onClick={handleHeightClick}
        >
          <div className="height-header">Рост</div>
          <div className="height-slider">
            <div className="height-value-prev">{height - 1} см</div>
            <div className="height-value-current">{height} см</div>
            <div className="height-value-next">{height + 1} см</div>
          </div>
          <div className="ruler-markings"></div>
        </div>
      </div>

      <button 
        className="next-button"
        onClick={handleNext}
      >
        Дальше
      </button>
    </div>
  );
}

export default WeightHeightScreen; 