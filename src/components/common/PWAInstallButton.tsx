import React, { useEffect, useState } from 'react';
import { Download, Check } from 'lucide-react';
import { Language } from '../../types';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface Props {
  lang: Language;
}

export const PWAInstallButton: React.FC<Props> = ({ lang }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforePrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforePrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (!deferredPrompt && !isIOS) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#EEE7DC] text-[#1C1917] hover:bg-[#E5DFD5] transition-colors shadow-xs"
        title={lang === 'ar' ? 'تثبيت تطبيق إتقان على جهازك' : 'Install ITQAN on your device'}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{lang === 'ar' ? 'تثبيت التطبيق' : 'Install App'}</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-[#E6DFD5]">
            <h3 className="text-base font-bold text-[#1C1917] mb-2">
              {lang === 'ar' ? 'تثبيت إتقان على iPhone / iPad' : 'Install ITQAN on iOS'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              {lang === 'ar'
                ? '1. اضغط على زر المشاركة (Share) في شريط متصفح Safari.\n2. مرر للأسفل واضغط على "إضافة إلى الصفحة الرئيسية" (Add to Home Screen).'
                : '1. Tap the Share button in Safari.\n2. Scroll down and tap "Add to Home Screen".'}
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-[#F5F0E8] hover:bg-[#EEE7DC] text-[#1C1917] rounded-lg text-xs font-semibold"
            >
              {lang === 'ar' ? 'حسناً، فهمت' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
