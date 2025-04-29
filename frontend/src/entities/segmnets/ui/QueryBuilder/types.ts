import {
    Actions,
    Config,
    ImmutableList,
    ImmutableTree,
    InputAction,
    Settings,
    Utils,
} from '@react-awesome-query-builder/core';
import {Dispatch} from 'react';

export interface IBuilderProps {
    tree: ImmutableTree;
    config: Config;
    actions: Actions;
    dispatch: Dispatch<InputAction>;
}

export type IdPath = Array<string> | ImmutableList<string>;

type Empty = null | undefined;

export type TJsonItem = TJsonGroup | TJsonRule;

export type TJsonRule = {
    type: ItemType.rule;
    id?: string;
    properties: IRuleProperties;
};

export type RuleValue = boolean | number | string | Date | Array<string> | any;
type ValueSource = 'value' | 'field' | 'func' | 'const';
type AnyObject = object;

interface IBasicItemProperties {
    isLocked?: boolean;
}

export interface IRuleProperties extends IBasicItemProperties {
    field: string | Empty;
    operator: string | Empty;
    value: Array<RuleValue>;
    valueSrc?: Array<ValueSource>;
    valueType?: Array<string>;
    valueError?: Array<string>;
    operatorOptions?: AnyObject;
    data?: {
        importAttrName?: string;
        importGroupName?: string;
    };
}

interface IGroupProperties extends IBasicItemProperties {
    conjunction: string;
    not?: boolean;
}

export type TJsonGroup = {
    id?: string;
    label?: string;
    type: ItemType.group;
    children1?: {[id: string]: TJsonItem} | TJsonItem[];
    properties?: IGroupProperties;
};

export interface IDrag {
    id: string;
    itemInfo: {
        index: string;
        parent: string;
        parentType: string;
        top: number;
        lev: number;
        id: string;
        type: string;
        caseId: string | null;
        collapsed: unknown;
        node: ImmutableTree;
        prev: number;
        next: number;
        isLocked: boolean;
        _height: number;
        leafsCount: number;
        isDefaultCase: boolean;
        path: string[];
        children: string[] | null;
    };
    treeEl: HTMLElement;
    treeElContainer: HTMLElement;
    plX: number;
    plY: number;
    y: number;
    x: number;
    w: number;
    h: number;
    mousePos: object;
    startMousePos: object;
    paddingLeft: number;
    name: string;
    clientY: number;
    clientX: number;
    scrollTop: number;
    paddingX: number;
    paddingY: number;
}

export interface IQbUtils extends Utils {
    clone: Function;
    DefaultUtils: {
        defaultRuleProperties: Function;
        createListFromArray: Function;
        emptyProperies: Function;
        defaultGroupConjunction: Function;
        defaultRoot: Function;
    };
    TreeUtils: {
        getFlatTree: Function;
        expandTreeSubpath: Function;
        getTotalRulesCountInTree: Function;
        expandTreePath: Function;
        getTotalReordableNodesCountInTree: Function;
    };
    RuleUtils: {
        getValueSourcesForFieldOp: Function;
        getWidgetsForFieldOp: Function;
        getWidgetForFieldOp: Function;
        getFieldPathLabels: Function;
        getValueLabel: Function;
    };
}

type TSettings = Settings & {
    renderConfirm: Function;
    renderBeforeActions: Function;
    renderAfterActions: Function;
    renderConjs: Function;
    renderProvider: Function;
    renderButton: Function;
    renderSwitch: Function;
    renderOperator: Function;
    renderButtonGroup: Function;
    renderValueSources: Function;
    renderRuleError: Function;
    showLabels: boolean;
    useConfirm: Function;
    rulePlaceholder: string;
    ruleErrorLabel: string;
    defaultSliderWidth: string;
    defaultSelectWidth: string;
    defaultSearchWidth: string;
    defaultMaxRows: number;
    renderSize: string;
    maxLabelsLength: number;
    showLock: boolean;
    showNot: boolean;
    forceShowConj: boolean;
    groupActionsPosition:
        | 'topLeft'
        | 'topCenter'
        | 'topRight'
        | 'bottomLeft'
        | 'bottomCenter'
        | 'bottomRight';
};

export interface IConfig extends Config {
    settings: TSettings;
}

export enum ItemType {
    rule = 'rule',
    group = 'group',
}

export enum RulePosition {
    only = 'Only',
    start = 'Start',
    middle = 'Middle',
    end = 'End',
}

export interface ITreeNode {
    id: string;
    type: string;
    label?: string;
    children1?: {[key: string]: ITreeNode};
    path: string[];
}

export enum WidgetTypes {
    number = 'integer',
    text = 'string',
    boolean = 'boolean',
    booleanTrue = 'boolean_true',
    select = 'string_select',
    date = 'date',
    dateNow = 'date_now',
    handbookItem = 'handbook_item',
    afishaCity = 'afisha_city',
    afishaTag = 'afisha_tag',
    afishaEvent = 'afisha_event',
    cryptaSegments = 'crypta_segments',
    musicGenre = 'music_genre',
    musicGenreCode = 'music_genre_code',
    musicGenreId = 'music_genre_id',
    spam = 'spam',
    spamType = 'spam_type',
    campaign = 'campaign',
    campaignType = 'campaign_type',
    double = 'double',
    gender = 'gender',
}

export enum DataType {
    integer = 'integer',
    string = 'string',
    boolean = 'boolean',
    stringSelectize = 'string_select',
    date = 'date',
    dateNow = 'date_now',
}

export enum Operators {
    equals = 'equals',
    in = 'in',
    notIn = 'notIin',
    gt = 'gt',
    gte = 'gte',
    lt = 'lt',
    lte = 'lte',
    not = 'not',
    startsWith = 'startsWith',
    endsWith = 'endsWith',
    contains = 'contains',
}

export type TField = {
    uiPath?: string;
    controlName?: string;
    group: string;
    groupLabel: string;
    sourceLabel: string;
    name: string;
    label: string;
    type: string;
    id: string;
    valueSources?: string[];
    fieldSettings?: {
        listValues?: {
            value?: string;
            title?: string;
        }[];
        allowCustomValues?: boolean;
    };
    operators?: Operators[];
    defaultOperator?: Operators;
};

interface IField {
    id: string;
    name: string;
    label: string;
    group: string;
    groupLabel: string;
}

export interface IGroupedField {
    id: string;
    label: string;
    uiPath?: string;
    sourceLabel?: string;
    fields: IField[];
}
