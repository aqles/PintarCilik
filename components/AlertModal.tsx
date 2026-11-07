import React from 'react';
import { Button } from './UI';
import { XCircle, CheckCircle, Info } from 'lucide-react';

interface AlertModalProps {
    message: React.ReactNode;
    type: 'success' | 'error' | 'info' | 'confirm';
    onClose: () => void;
    onConfirm?: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ message, type, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center transform transition-all scale-100 animate-bounce-slow border-4 border-white ring-4 ring-opacity-20 ring-gray-900">
                <div className="mb-4 flex justify-center">
                    {type === 'error' && <XCircle size={64} className="text-red-500 animate-shake" />}
                    {type === 'success' && <CheckCircle size={64} className="text-green-500 animate-bounce" />}
                    {type === 'info' && <Info size={64} className="text-blue-500 animate-pulse" />}
                    {type === 'confirm' && <Info size={64} className="text-purple-500 animate-pulse" />}
                </div>

                <h3 className={`text-2xl font-bold mb-2 ${type === 'error' ? 'text-red-600' :
                    type === 'success' ? 'text-green-600' :
                        type === 'confirm' ? 'text-purple-600' : 'text-blue-600'
                    }`}>
                    {type === 'error' ? 'Ups, Ada Masalah!' :
                        type === 'success' ? 'Hore, Berhasil!' :
                            type === 'confirm' ? 'Yakin?' : 'Sekilas Info'}
                </h3>

                <div className="text-gray-600 mb-6 font-medium text-lg leading-relaxed">
                    {message}
                </div>

                {type === 'confirm' ? (
                    <div className="flex gap-3">
                        <Button onClick={onClose} variant="secondary" className="flex-1 justify-center bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-400">
                            Batal
                        </Button>
                        <Button onClick={() => { if (onConfirm) onConfirm(); onClose(); }} variant="success" className="flex-1 justify-center">
                            Ya, Lanjut
                        </Button>
                    </div>
                ) : (
                    <Button onClick={onClose} variant={type === 'error' ? 'danger' : type === 'success' ? 'success' : 'primary'} className="w-full justify-center">
                        Oke, Siap!
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AlertModal;
