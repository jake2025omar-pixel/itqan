import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

export const OfflineIndicator: React.FC<Props> = ({ lang }) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <aside
      aria-label={lang === 'ar' ? 'تنبيه حالة الاتصال بالإنترنت' : 'Internet connectivity alert'}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-[#F5F0E8] border border-[#E6DFD5] text-[#1C1917] px-3.5 py-2 rounded-xl shadow-lg text-xs font-medium"
    >
      <WifiOff className="w-4 h-4 text-stone-600" />
      <span>
        {lang === 'ar'
          ? 'وضع غير متصل: يمكنك مواصلة الدراسة باستخدام الدروس والمفردات المخزنة محلياً.'
          : 'Offline mode: You can continue studying using cached lessons and vocabulary.'}
      </span>
    </aside>
  );
};
