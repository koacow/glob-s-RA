import React, { useState } from 'react';
import ChartGroup from './components/ChartGroup';
import { 
  Container, 
  Button,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import './App.css'



function App() {
  const [ chartGroups, setChartGroups ] = useState<number[]>([0]);
  const handleAddChartGroup = () => {
    setChartGroups((prev) => [...prev, prev.length]);
  }
  const handleRemoveChartGroup = (index: number) => {
    setChartGroups((prev) => prev.filter((_, i) => i !== index));
  }
  return (
    <Container
      className="my-10"
    >
      <Typography
        variant="h4"
        className="text-center my-4 font-bold"
        fontFamily={'Cardo, serif'}
      >
        Global Bilateral Sentiment Explorer
      </Typography>
      <Typography
        variant="subtitle1"
        className="text-center mb-8"
      >
        Visualize sentiment trends between countries over time
      </Typography>
      {chartGroups.map((_, index) => (
        <ChartGroup
          removeChartGroup={handleRemoveChartGroup}
          key={index}
          index={index}
        />
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddChartGroup}
        className="mb-8"
        startIcon={<Add />}
      >
        Add Chart
      </Button>
    </Container>
  )
}

export default App
