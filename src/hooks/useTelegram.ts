import { useCallback, useEffect, useState } from 'react';

// Telegram WebApp types
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    setText: (text: string) => void;
    enable: () => void;
    disable: () => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  colorScheme: 'light' | 'dark';
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegram = () => {
  const [isReady, setIsReady] = useState(false);
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      setIsReady(true);
    }
  }, [tg]);

  const user = tg?.initDataUnsafe?.user;
  const colorScheme = tg?.colorScheme ?? 'light';
  const themeParams = tg?.themeParams ?? {};

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (tg?.MainButton) {
      tg.MainButton.setText(text);
      tg.MainButton.show();
      tg.MainButton.onClick(onClick);
    }
  }, [tg]);

  const hideMainButton = useCallback(() => {
    if (tg?.MainButton) {
      tg.MainButton.hide();
    }
  }, [tg]);

  const showBackButton = useCallback((onClick: () => void) => {
    if (tg?.BackButton) {
      tg.BackButton.show();
      tg.BackButton.onClick(onClick);
    }
  }, [tg]);

  const hideBackButton = useCallback(() => {
    if (tg?.BackButton) {
      tg.BackButton.hide();
    }
  }, [tg]);

  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') => {
    if (tg?.HapticFeedback) {
      if (['light', 'medium', 'heavy'].includes(type)) {
        tg.HapticFeedback.impactOccurred(type as 'light' | 'medium' | 'heavy');
      } else {
        tg.HapticFeedback.notificationOccurred(type as 'success' | 'error' | 'warning');
      }
    }
  }, [tg]);

  const showAlert = useCallback((message: string) => {
    if (tg) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  }, [tg]);

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (tg) {
        tg.showConfirm(message, resolve);
      } else {
        resolve(confirm(message));
      }
    });
  }, [tg]);

  const close = useCallback(() => {
    tg?.close();
  }, [tg]);

  return {
    tg,
    user,
    isReady,
    colorScheme,
    themeParams,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    close,
  };
};
