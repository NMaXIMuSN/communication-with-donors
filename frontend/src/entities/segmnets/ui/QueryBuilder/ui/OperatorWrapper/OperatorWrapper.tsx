import {PureComponent} from 'react';
import cn from 'classnames';

import {IOperator} from '../Operator/Operator';
import {Operator} from '..';
import {Col} from '../../lib';

import styles from './OperatorWrapper.module.scss';

interface IOperatorWrapper extends IOperator {
    selectedFieldPartsLabels: unknown[];
    showOperator: boolean;
    showOperatorLabel: boolean;
    selectedFieldWidgetConfig: {
        operatorInlineLabel?: string;
    };
}

export class OperatorWrapper extends PureComponent<IOperatorWrapper> {
    render() {
        const {
            config,
            selectedField,
            selectedOperator,
            setOperator,
            selectedFieldPartsLabels,
            showOperator,
            showOperatorLabel,
            selectedFieldWidgetConfig,
            readonly,
            id,
            groupId,
        } = this.props;

        const operator = showOperator && (
            <Col
                key={'operators-for-' + (selectedFieldPartsLabels || []).join('_')}
                className={cn('rule--operator', styles.wrapper)}
            >
                {config.settings.showLabels && (
                    <label className="rule--label">{config.settings.operatorLabel}</label>
                )}
                <Operator
                    key="operator"
                    config={config}
                    selectedField={selectedField}
                    selectedOperator={selectedOperator}
                    setOperator={setOperator}
                    readonly={readonly}
                    id={id}
                    groupId={groupId}
                />
            </Col>
        );

        const hiddenOperator = showOperatorLabel && (
            <Col
                key={'operators-for-' + (selectedFieldPartsLabels || []).join('_')}
                className="rule--operator"
            >
                <div className={styles.ruleOperatorWrapper}>
                    {config.settings.showLabels ? (
                        <label className="rule--label">&nbsp;</label>
                    ) : null}
                    <div className={styles.ruleOperatorTextWrapper}>
                        <span className="rule--operator-text">
                            {selectedFieldWidgetConfig.operatorInlineLabel}
                        </span>
                    </div>
                </div>
            </Col>
        );

        return [operator, hiddenOperator];
    }
}
