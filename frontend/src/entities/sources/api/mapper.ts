import {DataControl, DataType, DataUnit, IAttribute} from './fetchers';

export const mapColumnsInfoToAttribute = (
    columns: {
        key: string;
        type: DataType;
    }[],
): IAttribute[] => {
    return columns.map(({key, type}) => ({
        control: DataControl.STRING,
        isActive: false,
        name: '',
        systemName: key,
        type: type,
        unit: DataUnit.WHERE,
        allowedValues: '',
    }));
};
