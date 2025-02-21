import {useToaster} from "@/components/admin/toast-context";

const Toaster = () => {
    const {toasterMessage, toasterType} = useToaster();

    if (!toasterMessage) return null;

    // Bepaal de juiste klasse op basis van het type
    const getToasterClass = () => {
        switch (toasterType) {
            case 'info':
                return 'bg-blue-500 border-blue-700';
            case 'warning':
                return 'bg-yellow-500 border-yellow-700';
            case 'error':
                return 'bg-red-500 border-red-700';
            case 'success':
                return 'bg-green-500 border-green-700';
            default:
                return 'bg-gray-500 border-gray-700';
        }
    };

    return (
        <div
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white ${getToasterClass()}`}>
            {toasterMessage}
        </div>
    );
};

export default Toaster;
