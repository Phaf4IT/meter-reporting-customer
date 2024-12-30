import {useEffect, useState} from 'react';

const useFormData = (formKey: string) => {
    const [formData, setFormData] = useState<Record<string, string>>({});

    useEffect(() => {
        const savedFormData = localStorage.getItem(formKey);
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, [formKey]);

    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            localStorage.setItem(formKey, JSON.stringify(formData));
        }
    }, [formData, formKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({});
        localStorage.removeItem(formKey);
    };

    return {
        formData,
        handleChange,
        resetForm,
    };
};

export default useFormData;
