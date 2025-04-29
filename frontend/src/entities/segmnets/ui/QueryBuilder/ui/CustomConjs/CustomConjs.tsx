import {ChangeEvent, FC} from 'react';
import {SegmentedRadioGroup} from '@gravity-ui/uikit';
import {ConjsProps} from '@react-awesome-query-builder/core';

import styles from './CustomConjs.module.scss';

const CustomConjs: FC<ConjsProps> = ({
    id,
    not,
    setNot,
    conjunctionOptions,
    setConjunction,
    disabled,
    readonly,
    showNot,
}) => {
    const onNotChange = (e: ChangeEvent<HTMLInputElement>) => setNot(e.target.checked);
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setConjunction(e.target.value);

    const renderNot = () => {
        const postfix = 'not';

        if (!showNot) return null;

        return (
            <>
                <input
                    key={id + postfix}
                    type="checkbox"
                    id={id + postfix}
                    checked={not}
                    disabled={readonly}
                    onChange={onNotChange}
                    className={styles.input}
                />
                <label key={id + postfix + 'label'} htmlFor={id + postfix} className={styles.label}>
                    НЕ
                </label>
            </>
        );
    };

    const renderOptions = () => {
        let checkedValue;

        const options = conjunctionOptions
            ? Object.keys(conjunctionOptions).map((key) => {
                  const {label, checked} = conjunctionOptions[key];

                  if (checked) checkedValue = key;

                  return {
                      value: key,
                      content: label,
                      checked,
                  };
              })
            : [];

        return (
            <SegmentedRadioGroup
                options={options}
                value={checkedValue}
                disabled={readonly || disabled}
                onChange={onChange}
                className={styles.radio}
                size="s"
            />
        );
    };

    return (
        <div className={styles.wrapper}>
            {renderNot()}
            {renderOptions()}
        </div>
    );
};

export default CustomConjs;
