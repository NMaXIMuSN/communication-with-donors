import {TrashBin} from '@gravity-ui/icons';
import {Button, Col, Flex, Icon} from '@gravity-ui/uikit';
import {FC} from 'react';
import {Field} from 'react-final-form';
import {dataTypeOptions, dataUnitOptions} from '../../model/attribute';
import {noop} from 'lodash';
import {FormFieldCheckbox, FormFieldSelect, FormFieldText} from '@/shared/ui/form';

interface IProps {
    name: string;
    remove: () => void;
}

export const AttributeRow: FC<IProps> = ({name, remove}) => {
    return (
        <>
            <Col s={3}>
                <Flex direction={'column'} gap={2}>
                    <Field name={`${name}.name`}>
                        {(props) => <FormFieldText {...props} placeholder="Название" />}
                    </Field>
                    <Field name={`${name}.systemName`}>
                        {(props) => <FormFieldText {...props} placeholder="Системное имя" />}
                    </Field>
                </Flex>
            </Col>
            <Col s={3}>
                <Field name={`${name}.type`}>
                    {(props) => (
                        <FormFieldSelect
                            {...props}
                            onFocus={noop}
                            options={dataTypeOptions}
                            placeholder="SQL тип"
                        />
                    )}
                </Field>
            </Col>
            <Col s={3}>
                <Field name={`${name}.unit`}>
                    {(props) => (
                        <FormFieldSelect
                            {...props}
                            onFocus={noop}
                            options={dataUnitOptions}
                            placeholder="SQL тип"
                        />
                    )}
                </Field>
            </Col>
            <Col s={3}>
                <Flex gap={2} alignItems="center">
                    <Field name={`${name}.isRequired`} type="checkbox">
                        {(props) => <FormFieldCheckbox {...props} children={'Обязательное поле'} />}
                    </Field>
                    <Button view="flat-secondary" onClick={remove}>
                        <Icon data={TrashBin} />
                    </Button>
                </Flex>
            </Col>
            <Col />
        </>
    );
};
