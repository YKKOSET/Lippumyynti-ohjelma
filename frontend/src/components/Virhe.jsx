import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useLocation } from 'react-router';

function Virhe({ virhe }) {
    const location = useLocation();
    const viesti = location.state?.virheviesti || virhe;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                minHeight: '100vh',
                mt: 1
            }}
        >
            <Typography>{viesti}</Typography>
        </Box>
    );
}

export default Virhe;