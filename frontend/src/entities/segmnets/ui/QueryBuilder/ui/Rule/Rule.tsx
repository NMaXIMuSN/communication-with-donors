import React, {Component, MouseEventHandler, RefObject} from 'react';
import cn from 'classnames';
import {ImmutableList, Utils, ValueSource} from '@react-awesome-query-builder/core';
import {ChevronDown, Copy, TriangleExclamation, Xmark} from '@gravity-ui/icons';
import {Icon, Link, Text, Tooltip} from '@gravity-ui/uikit';

import {noop} from 'lodash';
import {DragHandleIcon} from '@/shared/ui/icons';

import {Widget} from '../Widget/Widget';
import {OperatorWrapper} from '../OperatorWrapper/OperatorWrapper';
import {OperatorOptions} from '../OperatorOptions/OperatorOptions';
import {RuleContainer} from '../RuleContainer/RuleContainer';
import {Draggable, IDraggable} from '../Draggable/Draggable';
import {Col, ConfirmFn, libOnPropsChanged} from '../../lib';
import {IConfig, IQbUtils, ItemType} from '../../types';

import styles from './Rule.module.scss';

const QbUtils = Utils as IQbUtils;
const {getFieldConfig, getOperatorConfig, getFieldWidgetConfig} = QbUtils.ConfigUtils;
const {getFieldPathLabels} = QbUtils.RuleUtils;

export interface IRule extends IDraggable {
    attrRef: React.MutableRefObject<HTMLDivElement | null>;
    id: string;
    groupId?: string;
    field?: string;
    selectedField: string | null;
    operator?: string;
    selectedOperator?: string | null;
    value: ImmutableList<string> | null;
    operatorOptions: unknown;
    valueSrc: ImmutableList<ValueSource>;
    reordableNodesCnt: number;
    totalRulesCnt: unknown;
    asyncListValues: unknown[];
    isLocked: boolean;
    parentReordableNodesCnt: number;
    parentField?: string | null;
    setField: Function;
    setOperator: (fieldPath: string) => void;
    copyRule: Function;
    setOperatorOption: Function;
    setLock: Function;
    removeSelf: Function;
    setValue: Function;
    setValueSrc: Function;
    onDragStart: Function;
    valueError: ImmutableList<string>;
    config: IConfig;
    confirmFn?: Function;
    handleDraggerMouseDown?: MouseEventHandler;
    renderCustomRule?: (props: {
        drag: React.ReactNode | null;
        del: React.ReactNode | null;
        widget: React.ReactNode | null;
        operator: React.ReactNode | null;
        field: React.ReactNode | null;
        body: React.ReactNode | null;
        lock: React.ReactNode | null;
        copy: React.ReactNode | null;
        expand: React.ReactNode | null;
        error: React.ReactNode | null;
    }) => React.ReactNode;
    ruleData?: {
        importAttrName?: string;
        importGroupName?: string;
    };
}

interface IMeta {
    selectedFieldPartsLabels: string[];
    selectedFieldWidgetConfig: {
        operatorInlineLabel?: string;
        fullWidth: unknown;
        hideOperator: unknown;
    };
    showOperator: boolean | null;
    showOperatorLabel?: boolean;
    showDragIcon?: boolean;
    showWidget?: boolean;
    showOperatorOptions?: boolean;
    name?: string;
    label?: string;
    group?: string;
    groupPath?: string;
    sourceLabel?: string;
    isErrorField?: boolean;
}

class Rule extends Component<IRule> {
    meta: IMeta;
    state: {
        isSubtitleOpened: boolean;
        canShowExpand: boolean;
    };
    subtitleRef: RefObject<HTMLDivElement>;

    constructor(props: IRule) {
        super(props);
        libOnPropsChanged(this);
        this.removeSelf = this.removeSelf.bind(this);
        this.setLock = this.setLock.bind(this);

        this.meta = this.getMeta(props);
        this.onPropsChanged(props);
        this.state = {
            isSubtitleOpened: false,
            canShowExpand: false,
        };
        this.subtitleRef = React.createRef();
    }

    componentDidMount(): void {
        this.checkSubtitleOverflow();
    }

    componentDidUpdate(): void {
        this.checkSubtitleOverflow();
    }

