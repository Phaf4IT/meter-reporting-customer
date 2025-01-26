import React, { useState, useEffect, useRef } from 'react';

interface MultiSelectProps<T> {
    availableOptions: T[];
    selectedOptions: T[];
    onChange: (selected: T[]) => void;
    getOptionLabel: (option: T) => string; // Functie om de labeltekst van de optie te krijgen
    getOptionValue: (option: T) => string; // Functie om de waarde van de optie te krijgen
    getOptionIcon?: (option: T) => React.ReactNode; // Optionele functie voor een icoon per optie
}

const MultiSelect = <T extends object>({
                                           availableOptions,
                                           selectedOptions,
                                           onChange,
                                           getOptionLabel,
                                           getOptionValue,
                                           getOptionIcon,
                                       }: MultiSelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    // const [focused, setFocused] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const handleToggleDropdown = () => setIsOpen(!isOpen);

    const handleSelectOption = (option: T) => {
        const newSelected = [...selectedOptions, option];
        onChange(newSelected);
    };

    const handleRemoveOption = (option: T) => {
        const newSelected = selectedOptions.filter((item) => getOptionValue(item) !== getOptionValue(option));
        onChange(newSelected);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={selectRef} className="relative">
            {/* Display Selected Options as Tags */}
            <div
                className="w-full p-3 bg-cyan-800 text-white border border-gray-500
                rounded py-3 px-4 leading-tight cursor-pointer min-h-[50px]"
                onClick={handleToggleDropdown}
                // onFocus={() => setFocused(true)}
                // onBlur={() => setFocused(false)}
                tabIndex={0} // zodat de focus kan worden getriggerd
            >
                {/* Show selected tags */}
                <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option) => (
                        <div
                            key={getOptionValue(option)}
                            className="flex items-center space-x-2 bg-cyan-600 text-white py-1 px-3 rounded-full"
                        >
                            {getOptionIcon && getOptionIcon(option)}
                            <span>{getOptionLabel(option)}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(option)}
                                className="text-white hover:text-gray-300"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute left-0 mt-1 w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none shadow-lg z-10 max-h-48 overflow-auto">
                    <ul>
                        {availableOptions
                            .filter((option) => !selectedOptions.includes(option))
                            .map((option) => (
                                <li
                                    key={getOptionValue(option)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectOption(option)}
                                >
                                    <div className="flex items-center">
                                        {getOptionIcon && getOptionIcon(option)}
                                        <span>{getOptionLabel(option)}</span>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
