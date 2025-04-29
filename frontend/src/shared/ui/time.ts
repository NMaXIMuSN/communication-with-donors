import dayjs from 'dayjs';

import('dayjs/locale/ru');

export enum DateFormat {
    SEGMENTS_LIST = 'DD MMM, HH:mm',
    SEGMENT_PAGE = 'DD MMMM, HH:mm',
    DD_MONTH_YEAR = 'DD MMMM YYYY',
    DD_MONTH_YEAR_PINT_SEPARATED = 'DD.MM.YYYY',
    DD_MONTH = 'DD MMMM',
    DAY_MONTH_YEAR_TIME = 'DD MMM YYYY, HH:mm',
    HOURS_MINUTES = 'HH:mm',
}

const lang = 'ru';

export const dateFormat = (date: Date | string, format: string) => {
    const dateDJS = dayjs(date);

    if (dateDJS.isValid()) {
        return dateDJS.locale(lang).format(format);
    }

    return '';
};