    onPropsChanged(nextProps: IRule) {
        const prevProps = this.props;
        const keysForMeta = [
            'selectedField',
            'selectedOperator',
            'config',
            'reordableNodesCnt',
            'isLocked',
        ];
        const needUpdateMeta =
            !this.meta ||
            keysForMeta
                .map((k) => nextProps[k as keyof IRule] !== prevProps[k as keyof IRule])
                .filter((ch) => ch).length > 0;

        if (needUpdateMeta) {
            this.meta = this.getMeta(nextProps);
        }
    }

    getMeta({selectedField, selectedOperator, config, reordableNodesCnt, isLocked}: IRule): IMeta {
        const selectedFieldPartsLabels = getFieldPathLabels(selectedField, config);
        const selectedFieldConfig = getFieldConfig(config, selectedField as string);
        const isSelectedGroup = selectedFieldConfig && selectedFieldConfig.type == '!struct';

        const isFieldAndOpSelected = selectedField && selectedOperator && !isSelectedGroup;
        const selectedOperatorConfig = getOperatorConfig(
            config,
            selectedOperator as string,
            selectedField as string,
        );
        const selectedOperatorHasOptions =
            selectedOperatorConfig &&
            (selectedOperatorConfig as {options: unknown}).options != null;
        const selectedFieldWidgetConfig =
            (getFieldWidgetConfig(
                config,
                selectedField as string,
                selectedOperator as string,
            ) as IMeta['selectedFieldWidgetConfig']) || ({} as IMeta['selectedFieldWidgetConfig']);
        const hideOperator = selectedFieldWidgetConfig.hideOperator;

        const showDragIcon = config.settings.canReorder && reordableNodesCnt > 0 && !isLocked;
        const showOperator = Boolean(selectedField) && !hideOperator;

        const showOperatorLabel =
            Boolean(selectedField) &&
            Boolean(hideOperator) &&
            Boolean(selectedFieldWidgetConfig.operatorInlineLabel);

        const showWidget = Boolean(isFieldAndOpSelected);
        const showOperatorOptions = Boolean(isFieldAndOpSelected && selectedOperatorHasOptions);

        const {importAttrName, importGroupName} = this.props.ruleData || {};
        const {name, label, group, groupPath, sourceLabel} = selectedField
            ? ((config.fields[selectedField] as {
                  name?: string;
                  label?: string;
                  group?: string;
                  groupPath?: string;
                  sourceLabel?: string;
              }) ?? {name: importAttrName, group: importGroupName})
            : {name: '', label: '', group: '', groupPath: '', sourceLabel: ''};

        const isErrorField = Boolean(selectedField && !selectedFieldPartsLabels.length);

        return {
            selectedFieldPartsLabels,
            selectedFieldWidgetConfig,
            showDragIcon,
            showOperator,
            showOperatorLabel,
            showWidget,
            showOperatorOptions,
            name,
            label,
            group,
            groupPath,
            sourceLabel,
            isErrorField,
        };
    }

    setLock(lock: boolean) {
        this.props.setLock(lock);
    }

    removeSelf() {
        const {renderConfirm, removeRuleConfirmOptions: confirmOptions} =
            this.props.config.settings;
        const doRemove = () => {
            this.props.removeSelf();
        };
        if (confirmOptions && !this.isEmptyCurrentRule() && renderConfirm) {
            renderConfirm({
                ...confirmOptions,
                onOk: doRemove,
                okText: '',
                title: '',
            });
        } else {
            doRemove();
        }
    }

    isEmptyCurrentRule() {
        return !(
            this.props.selectedField !== null &&
            this.props.selectedOperator !== null &&
            this.props.value &&
            this.props.value.filter((val) => val !== undefined).size > 0
        );
    }

    renderField() {
        if (!this.meta.selectedFieldPartsLabels) {
            return (
                <div className={styles.empty}>
                    <div className={styles.emptyContainer}>
                        <Text variant="subheader-1" color="secondary">
                            {this.props.config.settings.rulePlaceholder}
                        </Text>
                    </div>
                </div>
            );
        }

        return (
            <div
                className={cn(styles.fieldName, {
                    [styles.fieldNameError]: this.meta.isErrorField,
                })}
            >
                <Text variant="subheader-3">{this.meta.name || this.props.selectedField}</Text>
                {this.meta.group && (
                    <div
                        ref={this.subtitleRef}
                        className={cn(styles.subtitle, {
                            [styles.subtitleOpened]: this.state.isSubtitleOpened,
                        })}
                    >
                        <Text variant="body-1">
                            {this.meta.groupPath && (
                                <Link href={this.meta.groupPath} target="__blank">
                                    {this.meta.sourceLabel &&
                                        this.meta.sourceLabel + ' • ' + this.meta.group}
                                </Link>
                            )}
                            {!this.meta.groupPath && this.meta.group}
                        </Text>
                    </div>
                )}
            </div>
        );
    }

