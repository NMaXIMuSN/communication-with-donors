interface IParams {
    valid: boolean;
    submitSucceeded: boolean;
    modifiedSinceLastSubmit: boolean;
}
export const getDisabledPropsInFinalForm = ({
    valid,
    submitSucceeded,
    modifiedSinceLastSubmit,
}: IParams): boolean => {
    return !valid || (submitSucceeded && !modifiedSinceLastSubmit);
};
