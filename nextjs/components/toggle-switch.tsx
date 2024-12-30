import React from 'react';

interface ToggleSwitchProps {
    isEnabled: boolean;
    onToggle: () => void;
    label?: string;
    disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({isEnabled, onToggle, label, disabled}) => {
    function toggle() {
        if (disabled === undefined || !disabled) {
            onToggle();
        }
    }

    return (
        <div className="w-full md:w-1/2 px-3">
            {label ? (<label className="block uppercase tracking-wide text-gray-200 text-sm font-bold mb-2">
                {label}
            </label>) : (<></>)
            }
            <div
                onClick={toggle}
                className={`relative inline-flex items-center cursor-pointer w-12 h-6 rounded-full transition-all duration-200 ease-in-out ${isEnabled ? 'bg-green-500' : 'bg-gray-400'}`}
            >
                <span
                    className={`${
                        isEnabled ? 'translate-x-6 bg-white' : 'bg-white'
                    } absolute left-0 inline-block w-6 h-6 rounded-full transition-all duration-200 ease-in-out`}
                ></span>
            </div>
        </div>
    );
};

export default ToggleSwitch;