    renderOperator() {
        const {config, isLocked} = this.props;
        const {
            selectedFieldPartsLabels,
            selectedFieldWidgetConfig,
            showOperator,
            showOperatorLabel,
        } = this.meta;
        const {immutableOpsMode} = config.settings;

        return (
            <OperatorWrapper
                key="operator"
                config={config}
                selectedField={this.props.selectedField || ''}
                selectedOperator={this.props.selectedOperator || ''}
                setOperator={!immutableOpsMode ? this.props.setOperator : noop}
                selectedFieldPartsLabels={selectedFieldPartsLabels}
                showOperator={Boolean(showOperator)}
                showOperatorLabel={Boolean(showOperatorLabel)}
                selectedFieldWidgetConfig={selectedFieldWidgetConfig}
                readonly={Boolean(immutableOpsMode || isLocked)}
                id={this.props.id}
                groupId={this.props.groupId}
            />
        );
    }

    renderWidget() {
        const {config, valueError, isLocked} = this.props;
        const {showWidget} = this.meta;
        const {immutableValuesMode} = config.settings;

        if (!showWidget) return null;

        const setValueHandler = (...value: unknown[]) => {
            this.props.setValue(...value);
        };

        const widget = (
            <Widget
                key="values"
                field={this.props.selectedField}
                parentField={this.props.parentField}
                operator={this.props.selectedOperator}
                value={this.props.value}
                valueSrc={this.props.valueSrc}
                asyncListValues={this.props.asyncListValues}
                valueError={valueError}
                config={config}
                setValue={!immutableValuesMode ? setValueHandler : noop}
                readonly={Boolean(immutableValuesMode || isLocked)}
                operatorComponent={this.renderOperator()}
                id={this.props.id}
                groupId={this.props.groupId}
            />
        );

        return (
            <Col key={'widget-for-' + this.props.selectedOperator} className={styles.ruleValue}>
                {widget}
            </Col>
        );
    }

    renderOperatorOptions() {
        const {config} = this.props;
        const {showOperatorOptions} = this.meta;
        const {immutableOpsMode, immutableValuesMode} = config.settings;
        if (!showOperatorOptions) return null;

        const opOpts = (
            <OperatorOptions
                key="operatorOptions"
                selectedField={this.props.selectedField || ''}
                selectedOperator={this.props.selectedOperator || ''}
                operatorOptions={this.props.operatorOptions}
                setOperatorOption={!immutableOpsMode ? this.props.setOperatorOption : noop}
                config={config as IConfig}
                readonly={Boolean(immutableValuesMode)}
            />
        );

        return (
            <Col
                key={'op-options-for-' + this.props.selectedOperator}
                className="rule--operator-options"
            >
                {opOpts}
            </Col>
        );
    }

    renderError() {
        const {config, valueError} = this.props;
        const {showErrorMessage} = config.settings;
        let oneValueError =
            (valueError &&
                valueError
                    .toArray()
                    .filter((e) => Boolean(e))
                    .shift()) ||
            null;

        if (this.meta.isErrorField) {
            oneValueError = this.props.config.settings.ruleErrorLabel;
        }

        if (showErrorMessage && oneValueError) {
            return (
                <Tooltip
                    content={oneValueError}
                    placement={['left', 'bottom-end']}
                    closeDelay={0}
                    openDelay={500}
                    className={styles.tooltip}
                >
                    <div className={styles.iconWrapper}>
                        <Icon data={TriangleExclamation} />
                    </div>
                </Tooltip>
            );
        }
        return null;
    }

    renderDrag() {
        const {showDragIcon} = this.meta;

        return (
            <span
                key="rule-drag-icon"
                className={cn('qb-drag-handler rule--drag-handler', styles.dragIcon)}
                data-name={this.props.id}
                onMouseDown={showDragIcon ? this.props.handleDraggerMouseDown : noop}
            >
                <DragHandleIcon className={styles.icon} />
            </span>
        );
    }

