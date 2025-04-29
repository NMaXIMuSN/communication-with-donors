import {PickKnownFieldProps} from '@/shared/ui/form';
import {FieldRenderProps} from 'react-final-form';
import {FC} from 'react';
import {FormField} from '../FormField/FormField';
import {SegmentedRadioGroup, SegmentedRadioGroupProps} from '@gravity-ui/uikit';

interface IProps
    extends SegmentedRadioGroupProps,
        PickKnownFieldProps<FieldRenderProps<string, HTMLInputElement>> {}

export const FormFieldSegmentedRadioGroup: FC<IProps> = (props) => {
    const {input, meta, ...radioProps} = props;

    return (
        <FormField meta={meta}>
            <div>
                <SegmentedRadioGroup {...input} onUpdate={input.onChange} {...radioProps} />
            </div>
        </FormField>
    );
};
