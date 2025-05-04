import React, {Component} from 'react';
import {FieldItems, Utils} from '@react-awesome-query-builder/core';
import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';

import {libOnPropsChanged} from '../../lib';
import {IConfig} from '../../types';

const {getFieldConfig, getOperatorConfig} = Utils.ConfigUtils;

export interface IOperator {
    config: IConfig;
    selectedField: string;
    selectedOperator: string;
    readonly: boolean;
    customProps?: any;
    groupId?: string;
    id: string;
    setOperator: (fieldPath: string) => void;
}

class Operator extends Component<IOperator> {
    meta: object;

    constructor(props: IOperator) {
        super(props);
        libOnPropsChanged(this);

        this.meta = this.getMeta(props);
        this.onPropsChanged(props);
    }

    onPropsChanged(nextProps: IOperator) {
        const prevProps = this.props;
        const keysForMeta = ['config', 'selectedField', 'selectedOperator'];
        const needUpdateMeta =
            !this.meta ||
            keysForMeta
                .map((k) => {
                    return nextProps[k as keyof IOperator] !== prevProps[k as keyof IOperator];
                })
                .filter((ch) => ch).length > 0;

        if (needUpdateMeta) {
            this.meta = this.getMeta(nextProps);
        }
    }

    getMeta({config, selectedField, selectedOperator}: IOperator): object {
        const fieldConfig = getFieldConfig(config, selectedField);
        const operators = fieldConfig?.operators;
        const operatorOptions = mapValues(
            pickBy(config.operators, (_, key) => operators?.indexOf(key) !== -1),
            (_opts, op) => getOperatorConfig(config, op, selectedField),
        );
        const items = this.buildOptions(config, operatorOptions, operators);
        const isOpSelected = Boolean(selectedOperator);
        const currOp = isOpSelected ? operatorOptions[selectedOperator] : null;
        const selectedOpts = currOp || {};
        const placeholder = this.props.config.settings.operatorPlaceholder;
        const selectedKey = selectedOperator;
        const selectedKeys = isOpSelected ? [selectedKey] : null;
        const selectedPath = selectedKeys;
        let selectedLabel;
        if ('label' in selectedOpts) {
            selectedLabel = selectedOpts.label;
        }

        return {
            placeholder,
            items,
            selectedKey,
            selectedKeys,
            selectedPath,
            selectedLabel,
            selectedOpts,
            fieldConfig,
        };
    }

    buildOptions(_: IConfig, fields: any, ops?: string[]) {
        if (!fields || !ops) return null;

        return keys(fields)
            .sort((a, b) => ops.indexOf(a) - ops.indexOf(b))
            .map((fieldKey) => {
                const field = fields[fieldKey];
                const label = field.label;
                return {
                    key: fieldKey,
                    path: fieldKey,
                    label,
                };
            });
    }

    render() {
        const {config, customProps, setOperator, readonly, id, groupId} = this.props;
        const {renderOperator} = config.settings;
        let items = [] as FieldItems;

        if ('items' in this.meta) {
            items = this.meta.items as FieldItems;
        }

        const renderProps = {
            id,
            groupId,
            config,
            customProps,
            readonly,
            setField: setOperator,
            items,
            selectedKey: null,
            ...this.meta,
        };

        if (!renderProps.items || !renderOperator) return null;

        return renderOperator(renderProps);
    }
}

export default React.memo(Operator);
