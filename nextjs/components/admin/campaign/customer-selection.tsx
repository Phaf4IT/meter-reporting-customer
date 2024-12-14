interface CustomerSelectionProps {
    t: (key: string) => string;
    customers: { email: string; firstName: string }[];
    selectedCustomers: string[];
    setSelectedCustomers: React.Dispatch<React.SetStateAction<string[]>>;
}

const CustomerSelection = ({
                               t,
                               customers,
                               selectedCustomers,
                               setSelectedCustomers,
                           }: CustomerSelectionProps) => {

    const toggleCustomerSelection = (email: string) => {
        setSelectedCustomers((prev: string[]) =>
            prev.includes(email)
                ? prev.filter((c) => c !== email) 
                : [...prev, email] 
        );
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{t('customerEmails')}</h2>
            <ul className="space-y-3">
                {customers.map(({email, firstName}) => (
                    <li key={email} className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id={email}
                            checked={selectedCustomers.includes(email)}
                            onChange={() => toggleCustomerSelection(email)}
                            className="form-checkbox h-5 w-5 text-cyan-500"
                        />
                        <label htmlFor={email} className="text-white">
                            {firstName} ({email})
                        </label>
                    </li>
                ))}
            </ul>
            <div className="mt-6 flex space-x-4">
                <button
                    type="button"
                    onClick={() => setSelectedCustomers(customers.map((c) => c.email))}
                    className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                >
                    {t('selectAll')}
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedCustomers([])}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                    {t('reset')}
                </button>
            </div>
        </div>
    );
};

export default CustomerSelection;
