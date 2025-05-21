import { Typography } from '@mui/material';

export default function Header() {
    return (
        <>
            <Typography
                variant="h4"
                className="text-center my-4 font-bold"
                fontFamily={'Cardo, serif'}
            >
                Global Bilateral Relations Sentiment Index Explorer
            </Typography>
            <Typography
                variant="subtitle1"
                className="text-center mb-8"
            >
                The Bilateral Relations Sentiment Index (BRSI) is a media-based measure of public sentiment, capturing the tone of local news coverage in Country 1 regarding Country 2.
                The data is updated daily at 12:00 AM UTC.
            </Typography>
            <Typography
                variant="caption"
                className="mb-8"
            >
                *The BRSI database is temporarily paused as we transition to a new database provider. Data updates will resume soon. The latest available data is current as of May 20th, 2025.
            </Typography>
        </>
    )
}