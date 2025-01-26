"use client"

import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {Entity} from '@/components/admin/entity/entity';
import {useTranslations} from 'next-intl';
import {deleteEntity, getEntities, saveEntity} from "@/app/admin/entity/client";
import {Logger} from '@/lib/logger';
import {EntityTable} from "@/components/admin/entity/entity-table";
import {Params} from "next/dist/server/request/params";
import AdminLayout from '../../adminlayout';
import {EntityForm} from '@/components/admin/entity/entity-form';
import Dialog from "rc-dialog";
import 'rc-dialog/assets/index.css';
import '@/components/dialog-styles.css';
import {EntityType} from "@/components/admin/entity-type/entityType";
import {getEntityType} from "@/app/admin/entity-type/client";

interface EntityListPageProps extends Params {
    entityTypeName: string;
}

export default function EntityListPage() {
    const {entityTypeName} = useParams<EntityListPageProps>();
    const [entities, setEntities] = useState<Entity[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
    const t = useTranslations('admin.entity');
    const [entityType, setEntityType] = useState<EntityType>();

    useEffect(() => {
        const fetchEntities = async () => {
            setIsLoading(true);
            try {
                const data = await getEntities(entityTypeName); // Haal entiteiten op
                setEntities(data);
            } catch (err: any) {
                Logger.error('Something went wrong', err);
                setError('Er is een fout opgetreden bij het ophalen van de gegevens.');
            } finally {
                setIsLoading(false);
            }
        };

        getEntityType(entityTypeName)
            .then(setEntityType) // Zet de entityType als de data geladen is
            .catch((error) => console.error("Fout bij ophalen entity type", error));

        fetchEntities()
            .then();
    }, [entityTypeName]);

    const handleDelete = async (entity: Entity) => {
        const confirmDelete = window.confirm(t('confirmDelete'));
        if (!confirmDelete) return;

        try {
            await deleteEntity(entity);
            setEntities((prevEntities) => prevEntities.filter((e) => e.id !== entity.id));
        } catch (err: any) {
            Logger.error('Something went wrong', err);
            setError('Er is een fout opgetreden bij het verwijderen van de entiteit.');
        }
    };

    // Het formulier openen voor bewerken of toevoegen
    const handleEdit = (entity: Entity) => {
        setSelectedEntity(entity);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedEntity(null); // Lege entity voor nieuw
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    const handleSubmitForm = async (newEntity: Entity) => {
        await saveEntity(newEntity);
        if (newEntity.id) {
            setEntities(prevState => {
                return [
                    ...prevState.filter(value => value.id != newEntity.id),
                    newEntity
                ];
            })
        } else {
            setEntities(prevState => [...prevState, newEntity]);
        }
    };

    if (isLoading) return <div>{t('loading')}</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 bg-cyan-950 text-white">
                <h1 className="text-2xl font-bold">{t('entityListTitle', {entityTypeName})}</h1>

                <div className="my-4">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        {t('addEntity')}
                    </button>
                </div>

                <EntityTable
                    entities={entities}
                    entityType={entityType}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <Dialog
                    visible={isFormOpen}
                    onClose={handleCloseForm}
                    title={selectedEntity ? t('editEntity') : t('addEntity')}
                    closable={true}
                    maskClosable={false}
                    className="bg-cyan-900 text-white p-6 rounded shadow-md max-w-lg mx-auto"
                    footer={null}
                >
                    {isFormOpen && (
                        <EntityForm
                            entity={selectedEntity}
                            entityType={entityType}
                            onClose={handleCloseForm}
                            onSubmit={handleSubmitForm}
                        />
                    )}
                </Dialog>
            </div>
        </AdminLayout>
    );
}
