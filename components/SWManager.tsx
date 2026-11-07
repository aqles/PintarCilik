import React, { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { useAlert } from '../context/AlertContext';
import { Download, Share, PlusSquare } from 'lucide-react';

const SWManager: React.FC = () => {
    const { showConfirm, showAlert } = useAlert();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // 1. Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // 2. Handle beforeinstallprompt (Android/Desktop)
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Check if already dismissed recently
            const hasDismissed = localStorage.getItem('pwaInstallDismissed');
            if (!hasDismissed) {
                showInstallPrompt(e);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // 3. Register SW for updates
        const updateSW = registerSW({
            onNeedRefresh() {
                showConfirm(
                    <span className="flex flex-col items-center gap-2">
                        <span>Ada update konten baru nih!</span>
                        <span className="text-sm font-normal">Muat ulang sekarang biar makin seru?</span>
                    </span>,
                    () => {
                        updateSW(true);
                    }
                );
            },
            onOfflineReady() {
                showAlert('Aplikasi siap digunakan offline! Tetap bisa belajar walau tanpa internet.', 'success');
            },
        });

        // 4. Trigger iOS prompt if needed
        if (isIosDevice && !(window as any).navigator.standalone) {
            const hasDismissed = localStorage.getItem('pwaInstallDismissed');
            if (!hasDismissed) {
                setTimeout(() => showIOSPrompt(), 3000); // Delay a bit
            }
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [showConfirm, showAlert]);

    const showInstallPrompt = (promptEvent: any) => {
        showConfirm(
            <div className="flex flex-col items-center gap-2">
                <Download size={48} className="text-purple-500 animate-bounce" />
                <span className="font-bold text-lg">Install Aplikasi Yuk!</span>
                <span className="text-sm font-normal text-gray-600">
                    Pasang aplikasi PintarCilik di HP-mu biar belajar makin mudah dan cepat aksesnya!
                </span>
            </div>,
            async () => {
                if (promptEvent) {
                    promptEvent.prompt();
                    const { outcome } = await promptEvent.userChoice;
                    if (outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    setDeferredPrompt(null);
                }
            }
        );
        // Mark as seen so we don't spam, but we only mark if they say NO (handled by onClose implicitly? 
        // Actually AlertModal generic onClose doesn't trigger "No/Cancel" specific logic other than closing.
        // Let's just set it to dismissed in localStorage if shown. 
        // Ideally we'd only dismiss if they explicitly declined, but for now let's not spam.)
        localStorage.setItem('pwaInstallDismissed', 'true');
    };

    const showIOSPrompt = () => {
        showAlert(
            <div className="flex flex-col items-center gap-4 text-left">
                <div className="flex items-center gap-2 w-full bg-gray-100 p-3 rounded-xl">
                    <Share className="text-blue-500" />
                    <span className="text-sm">1. Tekan tombol <b>Share</b> di browser</span>
                </div>
                <div className="flex items-center gap-2 w-full bg-gray-100 p-3 rounded-xl">
                    <PlusSquare className="text-gray-700" />
                    <span className="text-sm">2. Pilih <b>"Add to Home Screen"</b></span>
                </div>
                <div className="text-xs text-center text-gray-400 mt-2">
                    Aplikasi akan terpasang di layar utama HP-mu!
                </div>
            </div>,
            'info'
        );
        localStorage.setItem('pwaInstallDismissed', 'true');
    };

    return null;
};

export default SWManager;
