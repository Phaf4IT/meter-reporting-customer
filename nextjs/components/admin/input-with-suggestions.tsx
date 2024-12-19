import React, {useState} from 'react';

interface InputWithSuggestionsProps {
    value: string,
    onChange: (value: string) => void,
    suggestions: { label: string; value: string }[],
    onSelect: (value: string) => void,
    placeholder?: string,
    filterSuggestions?: (input: string, suggestions: { label: string; value: string }[]) => {
        label: string;
        value: string
    }[],
    ref?: React.RefObject<HTMLInputElement>
}

const InputWithSuggestions: React.FC<InputWithSuggestionsProps> = ({
                                                                       value,
                                                                       onChange,
                                                                       suggestions,
                                                                       onSelect,
                                                                       placeholder = '',
                                                                       filterSuggestions = (input, suggestions) => suggestions.filter(s => s.label.toLowerCase().includes(input.toLowerCase()) || s.value.toLowerCase().includes(input.toLowerCase())),
                                                                       ref
                                                                   }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        onChange(inputValue);
        setFilteredSuggestions(filterSuggestions(inputValue, suggestions));
        setSelectedIndex(null); // Reset selectie bij verandering van input
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 100);
    };

    const handleFocus = () => {
        setShowSuggestions(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prevIndex) => (prevIndex === null || prevIndex === filteredSuggestions.length - 1 ? 0 : prevIndex + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prevIndex) => (prevIndex === null || prevIndex === 0 ? filteredSuggestions.length - 1 : prevIndex - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex !== null && filteredSuggestions[selectedIndex]) {
                onSelect(filteredSuggestions[selectedIndex].value);
                setShowSuggestions(false);
            }
        }
    };

    const handleSuggestionClick = (value: string) => {
        onSelect(value);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                ref={ref}
                className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4"
                placeholder={placeholder}
            />
            {showSuggestions && value && (
                <div
                    className="absolute bg-cyan-900 text-white border border-gray-500 rounded mt-1 max-h-48 overflow-y-auto w-full z-10">
                    {filteredSuggestions.map((suggestion, index) => (
                        <div
                            key={suggestion.value}
                            className={`px-4 py-2 hover:bg-cyan-700 cursor-pointer ${selectedIndex === index ? 'bg-cyan-700' : ''}`} // Markeer de geselecteerde suggestie
                            onClick={() => handleSuggestionClick(suggestion.value)}
                        >
                            {suggestion.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InputWithSuggestions;
