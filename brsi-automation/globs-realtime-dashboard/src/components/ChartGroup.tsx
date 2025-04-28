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

  const brsiQuery = useQuery({
    queryKey: [`brsi-${index}`],
    queryFn: () => fetchBRSI(displayOptions),
    enabled: false,
  });

  return (
    <Container
      className="w-fit flex flex-col items-center justify-center"
    >
        <DisplayOptionsForm
            options={displayOptions}
            setOptions={setDisplayOptions}
            refetch={brsiQuery.refetch}
            loading={brsiQuery.isLoading}
            error={brsiQuery.isError}
            errorMessage={brsiQuery.error?.message}
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
            data={brsiQuery.data}
            isLoading={brsiQuery.isLoading}
            isError={brsiQuery.isError}
            error={brsiQuery.error}
            refetch={brsiQuery.refetch}
        />
    </Container>
  )
}

export default ChartGroup;
