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
            </Typography>
        </>
    )
}