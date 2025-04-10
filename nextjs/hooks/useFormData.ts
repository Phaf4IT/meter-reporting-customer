import {useEffect, useState} from 'react';
import {blobToURL, fromBlob} from 'image-resize-compress';

const useFormData = (formKey: string) => {
    const [formData, setFormData] = useState<Record<string, string | undefined>>({});

    useEffect(() => {
        const savedFormData = localStorage.getItem(formKey);
        if (savedFormData) {
            const parsedFormData = JSON.parse(savedFormData);
            // Exclude file inputs from restoring
            const sanitizedFormData = Object.keys(parsedFormData).reduce((acc, key) => {
                const value = parsedFormData[key];
                if (value instanceof File) {
                    // We do not restore files from localStorage
                    acc[key] = undefined;
                } else {
                    acc[key] = value;
                }
                return acc;
            }, {} as Record<string, string | undefined>);
            setFormData(sanitizedFormData);
        }
    }, [formKey]);

    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            // Exclude file inputs from being saved to localStorage
            const sanitizedFormData = Object.keys(formData).reduce((acc, key) => {
                acc[key] = formData[key];
                return acc;
            }, {} as Record<string, string | undefined>);

            localStorage.setItem(formKey, JSON.stringify(sanitizedFormData));
        }
    }, [formData, formKey]);

    const getValue = (input: HTMLInputElement) => {
        return input.value;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: getValue(e.target),
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files) {
            const quality = 80; // For webp and jpeg formats
            const width = 800; // Original width
            const height = 'auto'; // Original height
            const format = 'webp'; // Output format
            const resizedBlob = await fromBlob(files[0], quality, width, height, format);
            const url = await blobToURL(resizedBlob);
            setFormData((prevData) => ({
                ...prevData,
                [name]: url.toString(),
            }));
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getFileString = async (files: any) => {
        const reader = new FileReader();
        return await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(files[0]);
        });
    }

    const resetForm = () => {
        setFormData({});
        localStorage.removeItem(formKey);
    };

    return {
        formData,
        handleChange,
        resetForm,
        handleFileChange
    };
};

export default useFormData;
