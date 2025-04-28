import { Typography } from '@mui/material';

export default function Header() {
    return (
        <>
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
        </>
    )
}