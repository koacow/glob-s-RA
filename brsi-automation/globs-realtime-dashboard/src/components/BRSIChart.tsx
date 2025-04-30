import { LineChart } from '@mui/x-charts'
import { BRSIResponse, BRSIData } from '../types/brsi'
import { Typography } from '@mui/material'
import { useMediaQuery, Theme } from '@mui/material'

export type BRSIChartProps = {
    data: BRSIResponse | undefined
    loading: boolean
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
    loading,
}) => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));
    const chartHeight = isMobile ? 400 : isTablet ? 400 : 500;
    const chartWidth = isMobile ? 400 : isTablet ? 600 : 800;

    return (
        <>
            <Typography 
                variant="h6"
                className="text-center"
            >
                {data && `${data.aggregateLevel.charAt(0).toUpperCase() + data.aggregateLevel.slice(1)} average BRSI of ${data.actor1CountryCode} towards ${data.actor2CountryCode}`}
            </Typography>
            <LineChart
                loading={loading}
                height={chartHeight}
                width={chartWidth}
                grid={{
                    vertical: true,
                    horizontal: true,
                }}
                hideLegend={!data || data.numRecords === 0 || loading}
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
                        },
                        scaleType: 'utc',
                    }
                ]}
                series={[
                    {
                        dataKey: 'avggoldsteinscale',
                        label: data && `Average ${data?.aggregateLevel.charAt(0).toUpperCase() + data?.aggregateLevel.slice(1)} BRSI`,
                        curve: 'linear',    
                    }
                ]}
                dataset={data ? parseData(data).records : []}
            />
        </>
    )
}

export default BRSIChart