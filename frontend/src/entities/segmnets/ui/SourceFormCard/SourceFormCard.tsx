import {Source} from '@/entities/sources/api/fetchers';
import {FormRow} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import {Flex, Label} from '@gravity-ui/uikit';
import {Field, FieldRenderProps} from 'react-final-form';
import {FieldArray} from 'react-final-form-arrays';
import {SourcePicker} from '../SourcePicker/SourcePicker';
import {FormField} from '@/shared/ui/form/ui/FormField/FormField';

export const SourceFormCard = () => {
    return (
        <Card title="Источники">
            <FormRow label="Добавленные источники">
                {() => (
                    <FieldArray name="source">
                        {({fields, meta}) => (
                            <FormField meta={meta}>
                                <Flex gap={2}>
                                    {fields.map((name, index) => (
                                        <Field
                                            key={index}
                                            name={name}
                                            children={(
                                                props: FieldRenderProps<Source, HTMLElement>,
                                            ) => (
                                                <Label
                                                    children={props.input.value.name}
                                                    theme="clear"
                                                    type="close"
                                                    size="m"
                                                    onCloseClick={() => fields.remove(index)}
                                                />
                                            )}
                                        />
                                    ))}
                                    <SourcePicker
                                        onSelect={(source) => {
                                            if (
                                                fields.value?.some(
                                                    (_source) => _source.id === source.id,
                                                )
                                            ) {
                                                return;
                                            }
                                            fields.push(source);
                                        }}
                                    />
                                </Flex>
                            </FormField>
                        )}
                    </FieldArray>
                )}
            </FormRow>
        </Card>
    );
};
