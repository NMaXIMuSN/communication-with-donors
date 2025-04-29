import {PureComponent} from 'react';
import {Utils} from '@react-awesome-query-builder/core';

import {IConfig} from '../../types';

const {getOperatorConfig} = Utils.ConfigUtils;

interface IOperatorOptions {
    operatorOptions: unknown;
    setOperatorOption: Function;
    config: IConfig;
    selectedField: string;
    selectedOperator: string;
    readonly: boolean;
}

export class OperatorOptions extends PureComponent<IOperatorOptions> {
    render() {
        if (!this.props.selectedOperator) return null;
        const operatorDefinitions = getOperatorConfig(
            this.props.config,
            this.props.selectedOperator,
            this.props.selectedField,
        ) as any;
        if (typeof operatorDefinitions.options === 'undefined') {
            return null;
        }

        const {factory: optionsFactory, ...basicOptionsProps} = operatorDefinitions.options;
        const optionsProps = Object.assign({}, basicOptionsProps, {
            config: this.props.config,
            field: this.props.selectedField,
            operator: this.props.selectedOperator,
            options: this.props.operatorOptions,
            setOption: this.props.setOperatorOption,
            readonly: this.props.readonly,
        });
        const optionsCmp = optionsFactory(optionsProps);
        const name = this.props.selectedOperator;

        return (
            <div className={`rule--operator rule--operator--${name.toUpperCase()}`}>
                {optionsCmp}
            </div>
        );
    }
}
