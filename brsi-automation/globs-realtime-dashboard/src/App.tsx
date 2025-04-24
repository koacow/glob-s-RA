import React, { useState } from 'react';
import { DataOptions } from './types/DataOptions';
import DisplayOptionsForm from './components/DisplayOptionsForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import fetchBRSI from '../utils/fetchBRSI';
import dayjs from 'dayjs';
import { 
  Container, 
  Button,
  Typography,
} from '@mui/material';
import './App.css'
import BRSIChart from './components/BRSIChart';


function App() {
  const [ displayOptions, setDisplayOptions ] = useState<DataOptions>({
    actor1CountryCode: 'USA',
    actor2CountryCode: 'CHN',
    startDate: dayjs('2024-01-01'),
    endDate: dayjs(),
    aggregateLevel: 'daily'
  });

  const queryClient = useQueryClient();
  const brsiQuery = useQuery({
    queryKey: ['brsi'],
    queryFn: () => fetchBRSI(displayOptions),
    enabled: false,
  });

  return (
    <Container>
      <DisplayOptionsForm
        options={displayOptions}
        setOptions={setDisplayOptions}
      />
      <Button
        variant="contained"
        onClick={() => {
          brsiQuery.refetch();
        }}
      >
        <Typography variant="h6">Fetch BRSI Data</Typography>
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

export default App
