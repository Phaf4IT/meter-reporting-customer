import React, {useEffect, useState} from 'react';
import FormWizard from "@/components/admin/form-wizard";
import CampaignNameForm from "@/components/admin/campaign/campaign-name-form";
import {CampaignConfiguration} from "@/components/admin/campaign-configuration/campaignConfiguration";
import {getAllEntities} from "@/app/admin/entity/client";
import {Entity} from "@/components/admin/entity/entity";
import {MeasureValue} from "@/components/admin/measure-value/measureValue";
import {getMeasureValues} from "@/app/admin/measure-value/client";
import MeasureValuesSelector from "@/components/admin/campaign/measure-values";
import EntitySelection from "@/components/admin/campaign/entity-selection";

interface CampaignFormWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (campaign: CampaignConfiguration) => Promise<void>;
    t: (key: string) => string;
    currentCampaignConfigurationNames: string[];
}

const CampaignConfigurationFormWizard: React.FC<CampaignFormWizardProps> = ({
                                                                                isOpen,
                                                                                onClose,
                                                                                onSubmit,
                                                                                currentCampaignConfigurationNames,
                                                                                t
                                                                            }: CampaignFormWizardProps) => {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
    const [name, setName] = useState<string>('');
    const [measureValues, setMeasureValues] = useState<MeasureValue[]>([]);
    const [isMeasureValueSet, setIsMeasureValueSet] = useState<boolean>(false);
    const [isEntitiesSet, setEntitiesSet] = useState<boolean>(false);
    const [selectedMeasures, setSelectedMeasures] = useState<MeasureValue[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (!isMeasureValueSet) {
                getMeasureValues()
                    .then(values => {
                        setMeasureValues(values)
                        setSelectedMeasures(values)
                        setIsMeasureValueSet(true);
                    });
            }
            if (!isEntitiesSet) {
                getAllEntities()
                    .then(entities => {
                        setEntitiesSet(true);
                        setEntities(entities)
                    });
            }
        }
    }, [isOpen, measureValues, entities]);

    const handleFormSubmit = async () => {
        const campaignData: CampaignConfiguration = {
            name: name,
            entities: selectedEntities,
            measureValues: selectedMeasures,
        };
        await onSubmit(campaignData);
        setName('');
        setSelectedEntities([]);
        setSelectedMeasures([]);
    };

    const steps = [
        {
            title: t('campaignName'),
            content: (
                <CampaignNameForm
                    t={t}
                    campaignName={name}
                    setCampaignName={(name: string) => setName(name)}
                    currentCampaignNames={currentCampaignConfigurationNames}
                />
            )
        },
        {
            title: t('measureValuesTitle'),
            content: (
                <MeasureValuesSelector
                    t={t}
                    measureValues={measureValues}
                    selectedMeasures={selectedMeasures}
                    setSelectedMeasures={setSelectedMeasures}
                    setMeasureValues={setMeasureValues}
                />
            ),
        },
        {
            title: t('customerSelectionTitle'),
            content: (
                <EntitySelection
                    t={t}
                    entities={entities}
                    selectedEntities={selectedEntities}
                    setSelectedEntities={setSelectedEntities}
                />
            ),
        },
    ];

    return (
        <FormWizard
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleFormSubmit}
            steps={steps}
            t={t}
        />
    );
};

export default CampaignConfigurationFormWizard;
