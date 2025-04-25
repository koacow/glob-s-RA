import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataOptions } from '../types/DataOptions';
import countries from '../assets/countries.json';
import { 
    Radio, 
    RadioGroup,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    FormLabel,
    SelectChangeEvent,
    Container,
    Button,
    IconButton,
    Typography
} from '@mui/material';
import { SwapVert } from '@mui/icons-material';
import dayjs from 'dayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';

type DisplayOptionsFormProps = {
    options: DataOptions;
    setOptions: (options: DataOptions) => void;
    refetch: () => void;
    loading: boolean;
    error: boolean;
    errorMessage: string | undefined;
};

export default function DisplayOptionsForm({ options, setOptions, refetch, loading, error, errorMessage }: DisplayOptionsFormProps) {
    const handleActor1Change = (event: SelectChangeEvent<string>) => {
        setOptions({ ...options, actor1CountryCode: event.target.value });
    };

    const handleActor2Change = (event: SelectChangeEvent<string>) => {
        setOptions({ ...options, actor2CountryCode: event.target.value });
    };

    const handleStartDateChange = (date: PickerValue) => {
        if (!date) {
            return;
        }
        setOptions({ ...options, startDate: date });
    };

    const handleEndDateChange = (date: PickerValue) => {
        if (!date) {
            return;
        }
        setOptions({ ...options, endDate: date });
    };

    const handleAggregateLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOptions({ ...options, aggregateLevel: event.target.value as 'daily' | 'monthly' | 'yearly' });
    };

    return (
        <Container
            className="grid grid-cols-2 gap-4 p-4"
        >
            <FormControl fullWidth className='col-span-2'>
                <FormLabel>Actor 1 Country Code</FormLabel>
                <Select
                    value={options.actor1CountryCode}
                    onChange={handleActor1Change}
                >
                    {countries.map((country) => (
                        <MenuItem key={country.country_code} value={country.country_code}>
                            {country.country_code}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <IconButton
                onClick={() => {
                    setOptions({
                        ...options,
                        actor1CountryCode: options.actor2CountryCode,
                        actor2CountryCode: options.actor1CountryCode,
                    });
                }}
                className="w-fit h-fit col-start-1 col-span-2"
            >
                <SwapVert />
            </IconButton>

            <FormControl fullWidth className="col-span-2">
                <FormLabel>Actor 2 Country Code</FormLabel>
                <Select
                    value={options.actor2CountryCode}
                    onChange={handleActor2Change}
                >
                    {countries.map((country) => (
                        <MenuItem key={country.country_code} value={country.country_code}>
                            {country.country_code}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Start Date"
                    value={options.startDate}
                    onChange={handleStartDateChange}
                    minDate={dayjs('1995-01-01')}
                    maxDate={options.endDate}
                />
                <DatePicker
                    label="End Date"
                    value={options.endDate}
                    onChange={handleEndDateChange}
                    minDate={dayjs('1995-01-01').add(3, 'day')}
                    maxDate={dayjs()}
                />
            </LocalizationProvider>

            <FormControl component="fieldset" className='col-span-2'>
                <FormLabel component="legend">Aggregation Level</FormLabel>
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
            <Button 
                variant='contained' 
                onClick={() => {
                refetch();
                }}
                disabled={options.startDate.isAfter(options.endDate) || options.startDate.isSame(options.endDate) || loading}
                className="col-span-2 w-fit"
            >
                Fetch Data
            </Button>
            {
                error && (
                    <Typography variant="body2" color="error">
                        An error occurred while fetching data:
                        {errorMessage}
                    </Typography>
                )
            }
        </Container>
    );
}


