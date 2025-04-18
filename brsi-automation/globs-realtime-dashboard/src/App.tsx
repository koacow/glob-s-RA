import { useState, useEffect } from 'react'
import { LineChart } from '@mui/x-charts'
import { Typography, Tabs, Tab } from '@mui/material'
import fetchBRSILatest from '../utils/fetchBRSILatest'
import { BRSILatestResponse } from '../utils/fetchBRSILatest'
import './App.css'


function App() {
  const [ data, setData ] = useState<BRSILatestResponse>({
    actor1CountryCode: '',
    actor2CountryCode: '',
    range: '5D',
    numRecords: 0,
    records: [],
  })
  const [ range, setRange ] = useState<'5D' | '1M' | '3M' | '1Y' | '5Y' | 'MAX'>('5D')
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => { 
    setRange(newValue as '5D' | '1M' | '3M' | '1Y' | '5Y' | 'MAX')
  }
  useEffect(() => {
    fetchBRSILatest('USA', 'CHN', range)
      .then((response) => {
        setData(response)
      })
      .catch((error) => {
        console.error('Error fetching BRSI data:', error)
      })
  }, [range])
  
  return (
    <>
    <Tabs
      value={range}
      onChange={handleTabChange}
      variant="fullWidth"
      textColor="primary"
      indicatorColor="primary"
      sx={{ marginBottom: '20px' }}
    >
      <Tab label="5D" value="5D" onClick={() => fetchBRSILatest('USA', 'CHN', '5D').then(setData)} />
      <Tab label="1M" value="1M" onClick={() => fetchBRSILatest('USA', 'CHN', '1M').then(setData)} />
      <Tab label="3M" value="3M" onClick={() => fetchBRSILatest('USA', 'CHN', '3M').then(setData)} />
      <Tab label="1Y" value="1Y" onClick={() => fetchBRSILatest('USA', 'CHN', '1Y').then(setData)} />
      <Tab label="5Y" value="5Y" onClick={() => fetchBRSILatest('USA', 'CHN', '5Y').then(setData)} />
      <Tab label="MAX" value="MAX" onClick={() => fetchBRSILatest('USA', 'CHN', 'MAX').then(setData)} />
    </Tabs>
    <LineChart
      title="Average Goldstein Scale of Sentiment of USA towards China"
      xAxis={[
        {
          dataKey: 'Date',
          valueFormatter: (value) => {
            const date = new Date(value)
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
          }
        }
      ]}
      yAxis={[{ width: 50 }]}
      series={[
        {
          dataKey: 'AvgGoldsteinScale',
          label: 'Avg Goldstein Scale',
          showMark: true,
          curve: 'linear'
        }
      ]}
      dataset={data.records}
      height={400}
      width={800}
    />
    </>
  )
}

export default App
