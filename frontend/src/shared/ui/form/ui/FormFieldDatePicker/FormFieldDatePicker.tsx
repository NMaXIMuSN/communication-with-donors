import {DatePicker, DatePickerProps} from '@gravity-ui/date-components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import {PickKnownFieldProps, resolveError} from '@/shared/ui/form';
import {FieldRenderProps} from 'react-final-form';
import {FC, FocusEvent} from 'react';
import {FormField} from '../FormField/FormField';

interface IProps
    extends DatePickerProps,
        PickKnownFieldProps<FieldRenderProps<string, HTMLInputElement>> {}

export const FormFieldDatePicker: FC<IProps> = (props) => {
    const {input, meta, format = 'DD.MM.YYYY', ...dateProps} = props;
    const error = resolveError(meta);

    return (
        <FormField meta={meta}>
            <DatePicker
                {...input}
                onUpdate={(e) => {
                    input.onChange(e?.toISOString());
                }}
                value={dateTimeParse(input.value) || null}
                onFocus={(e) => input.onFocus(e as FocusEvent<HTMLInputElement, Element>)}
                onBlur={(e) => input.onBlur(e as FocusEvent<HTMLInputElement, Element>)}
                format={format}
                validationState={error ? 'invalid' : undefined}
                {...dateProps}
            />
        </FormField>
    );
};
