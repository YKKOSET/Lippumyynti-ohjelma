import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Tapahtumakortti from './Tapahtumakortti';
import { api } from './LippuTietokanta';

function Etusivu() {

    const [tapahtumat, setTapahtumat] = useState([]);
    const [ladataan, setLadataan] = useState(true);
    const [virhe, setVirhe] = useState('');
    const [haku, setHaku] = useState('');

    useEffect(() => {
        const haeTapahtumat = async () => {
            try {
                const data = await api.tapahtumat.hae();
                setTapahtumat(data ?? []);
            } catch (error) {
                console.error(error);
                setVirhe('Tapahtumien lataaminen epäonnistui.');
            } finally {
                setLadataan(false);
            }
        };

        haeTapahtumat();
    }, []);

    if (ladataan) {
        return <CircularProgress />;
    }

    if (virhe) {
        return <Typography color="error">{virhe}</Typography>;
    }

    const suodatetutTapahtumat = tapahtumat.filter((tapahtuma) =>
        tapahtuma.nimi?.toLowerCase().includes(haku.trim().toLowerCase())
    );

    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                mt: '7px',
            }}>
                <SearchIcon fontSize="medium" />
                <TextField
                    label="Hae tapahtumaa nimellä"
                    value={haku}
                    onChange={(e) => setHaku(e.target.value)}
                />
            </Box>

            <Box sx={{ml: 3}}>
                <Typography variant="h3" align="left" sx={{mb: 1}}>Tapahtumat</Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start',
                        alignItems: 'stretch',
                        gap: 1,
                    }}>
                    {suodatetutTapahtumat.map((tapahtuma) => (
                        <Box key={tapahtuma.id}>
                            <Tapahtumakortti tapahtuma={tapahtuma} />
                        </Box>
                    ))}
                </Box>

                {suodatetutTapahtumat.length === 0 && (
                    <Typography>
                        Ei tapahtumia.
                    </Typography>
                )}
            </Box>
        </>
    );
}

export default Etusivu;