import {FormRow} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import ReactFinalForm from '@/shared/ui/form/ReactFinalForm';
import {FormFieldDatePicker} from '@/shared/ui/form/ui/FormFieldDatePicker/FormFieldDatePicker';
import {Button} from '@gravity-ui/uikit';
import {FC, useContext} from 'react';
import {Field} from 'react-final-form';
import {CampaignContext} from '../../model/CampaignContext';
import {SearchSegment} from '@/features/segment/search-segment/SearchSegment';
import {useUpdateCampaignMutation} from '../../api/queryHook';
import {ECampaignStatus, ICampaignUpdate} from '../../api/fetch';
import {toaster} from '@/shared/toaster/notification';
import {ISegment} from '@/entities/segmnets/api/fetchers';

interface IProps {
    canEdit?: boolean;
}

export const InfoCard: FC<IProps> = ({canEdit}) => {
    const {
        state: {campaign, status},
    } = useContext(CampaignContext);

    const isDisabled = status === ECampaignStatus.ACTIVE || status === ECampaignStatus.COMPLETED;

    const {mutateAsync} = useUpdateCampaignMutation(campaign.id);

    const onSubmit = async (data: ICampaignUpdate & {segment: Required<ISegment>}) => {
        try {
            await mutateAsync({
                endAt: data.endAt,
                startAt: data.startAt,
                segmentId: data.segment.id,
            });
            toaster.add({
                content: 'Данные кампании сохранились',
            });
        } catch (error) {
            toaster.add({
                type: 'danger',
                content: 'Не удалось сохранились',
            });
        }
    };

    return (
        <Card
            title="Основная информация"
            action={
                canEdit && (
                    <Button
                        view="action"
                        type="submit"
                        form={'INFO_CAMPAIGN'}
                        disabled={isDisabled}
                    >
                        Сохранить
                    </Button>
                )
            }
        >
            <ReactFinalForm<ICampaignUpdate & {segment: Required<ISegment>}>
                formId="INFO_CAMPAIGN"
                onSubmit={onSubmit}
            >
                {() => (
                    <>
                        <FormRow label="Начало кампании">
                            {() => (
                                <Field name="startAt" defaultValue={campaign.startAt}>
                                    {(props) => (
                                        <FormFieldDatePicker
                                            {...props}
                                            disabled={isDisabled || !canEdit}
                                        />
                                    )}
                                </Field>
                            )}
                        </FormRow>
                        <FormRow label="Конец кампании">
                            {() => (
                                <Field name="endAt" defaultValue={campaign.endAt}>
                                    {(props) => (
                                        <FormFieldDatePicker
                                            {...props}
                                            disabled={isDisabled || !canEdit}
                                        />
                                    )}
                                </Field>
                            )}
                        </FormRow>
                        <FormRow label="Сегмент">
                            {() => (
                                <Field name="segment" defaultValue={campaign.segment}>
                                    {(props) => (
                                        <SearchSegment
                                            text={props.input.value.name}
                                            onSelectSegment={(segment) =>
                                                props.input.onChange(segment)
                                            }
                                            disabled={isDisabled || !canEdit}
                                        />
                                    )}
                                </Field>
                            )}
                        </FormRow>
                    </>
                )}
            </ReactFinalForm>
        </Card>
    );
};
