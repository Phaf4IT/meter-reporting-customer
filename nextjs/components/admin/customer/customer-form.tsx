import React, {useEffect, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {getAllEntities} from "@/app/admin/entity/client";
import {ModifiableCustomer} from "@/components/admin/customer/modifiable-customer";
import {getTranslationForLocale} from "@/components/admin/entity-type/entityType";
import {Entity} from "@/components/admin/entity/entity"; // Zorg ervoor dat je deze ook goed importeert
import Dialog from "rc-dialog";
import 'rc-dialog/assets/index.css';
import '@/components/dialog-styles.css';
import {Customer} from "@/components/admin/customer/customer";
import {FaPlus} from "react-icons/fa";

export default function CustomerForm({
                                         customer,
                                         entity,
                                         isNew,
                                         onSave,
                                         onCancel
                                     }: {
    customer: Customer;
    entity: Entity;
    isNew: boolean;
    onSave: (customer: ModifiableCustomer & Customer, isNew: boolean) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<ModifiableCustomer>({
        ...customer,
        title: customer.title || "",
        entityId: customer.entity?.id || "",
        phoneNumber: customer.phoneNumber,
    });

    const [entityDialogOpen, setEntityDialogOpen] = useState(false);  // State voor dialoog openen
    const [entities, setEntities] = useState<Entity[]>([]);  // Hier komen de entiteiten die we ophalen van de server
    const [selectedEntity, setSelectedEntity] = useState<Entity>(entity);  // Hier komen de entiteiten die we ophalen van de server
    const [entityError, setEntityError] = useState<string>("");  // Foutmelding voor entiteitsselectie
    const t = useTranslations('admin.customer');
    const locale = useLocale();

    useEffect(() => {
        getAllEntities()
            .then(entities => setEntities(entities));
    }, []);

    const handleEntitySelect = (selectedEntity: Entity) => {
        setFormData({
            ...formData,
            entityId: selectedEntity.id,
        });
        setSelectedEntity(selectedEntity);
        setEntityError(""); // Reset de foutmelding wanneer er een entiteit is geselecteerd
        setEntityDialogOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validatie: Controleer of er een entiteit is geselecteerd
        if (!selectedEntity) {
            setEntityError(t("entityRequired")); // Zet de foutmelding
            return;
        }

        // Als er geen fout is, sla het formulier op
        onSave({...formData, entity: selectedEntity}, isNew);
    };

    return (
        <form onSubmit={handleSubmit}
              className="w-full max-w-lg bg-cyan-900 text-white p-6 rounded shadow-md space-y-6">
            {/* Titel van de klant */}
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="title">
                        {t("title")}
                    </label>
                    <select
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    >
                        <option value="">{t("none")}</option>
                        <option value="mr">{t("mr")}</option>
                        <option value="mrs">{t("mrs")}</option>
                        <option value="family">{t("family")}</option>
                    </select>
                </div>
            </div>

            {/* Entity Koppelen */}
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                        disabled={!isNew}
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="firstName">
                        {t('firstName')}
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
            </div>

            {/* Middle Name, Last Name */}
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="middleName">
                        {t('middleName')}
                    </label>
                    <input
                        type="text"
                        id="middleName"
                        value={formData.middleName || ''}
                        onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="lastName">
                        {t('lastName')}
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
            </div>

            <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2">
                    {t("entity")}
                </label>

                {/* Dynamische velden van de geselecteerde entity */}
                {selectedEntity ? (
                    <div className="space-y-4">
                        {Object.keys(selectedEntity.fieldValues || {}).map(
                            (fieldKey) => {
                                const fieldLabel =
                                    getTranslationForLocale(
                                        selectedEntity.entityType!,
                                        locale
                                    )[fieldKey] || fieldKey;

                                const fieldValue =
                                    selectedEntity?.fieldValues[fieldKey] ||
                                    "N/A";

                                return (
                                    <p key={fieldKey}>
                                        <strong>{fieldLabel}:</strong> {fieldValue}
                                    </p>
                                );
                            }
                        )}
                    </div>
                ) : (
                    <p>{t("noEntitySelected")}</p> // Bericht als er geen entiteit geselecteerd is
                )}

                {/* Foutmelding voor entiteitsselectie */}
                {entityError && (
                    <p className="text-red-500 text-sm">{entityError}</p>
                )}

                {/* Knop om entity te selecteren */}
                <button
                    type="button"
                    onClick={() => setEntityDialogOpen(true)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {t("selectEntity")}
                </button>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-200 text-s font-bold mb-2"
                           htmlFor="phone-number">
                        {t('phoneNumber')}
                    </label>
                    <input
                        type="text"
                        id="phone-number"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="appearance-none block w-full bg-cyan-800 text-white border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:border-cyan-400"
                        required
                    />
                </div>
            </div>

            <div className="flex space-x-4">
                <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
                    {t('save')}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
                >
                    {t('cancel')}
                </button>
            </div>
            <Dialog
                visible={entityDialogOpen} // Toon dialoog op basis van state
                onClose={() => setEntityDialogOpen(false)} // Sluit dialoog bij het klikken op sluiten
                title={t("selectEntity")} // Titel van het dialoog
                closable={true} // Maak het dialoog sluitbaar
                maskClosable={false} // Sluit niet wanneer je op de achtergrond klikt
                className="bg-cyan-900 text-white p-6 rounded shadow-md max-w-lg mx-auto" // Voeg hier extra styling toe
                footer={null} // Geen footer als je geen knoppen wilt onderaan
            >
                {/* Scrollbare lijst van entiteiten */}
                <div className="max-h-96 overflow-y-scroll">
                    <ul className="space-y-4">
                        {entities.map((entity) => (
                            <li key={entity.id}
                                className="border-b border-gray-700 py-4 flex items-center justify-between">
                                <div className="mt-2 space-y-2">
                                    {Object.keys(entity.entityType?.fields || {}).map((fieldKey) => {
                                        const fieldLabel = getTranslationForLocale(entity.entityType!, locale)[fieldKey] || fieldKey;
                                        const fieldValue = entity.fieldValues[fieldKey] || 'N/A';

                                        return (
                                            <div key={fieldKey} className="flex justify-between">
                                                <span className="text-sm text-gray-300">{fieldLabel}:</span>
                                                <span className="text-sm text-gray-200">{fieldValue}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => handleEntitySelect(entity)}
                                    className="flex items-center text-blue-500 hover:text-blue-400"
                                >
                                    <FaPlus className="mr-2"/> {/* Plusje icoon */}
                                    {t("select")} {/* Tekst op de knop */}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sluitknop voor het dialoog */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setEntityDialogOpen(false)}
                        className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
                    >
                        {t("cancel")}
                    </button>
                </div>
            </Dialog>

        </form>
    )
        ;
}
