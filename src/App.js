import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

  const handleStart = () => {
    setStarted(true);
    console.log('Приложение запущено!');
    // Здесь будет код для перехода на следующий экран
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !sliderRef.current || !trackRef.current) return;

    const track = trackRef.current.getBoundingClientRect();
    const maxX = track.width - sliderRef.current.offsetWidth;
    
    let clientX;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const trackX = clientX - track.left;
    let newPosition = Math.max(0, Math.min(trackX, maxX));
    
    setSliderPosition(newPosition);
    
    // Если слайдер достиг правого края
    if (newPosition >= maxX * 0.9) {
      handleStart();
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      // Если не достигнута правая сторона, возвращаем в исходное положение
      if (sliderPosition < (trackRef.current.getBoundingClientRect().width - sliderRef.current.offsetWidth) * 0.9) {
        setSliderPosition(0);
      }
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleTouchMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleTouchMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Если не достигнута правая сторона, возвращаем в исходное положение
    if (sliderPosition < (trackRef.current.getBoundingClientRect().width - sliderRef.current.offsetWidth) * 0.9) {
      setSliderPosition(0);
    }
  };

  return (
    <div className="app">
      <div className="start-screen">
        <div className="background-waves"></div>
        <div className="content">
          <h1 className="title">
            <span className="black-text">Построй</span>
            <br />
            <span className="green-text">правильное</span>
            <br />
            <span className="black-text">питание</span>
          </h1>
          <div className="button-container">
            <div 
              className="slider-track" 
              ref={trackRef}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className={`slider-thumb ${isDragging ? 'dragging' : ''}`}
                ref={sliderRef}
                style={{ left: `${sliderPosition}px` }}
                onTouchStart={handleTouchStart}
                onMouseDown={handleMouseDown}
              >
                <span className="arrow-icon">›</span>
              </div>
              <div className="slider-text">Давай начнем</div>
              <div className="slider-arrows">›››</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
