import { useState } from 'react';
import { DataOptions } from '../types/DataOptions';
import DisplayOptionsForm from '../components/DisplayOptionsForm';
import { useQuery } from '@tanstack/react-query';
import fetchBRSI from "../utils/fetchBRSI";
import dayjs from 'dayjs';
import { Delete } from '@mui/icons-material';
import { 
  Container, 
  Button,
} from '@mui/material';
import BRSIChart from '../components/BRSIChart';


type ChartGroupProps = {
    removeChartGroup: (index: number) => void;
    index: number;
}

function ChartGroup({ index, removeChartGroup }: ChartGroupProps) {
  const [ displayOptions, setDisplayOptions ] = useState<DataOptions>({
    actor1CountryCode: 'USA',
    actor2CountryCode: 'CHN',
    startDate: dayjs('2024-01-01'),
    endDate: dayjs(),
    aggregateLevel: 'daily'
  });

  const { refetch, isLoading, isRefetching, isError, error, data } = useQuery({
    queryKey: [`brsi-${index}`],
    queryFn: () => fetchBRSI(displayOptions),
    enabled: false,
    initialData: {
      actor1CountryCode: displayOptions.actor1CountryCode,
      actor2CountryCode: displayOptions.actor2CountryCode,
      startDate: displayOptions.startDate.format('YYYY-MM-DD'),
      endDate: displayOptions.endDate.format('YYYY-MM-DD'),
      aggregateLevel: displayOptions.aggregateLevel,
      numRecords: 0,
      records: [],
    }
  })

  return (
    <Container
      className="w-fit h-min flex flex-col items-center justify-center"
    >
        <DisplayOptionsForm
            options={displayOptions}
            setOptions={setDisplayOptions}
            refetch={refetch}
            loading={isLoading || isRefetching}
            error={isError}
            errorMessage={error?.message}
        />
        <Button
            onClick={() => removeChartGroup(index)}
            sx={{ position: 'relative', top: 4, right: 4 }}
            color="error"
            startIcon={<Delete />}
        >
            Remove Chart
        </Button>
        <BRSIChart
            data={data}
            loading={isLoading || isRefetching}
            isError={isError}
            error={error}
            refetch={refetch}
        />
    </Container>
  )
}

export default ChartGroup;
