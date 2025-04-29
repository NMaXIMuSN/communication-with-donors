import {Form, FormProps, FormRenderProps} from 'react-final-form';
import cn from 'classnames';

import {isFunction} from '@/shared/lib';

import styles from './ReactFinalForm.module.scss';

interface IProps<FormValues = Record<string, any>, InitialFormValues = Partial<FormValues>>
    extends FormProps<FormValues, InitialFormValues> {
    formId?: string;
    classes?: {
        form?: string;
        formLayout?: string;
    };
    outOfFormContentRenderer?: (
        props: FormRenderProps<FormValues, InitialFormValues>,
    ) => React.ReactNode;
}

function ReactFinalForm<FormValues = Record<string, any>, InitialFormValues = Partial<FormValues>>(
    props: IProps<FormValues, InitialFormValues>,
) {
    const {formId, classes, children, render, outOfFormContentRenderer} = props;

    const contentRenderer = (renderProps: FormRenderProps<FormValues, InitialFormValues>) => {
        if (children) {
            return isFunction(children) ? children(renderProps) : children;
        }

        if (render) {
            return render(renderProps);
        }
    };

    return (
        <Form
            render={(renderProps) => (
                <>
                    <form
                        id={formId}
                        data-qa="form"
                        className={cn(styles.form, classes?.form)}
                        onSubmit={renderProps.handleSubmit}
                    >
                        <div className={cn(classes?.formLayout)}>
                            {contentRenderer(renderProps)}
                        </div>
                    </form>
                    {outOfFormContentRenderer && outOfFormContentRenderer(renderProps)}
                </>
            )}
            {...props}
        />
    );
}

export default ReactFinalForm;
