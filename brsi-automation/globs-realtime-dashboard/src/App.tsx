import { useState } from 'react';
import ChartGroup from './components/ChartGroup';
import Header from './components/Header';
import { 
  Container, 
  Button,
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
      <Header />
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
