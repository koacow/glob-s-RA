import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataOptions } from '../types/DataOptions';
import { 
    Radio, 
    RadioGroup,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    FormLabel,
    SelectChangeEvent,
    Container
} from '@mui/material';

type DisplayOptionsFormProps = {
    options: DataOptions;
    setOptions: (options: DataOptions) => void;
};

export default function DisplayOptionsForm({ options, setOptions }: DisplayOptionsFormProps) {
    const handleActor1Change = (event: SelectChangeEvent<string>) => {
        setOptions({ ...options, actor1CountryCode: event.target.value });
    };

    const handleActor2Change = (event: SelectChangeEvent<string>) => {
        setOptions({ ...options, actor2CountryCode: event.target.value });
    };

    const handleStartDateChange = (date: any) => {
        setOptions({ ...options, startDate: date.format('YYYY-MM-DD') });
    };

    const handleEndDateChange = (date: any) => {
        setOptions({ ...options, endDate: date.format('YYYY-MM-DD') });
    };

    const handleAggregateLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOptions({ ...options, aggregateLevel: event.target.value as 'daily' | 'monthly' | 'yearly' });
    };

    return (
        <Container>
            <FormControl fullWidth>
                <FormLabel>Actor 1 Country Code</FormLabel>
                <Select
                    value={options.actor1CountryCode}
                    onChange={handleActor1Change}
                >
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="CHN">CHN</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <FormLabel>Actor 2 Country Code</FormLabel>
                <Select
                    value={options.actor2CountryCode}
                    onChange={handleActor2Change}
                >
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="CHN">CHN</MenuItem>
                </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Start Date"
                    value={options.startDate}
                    onChange={handleStartDateChange}
                />
                <DatePicker
                    label="End Date"
                    value={options.endDate}
                    onChange={handleEndDateChange}
                />
            </LocalizationProvider>

            <FormControl component="fieldset">
                <FormLabel component="legend">Aggregate Level</FormLabel>
                <RadioGroup
                    row
                    value={options.aggregateLevel}
                    onChange={handleAggregateLevelChange}
                >
                    <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                    <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                    <FormControlLabel value="yearly" control={<Radio />} label="Yearly" />
                </RadioGroup>
            </FormControl>
        </Container>
    );
}


