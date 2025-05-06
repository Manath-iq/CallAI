import { useState, useRef, useEffect } from 'react';
import './App.css';
import telegram, { initTelegramWebApp, isTelegramWebAppAvailable } from './utils/telegramWebApp';
import GenderScreen from './components/GenderScreen';

// Экраны приложения
const SCREENS = {
  START: 'start',
  GENDER: 'gender'
};

function App() {
  // Состояние для отслеживания текущего экрана
  const [currentScreen, setCurrentScreen] = useState(SCREENS.START);
  
  // Состояние для данных профиля пользователя
  const [userProfile, setUserProfile] = useState({
    gender: null
  });

  // Состояния для слайдера
  const [started, setStarted] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [progressWidth, setProgressWidth] = useState('0%');
  const [isTelegramAvailable, setIsTelegramAvailable] = useState(false);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  
  // Инициализация Telegram Web App при загрузке компонента
  useEffect(() => {
    const telegramAvailable = isTelegramWebAppAvailable();
    setIsTelegramAvailable(telegramAvailable);
    
    if (telegramAvailable) {
      initTelegramWebApp();
      console.log('Telegram WebApp инициализирован');
    } else {
      console.log('Приложение запущено в обычном браузере');
    }
  }, []);

  // Обновляем ширину индикатора прогресса при изменении позиции слайдера
  useEffect(() => {
    if (trackRef.current && sliderRef.current) {
      const maxX = trackRef.current.clientWidth - sliderRef.current.offsetWidth;
      const progressPercent = (sliderPosition / maxX) * 100;
      setProgressWidth(`${progressPercent}%`);
    }
  }, [sliderPosition]);

  // Автоматически заполняем слайдер, если пользователь протянул его более чем на 75%
  useEffect(() => {
    if (isDragging && trackRef.current && sliderRef.current) {
      const maxX = trackRef.current.clientWidth - sliderRef.current.offsetWidth;
      
      // Если слайдер протянули более чем на 75% пути
      if (sliderPosition > maxX * 0.75) {
        // Автоматически заполняем до конца
        setSliderPosition(maxX);
        handleStart();
        setIsDragging(false);
      }
    }
  }, [sliderPosition, isDragging]);

  // Добавляем дополнительный эффект при достижении слайдером цели
  useEffect(() => {
    if (sliderPosition > 0 && trackRef.current && sliderRef.current) {
      const maxX = trackRef.current.clientWidth - sliderRef.current.offsetWidth;
      
      // Если слайдер достиг конца
      if (sliderPosition >= maxX) {
        // Здесь можно добавить визуальный или звуковой эффект завершения
        const track = trackRef.current;
        track.classList.add('completed');
        
        setTimeout(() => {
          track.classList.remove('completed');
        }, 300);
      }
    }
  }, [sliderPosition]);

  // Обработчик клика на кнопку "Давай начнем"
  const handleStart = () => {
    if (started) return; // Предотвращаем повторный запуск
    
    setStarted(true);
    console.log('Приложение запущено!');
    
    // Переходим к экрану выбора пола
    setTimeout(() => {
      setCurrentScreen(SCREENS.GENDER);
    }, 500);
    
    // Можно отправить данные в Telegram Bot при нажатии кнопки
    if (isTelegramAvailable && telegram.isExpanded) {
      // Опционально: отправляем данные в вызывающее приложение/бота
      // telegram.sendData(JSON.stringify({ action: 'start' }));
    }
  };

  // Обработчик для экрана выбора пола
  const handleGenderSelect = (gender) => {
    setUserProfile(prev => ({
      ...prev,
      gender
    }));
    // Здесь будет переход к следующему экрану
    console.log(`Выбран пол: ${gender}`);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие к обработчику трека
    setIsDragging(true);
    setStarted(false);
    
    // Добавляем класс dragging для трека при активации ползунка
    if (trackRef.current) {
      trackRef.current.classList.add('dragging');
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !sliderRef.current || !trackRef.current) return;

    e.preventDefault(); // Предотвращаем прокрутку страницы
    
    const track = trackRef.current.getBoundingClientRect();
    const thumbWidth = sliderRef.current.offsetWidth;
    const maxX = track.width - thumbWidth;
    
    let clientX;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const trackX = clientX - track.left;
    let newPosition = Math.max(0, Math.min(trackX, maxX));
    
    setSliderPosition(newPosition);
  };

  const handleTouchEnd = () => {
    if (isDragging && trackRef.current && sliderRef.current) {
      setIsDragging(false);
      
      // Удаляем класс dragging при завершении
      trackRef.current.classList.remove('dragging');
      
      const maxX = trackRef.current.clientWidth - sliderRef.current.offsetWidth;
      
      // Если протащили более чем на 60% пути, считаем успешным
      if (sliderPosition >= maxX * 0.6) {
        setSliderPosition(maxX);
        handleStart();
      } else {
        // Иначе возвращаем в начальное положение
        setSliderPosition(0);
      }
    }
  };

  const handleTrackTouchStart = (e) => {
    if (!trackRef.current || !sliderRef.current) return;

    // Если пользователь нажал на трек, а не на ползунок,
    // то перемещаем ползунок в точку нажатия и начинаем перетаскивание
    const isDirectThumbTouch = e.target === sliderRef.current || sliderRef.current.contains(e.target);
    
    if (!isDirectThumbTouch) {
      const track = trackRef.current.getBoundingClientRect();
      const thumbWidth = sliderRef.current.offsetWidth;
      const maxX = track.width - thumbWidth;
      
      let clientX;
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }
      
      const trackX = clientX - track.left;
      let newPosition = Math.max(0, Math.min(trackX, maxX));
      
      setSliderPosition(newPosition);
      setIsDragging(true);
      setStarted(false);
      
      // Если это мышь, добавляем обработчики событий
      if (!e.touches) {
        document.addEventListener('mousemove', handleTouchMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    }
  };

  const handleMouseDown = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие к обработчику трека
    setIsDragging(true);
    setStarted(false);
    
    // Добавляем класс dragging для трека при активации ползунка
    if (trackRef.current) {
      trackRef.current.classList.add('dragging');
    }
    
    document.addEventListener('mousemove', handleTouchMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    handleTouchEnd(); // Используем ту же логику, что и для touch событий
    document.removeEventListener('mousemove', handleTouchMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Рендеринг текущего экрана
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case SCREENS.START:
        return (
          <div className="start-screen">
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
                  onTouchStart={handleTrackTouchStart}
                  onMouseDown={handleTrackTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="slider-progress" style={{ width: progressWidth }}></div>
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
        );
      
      case SCREENS.GENDER:
        return <GenderScreen onNext={handleGenderSelect} />;
      
      default:
        return <div>Неизвестный экран</div>;
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
