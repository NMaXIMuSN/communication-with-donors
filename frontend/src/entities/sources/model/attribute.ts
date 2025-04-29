import {DataControl, DataType, DataUnit, IAttribute} from '../api/fetchers';

export const DEFAULT_ATTRIBUTE: Partial<IAttribute> = {
    isActive: false,
    name: '',
    systemName: '',
    type: undefined,
    unit: undefined,
    allowedValues: '',
};

export const dataTypeOptions = Object.values(DataType).map((value) => ({
    value,
    content: value,
}));
export const dataUnitOptions = Object.values(DataUnit).map((value) => ({
    value,
    content: value,
}));
export const controlOptions = Object.values(DataControl).map((value) => ({
    value,
    content: value,
}));
