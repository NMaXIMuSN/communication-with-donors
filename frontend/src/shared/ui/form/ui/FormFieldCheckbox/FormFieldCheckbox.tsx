import {Checkbox, CheckboxProps} from '@gravity-ui/uikit';
import {FieldRenderProps} from 'react-final-form';
import {FormField} from '../FormField/FormField';

import {PickKnownFieldProps} from '@/shared/ui/form';

export interface IFormFieldCheckboxProps
    extends PickKnownFieldProps<FieldRenderProps<boolean, HTMLInputElement>>,
        Omit<CheckboxProps, 'disabled'> {
    text?: string;
    disabled?: boolean;
    renderContent?: () => React.ReactNode;
    className?: string;
    controlClassName?: string;
}

const FormFieldCheckbox = (props: IFormFieldCheckboxProps) => {
    const {
        input: {onChange, checked},
        meta,
        text,
        renderContent,
        className,
        ...restProps
    } = props;

    const checkboxProps = {
        ...restProps,
        onChange,
        checked,
    };

    return (
        <FormField meta={meta} className={className}>
            <Checkbox {...checkboxProps} content={text || (renderContent && renderContent())} />
        </FormField>
    );
};

export default FormFieldCheckbox;
