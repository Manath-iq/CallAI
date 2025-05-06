import React, { useState } from 'react';
import '../styles/GenderScreen.css';

function GenderScreen({ onNext }) {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const handleNext = () => {
    if (selectedGender) {
      onNext(selectedGender);
    }
  };

  return (
    <div className="gender-screen">
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '20%' }}></div>
        </div>
      </div>

      <div className="content">
        <h1 className="title">Гендер</h1>
        <p className="subtitle">
          Нам нужна эта информация для расчета вашей нормы калорий
        </p>

        <div className="gender-options">
          <div 
            className={`gender-option ${selectedGender === 'female' ? 'selected' : ''}`}
            onClick={() => handleGenderSelect('female')}
          >
            <span role="img" aria-label="Женщина" className="gender-emoji">🙋‍♀️</span>
          </div>
          <div 
            className={`gender-option ${selectedGender === 'male' ? 'selected' : ''}`}
            onClick={() => handleGenderSelect('male')}
          >
            <span role="img" aria-label="Мужчина" className="gender-emoji">🙋‍♂️</span>
          </div>
        </div>
      </div>

      <button 
        className={`next-button ${!selectedGender ? 'disabled' : ''}`}
        onClick={handleNext}
        disabled={!selectedGender}
      >
        Дальше
      </button>
    </div>
  );
}

export default GenderScreen; 