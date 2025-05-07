import React, { useState, useRef } from 'react';
import '../styles/GoalsScreen.css';

function GoalsScreen({ onNext }) {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [startX, setStartX] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardsContainerRef = useRef(null);
  
  const goals = [
    {
      id: 'loss',
      title: 'Снижение',
      description: 'Сжигание лишнего жира и снижение веса',
      color: '#FF3B30',
      icon: '🔥'
    },
    {
      id: 'maintenance',
      title: 'Поддержание',
      description: 'Сохранение текущего веса и формы',
      color: '#4CAF50',
      icon: '🥗'
    },
    {
      id: 'gain',
      title: 'Набор',
      description: 'Увеличение мышечной массы и силы',
      color: '#FFCC00',
      icon: '💪'
    }
  ];

  const handleTouchStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    
    if (Math.abs(diff) > 50) { // Threshold for card change
      if (diff > 0 && currentIndex > 0) {
        // Swipe right - go to previous card
        setCurrentIndex(currentIndex - 1);
      } else if (diff < 0 && currentIndex < goals.length - 1) {
        // Swipe left - go to next card
        setCurrentIndex(currentIndex + 1);
      }
      setIsDragging(false);
      setSelectedGoal(goals[currentIndex].id);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleCardClick = (goalId, index) => {
    setSelectedGoal(goalId);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (selectedGoal) {
      onNext(selectedGoal);
    }
  };

  const renderGoalCard = (goal, index) => {
    const isActive = index === currentIndex;
    const position = index - currentIndex;
    
    const cardStyle = {
      transform: `scale(${isActive ? 1 : 0.85}) translateX(${position * 100}%)`,
      opacity: isActive ? 1 : 0.5,
      zIndex: isActive ? 2 : 1,
      backgroundColor: goal.color
    };

    return (
      <div 
        key={goal.id}
        className={`goal-card ${isActive ? 'active' : ''}`}
        style={cardStyle}
        onClick={() => handleCardClick(goal.id, index)}
      >
        <div className="goal-icon">{goal.icon}</div>
        <h2 className="goal-title">{goal.title}</h2>
        <p className="goal-description">{goal.description}</p>
      </div>
    );
  };

  return (
    <div className="goals-screen">
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '60%' }}></div>
        </div>
      </div>

      <div className="content">
        <h1 className="title">Цели</h1>
        <p className="subtitle">
          Нам нужна эта информация для расчета вашей нормы калорий
        </p>

        <div 
          className="goals-container"
          ref={cardsContainerRef}
          onMouseDown={handleTouchStart}
          onTouchStart={handleTouchStart}
          onMouseMove={handleTouchMove}
          onTouchMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchEnd={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <div className="goals-carousel">
            {goals.map((goal, index) => renderGoalCard(goal, index))}
          </div>
        </div>

        <div className="dots-indicator">
          {goals.map((goal, index) => (
            <div 
              key={goal.id} 
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleCardClick(goal.id, index)}
            />
          ))}
        </div>
      </div>

      <button 
        className={`next-button ${!selectedGoal ? 'disabled' : ''}`}
        onClick={handleNext}
        disabled={!selectedGoal}
      >
        Дальше
      </button>
    </div>
  );
}

export default GoalsScreen; 