import { Typography, Container } from '@mui/material';

export default function Header() {
    return (
        <Container>
            <Typography>
                Global Bilateral Sentiment Explorer
            </Typography>
            <Typography>
                Visualize sentiment trends between countries over time
            </Typography>
        </Container>
    )
}