    renderDel() {
        const {config, isLocked} = this.props;
        const {immutableGroupsMode, canDeleteLocked} = config.settings;

        return (
            !immutableGroupsMode &&
            (!isLocked || (isLocked && canDeleteLocked)) && (
                <div className={styles.del} onClick={() => this.removeSelf()}>
                    <Icon data={Xmark} size={16} />
                </div>
            )
        );
    }

    renderCopy() {
        if (this.meta.isErrorField || this.props.isLocked) return null;

        return (
            <div className={styles.copy} onClick={() => this.props.copyRule()}>
                <Icon data={Copy} size={16} />
            </div>
        );
    }

    checkSubtitleOverflow() {
        const canShowExpand =
            (this.subtitleRef.current &&
                this.subtitleRef.current.firstElementChild &&
                this.subtitleRef.current.getBoundingClientRect().width <
                    this.subtitleRef.current.firstElementChild.getBoundingClientRect().width) ||
            (this.subtitleRef.current &&
                this.subtitleRef.current.firstElementChild &&
                this.subtitleRef.current.firstElementChild.getBoundingClientRect().height >
                    parseInt(
                        window.getComputedStyle(this.subtitleRef.current.firstElementChild)
                            .lineHeight,
                    ) *
                        1.5);

        this.setState({
            isSubtitleOpened: this.state.isSubtitleOpened,
            canShowExpand: canShowExpand,
        });
    }

    renderExpand() {
        const isOpened = this.state.isSubtitleOpened;
        const canShowExpand = this.state.canShowExpand;

        const toggle = () => {
            this.setState({isSubtitleOpened: !isOpened});
        };

        if (!canShowExpand) return null;

        return (
            <div className={cn(styles.expand, {[styles.expandOpened]: isOpened})} onClick={toggle}>
                <Icon data={ChevronDown} size={16} />
            </div>
        );
    }

    renderLock() {
        const {config, isLocked, isTrueLocked} = this.props;
        const {lockLabel, lockedLabel, showLock, renderSwitch: Switch} = config.settings;

        return (
            showLock &&
            !(isLocked && !isTrueLocked) &&
            Switch && (
                <Switch
                    value={isLocked}
                    setValue={this.setLock}
                    label={lockLabel || ''}
                    checkedLabel={lockedLabel}
                    hideLabel
                    config={config}
                />
            )
        );
    }

    render() {
        const {showOperatorOptions, selectedFieldWidgetConfig} = this.meta;
        const {
            valueSrc,
            value,
            renderCustomRule = ({drag, del, field, body, lock, copy, expand, error}) => (
                <>
                    {drag}
                    <div className={styles.ruleBodyWrapper}>
                        <div className={styles.wrapper}>
                            {field}
                            {body}
                        </div>
                    </div>
                    <div className={cn('rule--header', styles.header)}>
                        {lock}
                        <div className={styles.buttons}>
                            {error}
                            {expand}
                            {copy}
                            {del}
                        </div>
                    </div>
                </>
            ),
        } = this.props;

        const canShrinkValue =
            valueSrc &&
            value &&
            valueSrc.first() == 'value' &&
            !showOperatorOptions &&
            value.size == 1 &&
            selectedFieldWidgetConfig &&
            selectedFieldWidgetConfig.fullWidth;

        const isEmptyRule = !this.meta.selectedFieldPartsLabels;

        const parts = [this.renderOperator(), this.renderWidget(), this.renderOperatorOptions()];

        const body = (
            <div
                key="rule-body"
                className={cn(styles.ruleBody, styles.field, {
                    'can--shrink--value': canShrinkValue,
                })}
            >
                {parts}
            </div>
        );

        const error = this.renderError();
        const drag = isEmptyRule ? null : this.renderDrag();
        const del = isEmptyRule ? null : this.renderDel();
        const copy = isEmptyRule ? null : this.renderCopy();
        const expand = isEmptyRule ? null : this.renderExpand();
        const lock = this.renderLock();

        return (
            <div className={cn(styles.rule, {[styles.ruleEmpty]: isEmptyRule})}>
                {renderCustomRule({
                    widget: this.renderWidget(),
                    operator: this.renderOperator(),
                    drag,
                    del,
                    field: this.renderField(),
                    body,
                    lock,
                    copy,
                    expand,
                    error,
                })}
            </div>
        );
    }
}

export default RuleContainer(Draggable(ItemType.rule)(ConfirmFn(Rule as any) as any));
