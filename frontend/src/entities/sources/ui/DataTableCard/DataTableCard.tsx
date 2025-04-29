import {toaster} from '@/shared/toaster/notification';
import {FormFieldSelect, FormRow} from '@/shared/ui';
import Card from '@/shared/ui/Card/Card';
import {Flex} from '@gravity-ui/uikit';
import {Field, useForm} from 'react-final-form';
import {getInfoTable} from '../../api/fetchers';
import {AxiosError} from 'axios';
import {Attribute} from '../Attribute/Attribute';
import {mapColumnsInfoToAttribute} from '../../api/mapper';
import {FieldArray} from 'react-final-form-arrays';
import {useAvailableTables} from '../../api/queryHook';

export const DataTableCard = () => {
    const formApi = useForm();

    const {data} = useAvailableTables();

    const onLoadTable = async (name: string) => {
        try {
            const resTableData = await getInfoTable(name);
            formApi.change(
                'attributes',
                mapColumnsInfoToAttribute(
                    resTableData.table.map(({columnName, dataType}) => ({
                        key: columnName,
                        type: dataType,
                    })),
                ),
            );
        } catch (error) {
            if (error instanceof AxiosError) {
                toaster.add({
                    type: 'danger',
                    text: error.message,
                });
            } else {
                toaster.add({
                    type: 'danger',
                    text: 'Произошла неизвестная ошибка ',
                });
            }
        }
    };
    return (
        <Card title={'Загрузка таблицы'}>
            <FormRow label="Название таблицы" required>
                {() => (
                    <Field name="tableName">
                        {(props) => (
                            <Flex gap={2}>
                                <FormFieldSelect
                                    {...props}
                                    options={data}
                                    placeholder="Название таблицы"
                                    onUpdate={(value) => {
                                        onLoadTable(value![0]);
                                    }}
                                />
                            </Flex>
                        )}
                    </Field>
                )}
            </FormRow>
            <FieldArray name="attributes">
                {({fields}) => (
                    <Flex direction="column" gap={2} style={{width: '100%'}}>
                        {fields.map((name) => {
                            return <Attribute key={name} prefix={name} canEdit />;
                        })}
                    </Flex>
                )}
            </FieldArray>
        </Card>
    );
};
