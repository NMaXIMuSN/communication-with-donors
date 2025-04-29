import {useSearchSegment} from '@/entities/segmnets/api/queryHook';
import {FormFieldSelect, FormRow} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import {Field} from 'react-final-form';

export const SegmentInfo = () => {
    const {mutate, data} = useSearchSegment();

    const options = data?.data.map((segment) => ({
        value: `${segment.name} [${segment.id}]`,
        content: `${segment.name} [${segment.id}]`,
    }));

    return (
        <Card title="Доноры">
            <FormRow label="Сегмент">
                {() => (
                    <Field name="segment">
                        {(props) => (
                            <FormFieldSelect
                                {...props}
                                filterable
                                options={options}
                                onFilterChange={(search) =>
                                    mutate({
                                        search,
                                    })
                                }
                            />
                        )}
                    </Field>
                )}
            </FormRow>
        </Card>
    );
};
