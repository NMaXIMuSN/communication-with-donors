import {QueryBuilder} from '@/entities/segmnets/ui/QueryBuilder';
import {SegmentSourceList} from './SegmentSourceList/SegmentSourceList';
import {SourcePicker} from '@/entities/segmnets/ui/SourcePicker/SourcePicker';
import {FC, useContext} from 'react';
import {SegmentContext} from '@/entities/segmnets/model/SegmentContext';
import {FormRow} from '@/shared/ui';
import {TextInput} from '@gravity-ui/uikit';

interface ISegmentQueryBuilder {
    canEdit?: boolean;
}

export const SegmentQueryBuilder: FC<ISegmentQueryBuilder> = () => {
    const {
        state: {config, sources, tree, limit},
        actions: {setTree, addNewSource, deleteSource, setLimit},
    } = useContext(SegmentContext);

    return (
        <QueryBuilder config={config} value={tree} onChange={setTree} sourceLoaded={false}>
            {({itemsTreeProps, listProps}) => {
                return (
                    <QueryBuilder.Layout>
                        <QueryBuilder.ListColumn>
                            <FormRow label="Ограничение расчета" isVertical>
                                {() => (
                                    <TextInput
                                        type="number"
                                        value={String(limit)}
                                        onUpdate={(value) => setLimit(Number(value))}
                                    />
                                )}
                            </FormRow>
                            <SegmentSourceList
                                sources={sources}
                                listButton={<SourcePicker onSelect={addNewSource} />}
                                onDeleteSourceClick={deleteSource}
                                {...listProps}
                            />
                        </QueryBuilder.ListColumn>
                        <QueryBuilder.ItemsTreeColumn>
                            <QueryBuilder.ItemsTree {...itemsTreeProps} />
                        </QueryBuilder.ItemsTreeColumn>
                    </QueryBuilder.Layout>
                );
            }}
        </QueryBuilder>
    );
};
