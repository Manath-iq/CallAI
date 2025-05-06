// Проверка, запущено ли приложение внутри Telegram WebApp
export const isTelegramWebAppAvailable = () => {
  return window.Telegram && window.Telegram.WebApp;
};

// Получаем глобальный объект телеграм
const telegram = isTelegramWebAppAvailable() ? window.Telegram.WebApp : null;

// Экспортируем для использования в других частях приложения
export default telegram;

// Функция для получения цветов темы Telegram
export const getTelegramThemeColors = () => {
  if (!isTelegramWebAppAvailable()) {
    return {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#98c93c',
      buttonTextColor: '#ffffff',
      hintColor: '#999999',
      linkColor: '#2481cc',
      isDarkMode: false
    };
  }

  const colors = {
    backgroundColor: telegram.backgroundColor || '#ffffff',
    textColor: telegram.textColor || '#000000',
    buttonColor: telegram.buttonColor || '#98c93c',
    buttonTextColor: telegram.buttonTextColor || '#ffffff',
    hintColor: telegram.hintColor || '#999999',
    linkColor: telegram.linkColor || '#2481cc',
    isDarkMode: telegram.colorScheme === 'dark'
  };
  
  return colors;
};

// Функция для применения цветовой схемы Telegram к CSS переменным
export const applyTelegramTheme = () => {
  const colors = getTelegramThemeColors();
  
  // Определяем CSS переменные на основе цветов Telegram
  document.documentElement.style.setProperty('--tg-bg-color', colors.backgroundColor);
  document.documentElement.style.setProperty('--tg-text-color', colors.textColor);
  document.documentElement.style.setProperty('--tg-button-color', colors.buttonColor);
  document.documentElement.style.setProperty('--tg-button-text-color', colors.buttonTextColor);
  document.documentElement.style.setProperty('--tg-hint-color', colors.hintColor);
  document.documentElement.style.setProperty('--tg-link-color', colors.linkColor);
  
  // Добавляем класс с цветовой схемой на документ
  if (colors.isDarkMode) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
};

// Функция для инициализации веб-приложения
export const initTelegramWebApp = () => {
  if (!isTelegramWebAppAvailable()) {
    console.log('Telegram WebApp не доступен. Приложение запущено в обычном браузере.');
    return;
  }

  // Раскрываем приложение на весь экран
  telegram.expand();
  
  // Применяем тему Telegram
  applyTelegramTheme();
  
  // Добавляем слушатель событий изменения темы
  telegram.onEvent('themeChanged', applyTelegramTheme);
  
  // Сообщаем Telegram, что приложение готово к отображению
  telegram.ready();
  
  // Проверка поддержки функции отключения вертикальных свайпов
  const isVerticalSwipesSupported = telegram.isVersionAtLeast('7.7');
  
  // Если поддерживается, отключаем вертикальные свайпы
  if (isVerticalSwipesSupported && telegram.setSwipeSettings) {
    telegram.setSwipeSettings({ vertical: false });
  } else {
    // Применяем альтернативное решение для отключения свайпов
    applySwipeFixFallback();
  }
};

// Альтернативное решение для отключения свайпов (если API недоступен)
export const applySwipeFixFallback = () => {
  if (!isTelegramWebAppAvailable()) {
    return;
  }
  
  const overflow = 100;
  
  // Настраиваем стили для body
  document.body.style.overflowY = 'hidden';
  document.body.style.marginTop = `${overflow}px`;
  document.body.style.height = `${window.innerHeight + overflow}px`;
  document.body.style.paddingBottom = `${overflow}px`;
  
  // Прокручиваем до нужной позиции
  window.scrollTo(0, overflow);
  
  // Обработчики событий для предотвращения закрытия при свайпе
  let touchStartY;
  
  const onTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };
  
  const onTouchMove = (e) => {
    const touchY = e.changedTouches[0].clientY;
    const scrollableEl = document.querySelector('.app'); // Основной контейнер приложения
    
    if (scrollableEl) {
      const scroll = scrollableEl.scrollTop;
      // Если мы в верхней части и свайпаем вниз - предотвращаем действие
      if (scroll <= 0 && touchStartY < touchY) {
        e.preventDefault();
      }
    } else {
      e.preventDefault();
    }
  };
  
  // Добавляем слушатели событий
  document.documentElement.addEventListener('touchstart', onTouchStart, { passive: false });
  document.documentElement.addEventListener('touchmove', onTouchMove, { passive: false });
}; 