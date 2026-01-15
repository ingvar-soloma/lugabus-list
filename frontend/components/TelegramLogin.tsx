import * as React from 'react';
import { useEffect, useRef } from 'react';
import { User } from '../types';

interface Props {
  botName: string;
  onAuth: (user: User) => void;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: boolean;
}

const TelegramLogin: React.FC<Props> = ({
  botName,
  onAuth,
  buttonSize = 'large',
  cornerRadius,
  requestAccess = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    globalThis.onTelegramAuth = (user: Record<string, unknown>) => {
      onAuth(user as unknown as User);
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.dataset.telegramLogin = botName;
    script.dataset.size = buttonSize;
    if (cornerRadius !== undefined) {
      script.dataset.radius = cornerRadius.toString();
    }
    script.dataset.onauth = 'onTelegramAuth(user)';
    script.dataset.requestAccess = requestAccess ? 'write' : '';
    script.async = true;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      delete globalThis.onTelegramAuth;
    };
  }, [botName, onAuth, buttonSize, cornerRadius, requestAccess]);

  return <div ref={containerRef} />;
};

export default TelegramLogin;
