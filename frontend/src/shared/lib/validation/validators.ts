import dayjs, {type ConfigType} from 'dayjs';

import {
    CYRILLIC_NUMBER_AND_SPACES,
    EMAIL_REGEXP,
    LATIN_NUMBERS_AND_DASH,
    LATIN_NUMBERS_AND_UNDERSCOR,
    LATIN_NUMBERS_AND_UNDERSCOR_AND_DASH,
    LATIN_NUMBER_AND_SPACES,
    LINK,
    TICKET_NAME,
    TIME_HH_MM,
} from './RegExp';
import {isObject, isString} from '../';
import {isEqual} from 'lodash';

// если нужны дополнительные валидаторы прежде чем писать кастомный стоит заглянуть в ~/arcadia/data-ui/cloud-components/src/utils/validations.ts
// они не экспортируются из модуля напрямую
// Если валидатор возвращает true - значение считается валидным
export const isExisty = <T = string>(value: T) => value !== undefined && value !== null;
export const isEmpty = <T = string>(value: T) => {
    if (typeof value === 'string') {
        return value.trim() === '';
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    return false;
};

export function isRequired<T = unknown>(value: T) {
    return isExisty(value) && !isEmpty(value);
}

export function isDeepRequired<T = unknown>({
    keyName,
    isValueValidCallback,
}: {
    keyName?: string;
    isValueValidCallback?: (value: T) => boolean;
}) {
    return (value: Array<T>) =>
        value.length !== 0 &&
        value.some((el) => {
            if (isValueValidCallback) {
                return isValueValidCallback(el);
            }

            return isRequired(isObject(el) ? el[keyName as keyof typeof el] : el);
        });
}

export function isRequiredConditional<TForm>(conditionalCallback: (formValues?: TForm) => boolean) {
    return <T = string>(value: T, _: T, formValues?: TForm) =>
        conditionalCallback(formValues) ? isRequired(value) : true;
}

export function isNumericOrEmpty(value?: string) {
    const regex = /^[-+]?(?:\d*[.])?\d+$/;

    if (!value) {
        return true;
    }

    if (isString(value)) {
        return !value || regex.test(value);
    }
    return false;
}

export function shouldBeNumericInInterval({min, max}: {min?: number; max?: number}) {
    return (value?: string) => {
        if (value && !Number.isNaN(Number(value))) {
            return ((!min && min !== 0) || Number(value) >= min) && (!max || Number(value) <= max);
        }

        return true;
    };
}

export function shouldBeNotEqualToPrevious<T = string>(value: T, initial: T) {
    return !isEqual(value as unknown, initial);
}

export function matchRegex(regex: string | RegExp) {
    const regexp = regex instanceof RegExp ? regex : new RegExp(`^${regex}$`);
    return function (value: string) {
        return regexp.test(value);
    };
}

export function matchTicketNamePattern() {
    return <T = string>(value: T) => (value ? matchRegex(TICKET_NAME)(String(value)) : true);
}

export function matchTimePattern() {
    return <T = string>(value: T) => (value ? matchRegex(TIME_HH_MM)(String(value)) : true);
}

export function matchSystemNamePattern() {
    return <T = string>(value: T) =>
        value ? matchRegex(LATIN_NUMBERS_AND_UNDERSCOR)(String(value)) : true;
}

export function matchSystemNamePatternWithDash() {
    return <T = string>(value: T) =>
        value ? matchRegex(LATIN_NUMBERS_AND_UNDERSCOR_AND_DASH)(String(value)) : true;
}

export function matchUnsubscribeListPattern() {
    return <T = string>(value: T) =>
        value ? matchRegex(LATIN_NUMBERS_AND_DASH)(String(value)) : true;
}

export function matchEmailPattern() {
    return <T = string>(value: T) => (value ? matchRegex(EMAIL_REGEXP)(String(value)) : true);
}

export function matchLinkPattern() {
    return <T = string>(value: T) => (value ? matchRegex(LINK)(String(value)) : true);
}

export function isDateValid() {
    return <T extends ConfigType = string>(value: T) => (value ? dayjs(value).isValid() : true);
}

export function shouldHaveLengthInInterval({min, max}: {min?: number; max?: number}) {
    return (value?: string) => {
        if (value) {
            return ((!min && min !== 0) || value.length >= min) && (!max || value.length <= max);
        }

        return true;
    };
}

export function matchLatinNamePattern() {
    return <T = string>(value: T) =>
        value ? matchRegex(LATIN_NUMBER_AND_SPACES)(String(value)) : true;
}

export function matchCyrillicNamePattern() {
    return <T = string>(value: T) =>
        value ? matchRegex(CYRILLIC_NUMBER_AND_SPACES)(String(value)) : true;
}
