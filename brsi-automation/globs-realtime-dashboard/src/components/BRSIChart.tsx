import { LineChart } from '@mui/x-charts'
import { BRSIResponse, BRSIData } from '../types/brsi'
import { Typography } from '@mui/material'

export type BRSIChartProps = {
    data: BRSIResponse | undefined
    isLoading: boolean
    isError: boolean
    error: unknown
    refetch: () => void
}

const parseData: (data: BRSIResponse) => BRSIData = (data) => {
    if (!data) {
        throw new Error('No data provided');
    }

    const parsedData: BRSIData = {
        actor1CountryCode: data.actor1CountryCode,
        actor2CountryCode: data.actor2CountryCode,
        startDate: data.startDate,
        endDate: data.endDate,
        aggregateLevel: data.aggregateLevel,
        numRecords: data.numRecords,
        records: data.records.map((item) => ({
            ...item,
            date: new Date(
                `${item.year}${item.month ? `-${item.month}` : ''}${
                    item.day ? `-${item.day}` : ''
                }`
            ),
        }))
    }
    return parsedData
}

const BRSIChart: React.FC<BRSIChartProps> = ({
    data,
    isLoading,
}) => {
    return (
        <>
            <Typography 
                variant="h6"
                className="text-center"
            >
                {data && `${data.aggregateLevel.charAt(0).toUpperCase() + data.aggregateLevel.slice(1)} average sentiment of ${data.actor1CountryCode} towards ${data.actor2CountryCode}`}
            </Typography>
            <LineChart
                loading={isLoading}
                height={400}
                width={800}
                grid={{
                    vertical: true,
                    horizontal: true,
                }}
                hideLegend={!data || data.numRecords === 0 || isLoading}
                xAxis={[
                    {
                        dataKey: 'date',
                        valueFormatter: (value) => {
                            if (!data) {
                                return '';
                            }
                            if (data.aggregateLevel === 'daily') {
                                return new Date(value).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric',
                                });
                            } else if (data.aggregateLevel === 'monthly') {
                                return new Date(value).toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric',
                                });
                            }
                            return new Date(value).toLocaleDateString('en-US', {
                                year: 'numeric',
                            });
                        }
                        
                    }
                ]}
                series={[
                    {
                        dataKey: 'avggoldsteinscale',
                        label: 'Average Goldstein Scale',
                        curve: 'linear',    
                    }
                ]}
                dataset={data ? parseData(data).records : []}
                slots={{
                    loadingOverlay: () => <Typography fontFamily={"Cardo, serif"} variant="h6">Loading...</Typography>,
                    noDataOverlay: () => <Typography fontFamily={"Cardo, serif"} variant="h6">No data available</Typography>,
                }}
            />
        </>
    )
}

export default BRSIChart