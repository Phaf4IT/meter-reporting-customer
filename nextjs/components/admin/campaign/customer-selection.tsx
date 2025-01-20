import {Customer} from "@/components/admin/customer/customer";

interface CustomerSelectionProps {
    t: (key: string) => string;
    customers: Customer[];
    selectedCustomers: Customer[];
    setSelectedCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomerSelection = ({
                               t,
                               customers,
                               selectedCustomers,
                               setSelectedCustomers,
                           }: CustomerSelectionProps) => {

    const toggleCustomerSelection = (email: Customer) => {
        setSelectedCustomers((prev: Customer[]) =>
            prev.includes(email)
                ? prev.filter((c) => c !== email)
                : [...prev, email]
        );
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{t('customerEmails')}</h2>
            <ul className="space-y-3">
                {customers.map((customer: Customer) => (
                    <li key={customer.email} className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id={customer.email}
                            checked={!!selectedCustomers.find((c: Customer) => c.email === customer.email)}
                            onChange={() => toggleCustomerSelection(customer)}
                            className="form-checkbox h-5 w-5 text-cyan-500"
                        />
                        <label htmlFor={customer.email} className="text-white">
                            {customer.firstName} ({customer.email})
                        </label>
                    </li>
                ))}
            </ul>
            <div className="mt-6 flex space-x-4">
                <button
                    type="button"
                    onClick={() => setSelectedCustomers(customers)}
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
