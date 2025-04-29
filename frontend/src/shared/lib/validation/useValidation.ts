import {useCallback, useRef} from 'react';

import {isEqual} from 'lodash';

export type Validator<TScheme = {}, TValue = string> = {
    validationCallback: (value: TValue, initialValue?: TValue, formValue?: TScheme) => boolean;
    errorMessage?: string | boolean;
};

export type ValidationScheme<TScheme extends object> = {
    [key in keyof TScheme]:
        | Validator<TScheme, TScheme[key]>[]
        | {[subKey: string]: Validator<TScheme, TScheme[key]>[]};
};

type ArrayValidationResult = Array<Record<string, string | boolean | undefined>>;

export type FormValidationResult<TScheme> = {
    [key in keyof TScheme]: undefined | string | boolean | ArrayValidationResult;
};

type Props<TScheme extends object> = {
    scheme: ValidationScheme<TScheme>;
    withCache?: boolean;
    defaultValue?: {
        [key in keyof TScheme]: TScheme[keyof TScheme];
    };
    dontSetDefaultIfEmpty?: boolean;
    onValidCallback?: ({values, isValid}: {values: TScheme; isValid: boolean}) => void;
};

export const ARRAY_INDICATOR = '[]';
export const getSchemeNameWithArrayIndicator = (key: string) => `${key}${ARRAY_INDICATOR}`;
export const getSchemeArrayItemKey = (key: string, index: number) => `${key}.${index}`;

export function useValidation<TScheme extends object>({
    scheme,
    withCache = true,
    defaultValue,
    dontSetDefaultIfEmpty = false,
    onValidCallback,
}: Props<TScheme>) {
    const validationResultCache = useRef<Map<string, undefined | boolean | string>>(new Map());
    const prevFormValue = useRef<TScheme>({} as TScheme);

    const validate = useCallback(
        (
            key: keyof TScheme,
            value: TScheme[keyof TScheme],
            formValue: TScheme,
        ): undefined | string | boolean => {
            const cacheValueKey = `${String(key)}_${JSON.stringify(value)}`;
            const cacheErrorValue = validationResultCache.current.get(cacheValueKey);

            if (cacheErrorValue && withCache) {
                return cacheErrorValue;
            }

            let errorMessage: string | boolean | undefined;

            if (!scheme[key]) {
                return undefined;
            }

            // так как массивы проверяются отдельно в validateForm и тут проверка нужна для типов
            if (!Array.isArray(scheme[key])) {
                return undefined;
            }

            (scheme[key] as Validator<TScheme, TScheme[keyof TScheme]>[]).every((item) => {
                if (!item.validationCallback(value, defaultValue && defaultValue[key], formValue)) {
                    errorMessage = item.errorMessage || true;
                    return false;
                }

                return true;
            });

            if (withCache) {
                validationResultCache.current.set(cacheValueKey, errorMessage);
            }

            return errorMessage;
        },
        [scheme, withCache, defaultValue],
    );

    const validateForm = useCallback(
        (formValue: TScheme) => {
            if (defaultValue && !dontSetDefaultIfEmpty) {
                const valuesKeys = Object.keys(formValue);

                Object.keys(scheme).forEach((inititalKey) => {
                    if (!valuesKeys.includes(inititalKey)) {
                        const typedKey = inititalKey as keyof TScheme;

                        formValue[typedKey] = defaultValue[typedKey];
                    }
                });
            }

            const result = {} as FormValidationResult<TScheme>;

            Object.keys(scheme).forEach((key) => {
                const typedKey = key as keyof TScheme;
                const keyWithoutIndicator = String(typedKey).replace(ARRAY_INDICATOR, '');

                const value = formValue[keyWithoutIndicator as keyof TScheme];

                // Отдельно проверяем массив
                if (String(typedKey).includes(ARRAY_INDICATOR) && Array.isArray(value)) {
                    const fieldScheme = scheme[typedKey];

                    // Поле схемы не явялется массивом, а значит поле формы является массивом состоящим из объектов
                    // и каждый элемент должен быть провалидирован по вложенной схеме
                    if (!Array.isArray(fieldScheme)) {
                        // устанавливаем подефолту пустой массив результата
                        result[keyWithoutIndicator as keyof TScheme] = [];

                        // Проверяем каждый элемент массива
                        value.forEach((itemValue) => {
                            const arrayItemValidationResult: Record<
                                string,
                                string | boolean | undefined
                            > = {};

                            Object.keys(fieldScheme).forEach((fieldSchemeKey) => {
                                // Достаем валидаторы вложенной схемы
                                const validators = fieldScheme[fieldSchemeKey];

                                validators.forEach((validator) => {
                                    if (
                                        !validator.validationCallback(
                                            itemValue[fieldSchemeKey],
                                            undefined,
                                            itemValue,
                                        )
                                    ) {
                                        arrayItemValidationResult[fieldSchemeKey] =
                                            validator.errorMessage || true;
                                    }
                                });
                            });

                            // Пушим результат проверки целиком
                            (
                                result[
                                    keyWithoutIndicator as keyof TScheme
                                ] as ArrayValidationResult
                            ).push(arrayItemValidationResult);
                        });
                    } else {
                        // Удалять индикатор([]) необходимо, так как в противном случае файнал форм по какой-то причени
                        // не цепляет значение к элементам массива
                        value.forEach((itemValue, indexValue) => {
                            const arrayItemKeyValue = getSchemeArrayItemKey(
                                keyWithoutIndicator,
                                indexValue,
                            ) as keyof TScheme;

                            // тут указываем typedKey, так как валидаторы находятся в поле с названием родителя
                            const validationResult = validate(typedKey, itemValue, formValue);

                            result[arrayItemKeyValue] = validationResult;
                        });
                    }
                } else {
                    const validationResult = validate(typedKey, value, formValue);

                    result[typedKey] = validationResult;
                }
            });

            const isValid = Object.values(result).every((validationRes) => !validationRes);

            if (
                onValidCallback &&
                !isEqual(
                    formValue as Record<string, unknown>,
                    prevFormValue.current as Record<string, unknown>,
                )
            ) {
                prevFormValue.current = formValue;
                onValidCallback({values: formValue, isValid});
            }

            return result;
        },
        [scheme, defaultValue, dontSetDefaultIfEmpty, validate, onValidCallback],
    );

    const cleanUpCache = useCallback(() => {
        validationResultCache.current = new Map();
    }, []);

    return {
        validate,
        validateForm,
        cleanUpCache,
    };
}
