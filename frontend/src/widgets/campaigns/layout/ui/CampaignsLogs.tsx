import {useCampaignLogQuery} from '@/entities/campaigns/api/queryHook';
import {Button, Flex, SegmentedRadioGroup} from '@gravity-ui/uikit';
import dayjs from 'dayjs';
import {FC, useState} from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface IProps {
    id: number;
}

const generateTimeIntervals = (startTime: string, endTime: string) => {
    const result = [];
    let currentTime = dayjs(startTime);

    while (currentTime.isBefore(endTime) || currentTime.isSame(endTime)) {
        result.push(currentTime.toISOString().substring(0, 16));
        currentTime = currentTime.add(1, 'minute');
    }

    return result;
};

const mergeData = (data: any[], timeArray: string[]) => {
    const result = timeArray.map((time) => ({
        time,
        successCount: 0,
        errorCount: 0,
    }));

    data.forEach((entry) => {
        const minute = dayjs(entry.time).startOf('minute').toISOString().substring(0, 16);
        const index = result.findIndex((item) => item.time === minute);
        if (index !== -1) {
            if (entry.status === 'SUCCESS') {
                result[index].successCount++;
            } else if (entry.status === 'ERROR') {
                result[index].errorCount++;
            }
        }
    });

    return result;
};

enum EType {
    CHART = 'CHART',
    LOG = 'LOG',
}

export const CampaignsLogs: FC<IProps> = ({id}) => {
    const {data, refetch} = useCampaignLogQuery(id);
    const startAt = data?.[0]?.time;
    const endAt = data?.[data.length - 1]?.time;

    const timeArray = generateTimeIntervals(startAt, endAt);
    const chartData = mergeData(data || [], timeArray);

    const [type, setType] = useState(EType.CHART);

    return (
        <div>
            <Flex justifyContent="space-between">
                <SegmentedRadioGroup
                    value={type}
                    onUpdate={setType}
                    options={[
                        {
                            value: EType.CHART,
                            content: 'График отправок',
                        },
                        {
                            value: EType.LOG,
                            content: 'Общие логи',
                        },
                    ]}
                />
                <Button onClick={() => refetch()}>Обновить</Button>
            </Flex>
            {type === EType.LOG && (
                <div>
                    {data
                        ?.reverse()
                        ?.map((el) => <pre key={el.id}>{JSON.stringify(el, null, 2)}</pre>)}
                </div>
            )}
            {type === EType.CHART && (
                <>
                    <ResponsiveContainer height={400}>
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="time"
                                tickFormatter={(time) => dayjs(time).format('HH:mm - DD MMM YYYY')}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="successCount"
                                name="Успешных отправок"
                                stroke="#82ca9d"
                            />
                            <Line
                                type="monotone"
                                dataKey="errorCount"
                                name="Не успешных отправок"
                                stroke="#ff7300"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};
