import React, {useState} from 'react';
import Dialog from 'rc-dialog'; // Verander de import naar rc-dialog
import 'rc-dialog/assets/index.css'; // Zorg ervoor dat je de bijbehorende CSS importeert
import '../dialog-styles.css'; // Vergeet niet de CSS te importeren

interface Step {
    title: string;
    content: React.ReactNode;
    onValidate?: () => boolean;
}

interface FormWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    steps: Step[];
    t: (key: string) => string;
}

const FormWizard: React.FC<FormWizardProps> = ({isOpen, onClose, onSubmit, steps, t}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<any>({});

    const handleNext = () => {
        const currentStepData = steps[currentStep];

        if (currentStepData.onValidate && !currentStepData.onValidate()) {
            return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        onSubmit(formData)
            .then(() => {
                onClose();
                setFormData({});
                setCurrentStep(0);
            });
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    return (
        <Dialog
            visible={isOpen} // Vervang isOpen met visible
            onClose={onClose} // Gebruik onClose om de dialoog te sluiten
            title={t('formWizardTitle')}
            closable={true} // Sluitknop tonen
            maskClosable={false} // De achtergrond mag niet worden aangeklikt om de dialoog te sluiten
            className="bg-cyan-900 text-white p-6 rounded shadow-md max-w-lg mx-auto"
            footer={null} // Omdat je zelf een footer maakt met knoppen
        >
            <h2 className="text-xl font-bold mb-4">{t('formWizardTitle')}</h2>
            <form className="space-y-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
                    {React.cloneElement(steps[currentStep].content as React.ReactElement, {
                        handleInputChange,
                        formData,
                        t,
                    })}
                </div>

                <div className="flex justify-between">
                    {currentStep > 0 ? (
                        <button
                            type="button"
                            className="bg-gray-500 px-4 py-2 rounded"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                        >
                            {t('backButton')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="bg-gray-500 px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            {t('cancelButton')}
                        </button>
                    )}
                    <div className="flex space-x-2">
                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                className="bg-blue-500 px-4 py-2 rounded"
                                onClick={handleNext}
                            >
                                {t('nextButton')}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="bg-green-500 px-4 py-2 rounded"
                                onClick={handleSubmit}
                            >
                                {t('saveButton')}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default FormWizard;
