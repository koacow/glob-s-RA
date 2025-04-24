import React, { useState } from 'react';
import { DataOptions } from './types/DataOptions';
import DisplayOptionsForm from './components/DisplayOptionsForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import fetchBRSI from '../utils/fetchBRSI';
import dayjs from 'dayjs';
import { 
  Container, 
} from '@mui/material';
import './App.css'


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
    enabled: !!displayOptions.actor1CountryCode && !!displayOptions.actor2CountryCode,
  });

  return (
    <Container>
      <DisplayOptionsForm
        options={displayOptions}
        setOptions={setDisplayOptions}
      />
    </Container>
  )
}

export default App
