import {EMPTY_DASH, FormFieldText, FormRow} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import {FormFieldDatePicker} from '@/shared/ui/form/ui/FormFieldDatePicker/FormFieldDatePicker';
import {FormFieldTextArea} from '@/shared/ui/form/ui/FormFieldTextArea';
import {Flex, Text} from '@gravity-ui/uikit';
import {Field} from 'react-final-form';

import styles from './CreateCard.module.scss';
import {dateTimeParse} from '@gravity-ui/date-utils';

export const MainInfo = () => {
    return (
        <Card title="Основная информация">
            <FormRow label="Название">
                {() => <Field name="name">{(props) => <FormFieldText {...props} />}</Field>}
            </FormRow>
            <FormRow label="Описание">
                {() => (
                    <Field name="description">
                        {(props) => <FormFieldTextArea {...props} rows={3} />}
                    </Field>
                )}
            </FormRow>
            <FormRow label="Срок действия">
                {() => (
                    <Flex gap={1}>
                        <Field name="startAt">
                            {(startAtProps) => (
                                <Field name="endAt">
                                    {(endAtProps) => (
                                        <>
                                            <FormFieldDatePicker
                                                {...startAtProps}
                                                maxValue={dateTimeParse(
                                                    endAtProps.input.value,
                                                )?.add(-1000 * 60 * 60 * 24)}
                                            />
                                            <Text className={styles.emptyDash} color="secondary">
                                                {EMPTY_DASH}
                                            </Text>
                                            <FormFieldDatePicker
                                                {...endAtProps}
                                                minValue={dateTimeParse(
                                                    startAtProps.input.value,
                                                )?.add(1000 * 60 * 60 * 24)}
                                            />
                                        </>
                                    )}
                                </Field>
                            )}
                        </Field>
                    </Flex>
                )}
            </FormRow>
        </Card>
    );
};
