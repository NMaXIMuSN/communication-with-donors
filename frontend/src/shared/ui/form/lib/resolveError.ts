import {FieldMetaState} from 'react-final-form';

export const resolveError = (props: FieldMetaState<unknown>): string | undefined => {
    const {touched, error, submitError, dirty, dirtySinceLastSubmit, submitFailed} = props;
    const resolvedError = error || submitError;
    const touchedOrDirty = touched ?? dirty; // workaround for FieldArray

    if (!resolvedError || (!touchedOrDirty && !submitFailed) || (!error && dirtySinceLastSubmit)) {
        return undefined;
    }

    return resolvedError;
};
