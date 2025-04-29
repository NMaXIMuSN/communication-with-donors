import {FormFieldCheckbox, FormFieldSelect, FormFieldText, FormRow} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import {Col, Flex, Row} from '@gravity-ui/uikit';
import {FC} from 'react';
import {Field} from 'react-final-form';
import {controlOptions, dataTypeOptions, dataUnitOptions} from '../../model/attribute';
import {FormFieldTextArea} from '@/shared/ui/form/ui/FormFieldTextArea';

interface IProps {
    prefix: string;
    canEdit?: boolean;
}

export const Attribute: FC<IProps> = (props) => {
    const {prefix, canEdit} = props;

    const getName = (name: string) => `${prefix}.${name}`;

    return (
        <Card>
            <Row space={2} style={{width: '100%'}}>
                <Col s={4}>
                    <FormRow label="Системное имя" required>
                        {(id) => (
                            <Field name={getName('systemName')}>
                                {(props) => <FormFieldText id={id} {...props} disabled />}
                            </Field>
                        )}
                    </FormRow>
                    <FormRow label="Название">
                        {(id) => (
                            <Field name={getName('name')}>
                                {(props) => (
                                    <FormFieldText id={id} {...props} disabled={!canEdit} />
                                )}
                            </Field>
                        )}
                    </FormRow>
                </Col>
                <Col s={4}>
                    <FormRow label="Агрегат">
                        {(id) => (
                            <Field name={getName('unit')}>
                                {(props) => (
                                    <FormFieldSelect
                                        id={id}
                                        {...props}
                                        options={dataUnitOptions}
                                        disabled={!canEdit}
                                    />
                                )}
                            </Field>
                        )}
                    </FormRow>
                    <FormRow label="SQL type">
                        {(id) => (
                            <Field name={getName('type')}>
                                {(props) => (
                                    <FormFieldSelect
                                        {...props}
                                        id={id}
                                        options={dataTypeOptions}
                                        disabled={!canEdit}
                                    />
                                )}
                            </Field>
                        )}
                    </FormRow>
                    <FormRow label="Контрол">
                        {(id) => (
                            <Field name={getName('control')}>
                                {(props) => (
                                    <FormFieldSelect
                                        id={id}
                                        {...props}
                                        options={controlOptions}
                                        disabled={!canEdit}
                                    />
                                )}
                            </Field>
                        )}
                    </FormRow>
                </Col>
                <Col s={4}>
                    <Flex direction={'column'} gap={2}>
                        <FormRow isVertical label="Доступные значения">
                            {(id) => (
                                <Field name={getName('allowedValues')}>
                                    {(props) => (
                                        <FormFieldTextArea
                                            id={id}
                                            {...props}
                                            rows={3}
                                            disabled={!canEdit}
                                        />
                                    )}
                                </Field>
                            )}
                        </FormRow>
                        <FormRow label="Использовать в сегменте">
                            {(id) => (
                                <Field name={getName('isActive')} type="checkbox">
                                    {(props) => (
                                        <FormFieldCheckbox {...props} id={id} disabled={!canEdit} />
                                    )}
                                </Field>
                            )}
                        </FormRow>
                    </Flex>
                </Col>
            </Row>
        </Card>
    );
};
