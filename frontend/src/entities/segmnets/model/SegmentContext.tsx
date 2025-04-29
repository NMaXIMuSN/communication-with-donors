import {ImmutableTree, JsonTree, Utils} from '@react-awesome-query-builder/core';
import React, {PropsWithChildren, useCallback, useState} from 'react';
import {
    IConfig,
    INITIAL_QUERY_VALUE,
    IQueryBuilderGroup,
    ItemType,
    TField,
    TJsonGroup,
    TJsonRule,
    addLabels,
    checkHaveAllAttributes,
    convertQueryBuilderToTJson,
    convertTJsonToQueryBuilder,
    getConfig,
    getFieldArray,
    getUniqueFieldsRecursively,
} from '../ui/QueryBuilder';
import {Source} from '@/entities/sources/api/fetchers';
import {ISegmentWithUserInfo, SegmentFilter} from '../api/fetchers';
import {isEqual} from 'lodash';
import {toaster} from '@/shared/toaster/notification';
import {useCalculatedSegmentMutation, useUpdateSegmentMutation} from '../api/queryHook';
import {Tabs} from '@/shared/ui/Tabs/Tabs';
import {Button, Flex} from '@gravity-ui/uikit';

export interface ICalculationState {
    tree: ImmutableTree | undefined;
    config: IConfig | undefined;
    sources: Source[];
    isExpertMode: boolean;
    yql: string | undefined;
    // exportFilterData: Schemas.SegmentFilterModel | undefined;
}

interface IContextValue {
    state: {
        config: IConfig;
        tree: ImmutableTree;
        segment: ISegmentWithUserInfo;
        sources: Source[];
        limit?: number;
    };
    actions: {
        setTree: (tree: ImmutableTree) => void;
        addNewSource: (source: Source) => void;
        deleteSource: (id: string) => void;
        onSave: () => Promise<void>;
        setLimit: (value?: number) => void;
    };
}
interface IProps extends PropsWithChildren {
    segment: ISegmentWithUserInfo;
    canEdit?: boolean;
}

const _config = getConfig();

export const SegmentContext = React.createContext<IContextValue>({} as IContextValue);
export const SegmentContextProvider = (props: IProps) => {
    const {segment: _segment, children, canEdit} = props;

    const {mutateAsync} = useUpdateSegmentMutation(_segment.id!);
    const {mutateAsync: calculatedSegmentMutation} = useCalculatedSegmentMutation(_segment.id!);
    const [limit, setLimit] = useState(_segment.limit);

    const [segment] = useState(_segment);

    const onSave = async (success?: () => Promise<void>) => {
        const isValidTree = checkIsValidForSave();

        if (!isValidTree) {
            return toaster.add({
                text: 'Ошибка валидации сегмента',
                type: 'danger',
            });
        }

        const formattedFilter = convertTJsonToQueryBuilder(
            tree.toJS() as TJsonGroup,
            config?.fields as {[key: string]: TField},
        ) as SegmentFilter;

        try {
            await mutateAsync({
                filter: formattedFilter,
                sourceId: sources.map(({id}) => id),
                limit,
            });

            await success?.();
        } catch (error) {}
    };

    const setConfigFields = useCallback((data: Source[], config: IConfig = _config): IConfig => {
        const tempFieldsArray = getFieldArray(data);

        const fields: {
            [key: string]: TField;
        } = {};

        tempFieldsArray.forEach((field) => {
            fields[field.id] = field;
        });

        return {
            ...config,
            fields: fields,
        } as IConfig;
    }, []);

    const [config, setConfig] = useState<IConfig>(setConfigFields(_segment.source || []));

    const getTreeWithLock = (tree: ImmutableTree, lock: boolean): ImmutableTree => {
        return tree.setIn(['properties', 'isLocked'], lock);
    };

    const [tree, setTree] = useState<ImmutableTree>(() => {
        const filter = _segment?.filter;

        if (filter && filter.rules) {
            const formattedFilter = convertQueryBuilderToTJson(
                filter as IQueryBuilderGroup,
                config?.fields as {[key: string]: TField},
            );

            let tempFilter = formattedFilter;

            if (tempFilter.children1?.length === 0) {
                tempFilter = INITIAL_QUERY_VALUE();
            }

            const tempFilterWithLabels = addLabels(tempFilter, 'Группа', [1, 1], ' ');

            const loadedTree = Utils.loadTree(tempFilterWithLabels as JsonTree);

            if (!canEdit) {
                return getTreeWithLock(loadedTree, !canEdit);
            }

            return loadedTree;
        }
        const tempFilter = INITIAL_QUERY_VALUE();
        const loadedTree = Utils.loadTree(tempFilter as JsonTree);

        if (!canEdit) {
            return getTreeWithLock(loadedTree, !canEdit);
        }

        return loadedTree;
    });

    const setTreeHandler = (_tree: ImmutableTree) => {
        if (isEqual(_tree, tree)) {
            return;
        }

        setTree(_tree);
    };
    const [sources, setSources] = useState(_segment.source || []);

    const addNewSource = useCallback(
        (data: Source) => {
            const alreadyHas = sources.some((el) => el.id === data.id);
            if (alreadyHas) return;
            const allItems = [data, ...sources];
            setConfig(setConfigFields(allItems, config));
            setSources((p) => [...p, data]);
        },
        [setConfigFields, sources],
    );

    const deleteSource = useCallback(
        (id: string) => {
            if (tree) {
                const treeJS = tree.toJS();
                const uniqueFields = getUniqueFieldsRecursively(treeJS);

                const isUsedSource = uniqueFields.some((el) => el.startsWith(id));
                if (isUsedSource) {
                    toaster.add({
                        text: 'Нельзя удалить используемый источник',
                        type: 'danger',
                    });
                    return;
                }
            }

            const allItems = sources.filter(({systemName}) => systemName !== id);
            setConfig(setConfigFields(allItems, config));
            setSources(allItems);
        },
        [setConfigFields, sources],
    );

    const checkIsValidForSave = useCallback(() => {
        if (!tree || !config) return false;

        const treeJS = tree.toJS();

        const childs = Object.values(treeJS.children1);

        const isEmptyTree =
            childs.length <= 1 &&
            (childs[0] as TJsonRule)?.type === ItemType.rule &&
            !(childs[0] as TJsonRule)?.properties?.field;

        const isValidTree = Utils.isValidTree(tree);

        const haveAllAttributes = checkHaveAllAttributes(treeJS, config);

        return !isEmptyTree && isValidTree && haveAllAttributes;
    }, [config, tree]);

    const onSaveAndCalculated = async () => {
        await onSave(calculatedSegmentMutation);
    };

    const value: IContextValue = {
        state: {
            config,
            segment,
            sources,
            tree,
            limit,
        },
        actions: {
            setTree: setTreeHandler,
            addNewSource,
            deleteSource,
            onSave,
            setLimit,
        },
    };
    return (
        <SegmentContext.Provider value={value}>
            <Tabs
                tabs={[
                    {
                        children,
                        title: 'Сегмент',
                        value: 'segment',
                        default: true,
                    },
                ]}
                actions={
                    <Flex gap={2}>
                        {canEdit && (
                            <Button view="action" onClick={() => onSave()}>
                                Сохранить
                            </Button>
                        )}
                        {canEdit && (
                            <Button view="action" onClick={onSaveAndCalculated}>
                                Сохранить и рассчитать
                            </Button>
                        )}
                    </Flex>
                }
            />
        </SegmentContext.Provider>
    );
};
