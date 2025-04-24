import { LineChart, ChartContainer } from '@mui/x-charts'

export default function BRSIChart() {
    return (
        <ChartContainer>
            <LineChart
                data={[
                    { date: '2023-01-01', value: 10 },
                    { date: '2023-02-01', value: 20 },
                    { date: '2023-03-01', value: 30 },
                ]}
                xField="date"
                yField="value"
            />
        </ChartContainer>
    )
}