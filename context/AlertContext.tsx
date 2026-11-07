import React, { createContext, useContext, useState, ReactNode } from 'react';
import AlertModal from '../components/AlertModal';

interface AlertContextType {
    showAlert: (message: React.ReactNode, type?: 'success' | 'error' | 'info') => void;
    showConfirm: (message: React.ReactNode, onConfirm: () => void) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<React.ReactNode>('');
    const [type, setType] = useState<'success' | 'error' | 'info' | 'confirm'>('info');
    const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | undefined>(undefined);

    const showAlert = (message: React.ReactNode, type: 'success' | 'error' | 'info' = 'info') => {
        setMessage(message);
        setType(type);
        setOnConfirmAction(undefined);
        setIsOpen(true);
    };

    const showConfirm = (message: React.ReactNode, onConfirm: () => void) => {
        setMessage(message);
        setType('confirm');
        setOnConfirmAction(() => onConfirm);
        setIsOpen(true);
    };

    const closeAlert = () => setIsOpen(false);

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            {isOpen && (
                <AlertModal
                    message={message}
                    type={type}
                    onClose={closeAlert}
                    onConfirm={onConfirmAction}
                />
            )}

        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};
