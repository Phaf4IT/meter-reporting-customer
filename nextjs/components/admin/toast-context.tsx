'use client'
import {createContext, useContext, useState} from 'react';

type ToasterContextType = {
    showToaster: (message: string, type: 'info' | 'warning' | 'error' | 'success') => void;
    toasterMessage: string | null;
    toasterType: 'info' | 'warning' | 'error' | 'success' | null;
};

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export const useToaster = () => {
    const context = useContext(ToasterContext);
    if (!context) {
        throw new Error('useToaster must be used within a ToasterProvider');
    }
    return context;
};

// export const ToasterProvider: React.FC = ({children}: { children: React.ReactNode }) => {
export default function ToasterProvider({children}: { children: React.ReactNode }) {
    const [toasterMessage, setToasterMessage] = useState<string | null>(null);
    const [toasterType, setToasterType] = useState<'info' | 'warning' | 'error' | 'success' | null>(null);

    const showToaster = (message: string, type: 'info' | 'warning' | 'error' | 'success') => {
        setToasterMessage(message);
        setToasterType(type);
        setTimeout(() => {
            setToasterMessage(null);
        }, 3000); // Toaster verdwijnt na 3 seconden
    };

    return (
        <ToasterContext.Provider value={{showToaster, toasterMessage, toasterType}}>
            {children}
        </ToasterContext.Provider>
    );
};
