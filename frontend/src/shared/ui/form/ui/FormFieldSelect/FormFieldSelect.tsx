import React, {useCallback, useEffect, useState} from 'react';
import {FieldRenderProps} from 'react-final-form';
import cn from 'classnames';
import {FormField} from '../FormField/FormField';
import {
    Button,
    Label,
    Select,
    SelectOption,
    type SelectProps,
    Text,
    TextInput,
} from '@gravity-ui/uikit';

import {PickKnownFieldProps, resolveError} from '@/shared/ui/form';
import {isBoolean} from '@/shared/lib';

import {SelectItemValue, SelectType} from './types';

import styles from './FormFieldSelect.module.scss';

interface IFormFieldSelectProps<T extends SelectType>
    extends PickKnownFieldProps<FieldRenderProps<SelectItemValue, HTMLElement>> {
    selectClassName?: string;
    className?: string;
    type?: T;
    value?: string[];
    transformSelectedValue?: (value?: string[]) => string[];
    onUpdate?: (value?: string[]) => void;
    withLabels?: boolean;
    noErrorMessage?: boolean;
    hasConfirmation?: boolean;
}

const getPreparedValue = (value?: SelectItemValue) => {
    if (!value) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
};

function FormFieldSelect<T extends SelectType, TValue>(
    props: IFormFieldSelectProps<T> & SelectProps<TValue>,
) {
    const {
        meta,
        input,
        className,
        onUpdate,
        transformSelectedValue,
        selectClassName,
        popupClassName,
        withLabels = false,
        options,
        multiple,
        noErrorMessage,
        disabled,
        hasConfirmation,
        defaultOpen,
        open,
        onOpenChange,
        ...selectProps
    } = props;
    const error = resolveError(meta);

    const [isOpen, setIsOpen] = useState(open ?? defaultOpen ?? false);

    const [valueState, setValueState] = useState<IFormFieldSelectProps<T>['value']>(
        getPreparedValue(input.value),
    );

    const selectedOptions = (options || []).filter((el) => {
        return 'value' in el && getPreparedValue(input.value).includes(el.value);
    }) as SelectOption<TValue>[];

    const onDeleteOption = (optionValue: string) => {
        if (Array.isArray(input.value)) {
            const newValue = input.value.filter((el) => el !== optionValue);
            input.onChange(newValue);
        } else {
            input.onChange('');
        }
    };

    const transformValue = useCallback(
        (value: IFormFieldSelectProps<T>['value']) => {
            if (transformSelectedValue) {
                return transformSelectedValue(value);
            } else if (multiple) {
                return value;
            } else {
                return value ? value[0] : undefined;
            }
        },
        [multiple, transformSelectedValue],
    );

    const handleUpdate = useCallback(
        (value: IFormFieldSelectProps<T>['value']) => {
            const transformedValue = transformValue(value);

            if (hasConfirmation) {
                setValueState(transformedValue as string[]);
            } else {
                input.onChange(transformedValue);
                onUpdate?.(value);
            }
        },
        [input, onUpdate, transformValue, hasConfirmation],
    );

    const onConfirm = () => {
        input.onChange(valueState);
        onUpdate?.(valueState);
        setIsOpen(false);
    };

    const onCancel = () => {
        setValueState(getPreparedValue(input.value));
        setIsOpen(false);
    };

    const onOpenChangeHandler = (value: boolean) => {
        setValueState(getPreparedValue(input.value));
        setIsOpen(value);
    };

    useEffect(() => {
        onOpenChange?.(isOpen);
    }, [onOpenChange, isOpen]);

    return (
        <FormField
            meta={meta}
            className={cn(styles.formField, className, {
                // компонент FormField делает String(error), в некоторых случаях нам нужно подсветить инпут красным, но не выводить сообщение
                // в таких случаях валидатор(проектный) возвращает true, но из-за приведения к строке оно выводится в верстке
                // с помощью этого стиля скрываем такую ошибку
                [styles.hideErrorText]: isBoolean(meta.error),
            })}
            noErrorMessage={noErrorMessage}
        >
            <Select
                className={cn(styles.select, selectClassName, {
                    [styles.selectWithLabels]: withLabels,
                })}
                value={hasConfirmation ? valueState : getPreparedValue(input.value)}
                popupClassName={cn(styles.popup, popupClassName)}
                onUpdate={handleUpdate}
                options={options}
                multiple={multiple}
                validationState={error ? 'invalid' : undefined}
                disabled={disabled}
                open={isOpen}
                onOpenChange={onOpenChangeHandler}
                renderFilter={({onChange, onKeyDown, ref, value}) => {
                    return (
                        <div className={styles.filterWrapper}>
                            <TextInput
                                controlRef={ref}
                                value={value}
                                placeholder={'Поиск'}
                                onChange={(e) => onChange(e.target.value)}
                                onKeyDown={onKeyDown}
                            />
                        </div>
                    );
                }}
                renderEmptyOptions={
                    selectProps.filterable
                        ? () => {
                              return (
                                  <div className={styles.emptyOptionsWrapper}>
                                      <Text>Ничего не найдено</Text>
                                  </div>
                              );
                          }
                        : undefined
                }
                renderPopup={
                    hasConfirmation
                        ? (popupItems) => {
                              return (
                                  <>
                                      {popupItems.renderFilter()}
                                      {popupItems.renderList()}
                                      {multiple && (
                                          <div className={styles.ActionsMultipleFooter}>
                                              <Button
                                                  size="l"
                                                  view="normal"
                                                  onClick={() => {
                                                      onCancel();
                                                  }}
                                              >
                                                  Отмена
                                              </Button>
                                              <Button
                                                  size="l"
                                                  view="action"
                                                  onClick={() => {
                                                      onConfirm();
                                                  }}
                                              >
                                                  Применить
                                              </Button>
                                          </div>
                                      )}
                                  </>
                              );
                          }
                        : undefined
                }
                {...selectProps}
            />
            {withLabels && (
                <div className={styles.labels}>
                    {selectedOptions.map((el) => (
                        <Label
                            key={el.value}
                            size="xs"
                            theme="normal"
                            type="close"
                            onCloseClick={() => onDeleteOption(el.value)}
                            disabled={disabled}
                        >
                            {el.content}
                        </Label>
                    ))}
                </div>
            )}
        </FormField>
    );
}

export default React.memo(FormFieldSelect);
