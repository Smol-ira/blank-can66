import { useTelegram } from '@/hooks/useTelegram';
import { useEffect } from 'react';

const Index = () => {
  const { user, isReady, colorScheme, themeParams, showMainButton, hapticFeedback, showAlert } = useTelegram();

  useEffect(() => {
    if (isReady) {
      showMainButton('Начать', () => {
        hapticFeedback('success');
        showAlert('Добро пожаловать в Mini App!');
      });
    }
  }, [isReady, showMainButton, hapticFeedback, showAlert]);

  // Apply Telegram theme colors
  const bgColor = themeParams.bg_color || (colorScheme === 'dark' ? '#1f2937' : '#ffffff');
  const textColor = themeParams.text_color || (colorScheme === 'dark' ? '#ffffff' : '#1f2937');
  const hintColor = themeParams.hint_color || (colorScheme === 'dark' ? '#9ca3af' : '#6b7280');
  const secondaryBg = themeParams.secondary_bg_color || (colorScheme === 'dark' ? '#374151' : '#f3f4f6');

  return (
    <div 
      className="min-h-screen p-4"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
               style={{ backgroundColor: secondaryBg }}>
            🚀
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Telegram Mini App
          </h1>
          <p style={{ color: hintColor }}>
            Приложение работает внутри Telegram
          </p>
        </div>

        {/* User Info Card */}
        <div 
          className="rounded-xl p-4 space-y-3"
          style={{ backgroundColor: secondaryBg }}
        >
          <h2 className="font-semibold text-lg">👤 Информация о пользователе</h2>
          
          {user ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ color: hintColor }}>Имя:</span>
                <span className="font-medium">
                  {user.first_name} {user.last_name || ''}
                </span>
              </div>
              {user.username && (
                <div className="flex justify-between">
                  <span style={{ color: hintColor }}>Username:</span>
                  <span className="font-medium">@{user.username}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ color: hintColor }}>ID:</span>
                <span className="font-medium">{user.id}</span>
              </div>
              {user.language_code && (
                <div className="flex justify-between">
                  <span style={{ color: hintColor }}>Язык:</span>
                  <span className="font-medium">{user.language_code.toUpperCase()}</span>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: hintColor }}>
              Откройте это приложение через Telegram для получения данных пользователя
            </p>
          )}
        </div>

        {/* Theme Info */}
        <div 
          className="rounded-xl p-4 space-y-3"
          style={{ backgroundColor: secondaryBg }}
        >
          <h2 className="font-semibold text-lg">🎨 Тема</h2>
          <div className="flex justify-between">
            <span style={{ color: hintColor }}>Режим:</span>
            <span className="font-medium">
              {colorScheme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая'}
            </span>
          </div>
        </div>

        {/* Status */}
        <div 
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: secondaryBg }}
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isReady ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-yellow-500'}`} />
            {isReady ? 'Mini App готов' : 'Загрузка...'}
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-sm" style={{ color: hintColor }}>
          Нажмите кнопку внизу экрана, чтобы начать
        </p>
      </div>
    </div>
  );
};

export default Index;
