"use client"

import React, {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {deleteEntityType, getEntityTypes, saveEntityType} from '@/app/admin/entity-type/client';
import {EntityTypeTable} from '@/components/admin/entity-type/entity-type-table';
import {EntityTypeForm} from '@/components/admin/entity-type/entity-type-form';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';
import '@/components/dialog-styles.css';
import {Logger} from "@/lib/logger";
import {EntityType} from "@/components/admin/entity-type/entityType";

export default function EntityTypeManagementPage() {
    const [entityTypes, setEntityTypes] = useState<EntityType[]>([]);
    const [selectedEntityType, setSelectedEntityType] = useState<EntityType>();
    const [isNew, setIsNew] = useState<boolean>(true);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations('admin.entity-type');

    useEffect(() => {
        const fetchEntityTypes = async () => {
            setIsLoading(true);
            try {
                const data = await getEntityTypes();
                setEntityTypes(data);
            } catch (err: any) {
                Logger.error("Something went wrong", err);
                setError('Er is een fout opgetreden bij het ophalen van de EntityTypes.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntityTypes()
            .then();
    }, []);

    const handleEditEntityType = (entityTypeName: string) => {
        const entityType = entityTypes.find((et) => et.name === entityTypeName);
        setIsNew(false);
        setSelectedEntityType(entityType);
        setIsFormOpen(true);
    };

    const handleDeleteEntityType = async (entityType: EntityType) => {
        const confirmDelete = window.confirm(t('confirmDeleteEntityType'));
        if (!confirmDelete) return;

        try {
            await deleteEntityType(entityType);
            setEntityTypes((prevEntityTypes) =>
                prevEntityTypes.filter((et) => et.name !== entityType.name)
            );
        } catch (err: any) {
            Logger.error("Something went wrong", err);
            setError('Er is een fout opgetreden bij het verwijderen van de EntityType.');
        }
    };

    const handleSaveEntityType = async (entityType: EntityType, isNew: boolean) => {
        await saveEntityType(entityType, isNew);

        setEntityTypes(prevState => {
            const newState = prevState.find(value => value.name === entityType.name)
                ? prevState.filter(value => value.name !== entityType.name)
                : prevState;
            return [...newState, entityType];
        })
    }

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setIsNew(true);
        setSelectedEntityType(undefined);
    };

    if (isLoading) return <div>{t('loading')}</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="min-h-screen p-8 bg-cyan-950 text-white">
            <h1 className="text-2xl font-bold">{t('entityTypeManagement')}</h1>

            <div className="my-4">
                <button
                    onClick={() => {
                        setIsNew(true);
                        setSelectedEntityType(undefined);
                        setIsFormOpen(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    {t('addEntityType')}
                </button>
            </div>

            <EntityTypeTable
                key={entityTypes.length}
                entityTypes={entityTypes}
                onEdit={handleEditEntityType}
                onDelete={handleDeleteEntityType}
            />

            <Dialog
                key={isFormOpen ? "form-open" : "form-closed"}  // Forceert her-renderen wanneer geopend of gesloten
                visible={isFormOpen}
                onClose={handleCloseForm}
                title={selectedEntityType ? t('editEntityType') : t('addEntityType')}
                closable={true}
                maskClosable={false}
                className="bg-cyan-900 text-white p-6 rounded shadow-md mx-auto w-auto max-w-5xl"
                footer={null}
            >
                {isFormOpen && (
                    <EntityTypeForm
                        entityType={selectedEntityType}
                        onSubmit={handleSaveEntityType}
                        onClose={handleCloseForm}
                        isNew={isNew}
                    />
                )}
            </Dialog>
        </div>
    );
}
