import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Tapahtumakortti from './Tapahtumakortti';

const API_URL = 'https://lippumyynti-ohjelma.onrender.com/api/tapahtumat';

const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

// Etusivu: listaa tapahtumat (tapahtumakortit). 
// Yläoikealla hakuominaisuus tapahtumille: suurennuslasi ja textfield (hae tapahtumaa nimellä).

// Jatkoa varten: Eritellään kortin tiedot niin, että kun klikkaa tapahtumakorttia (linkki on koko kortti), 
// näkyy tapahtuman tarkemmat tiedot, kuten esityskerrat sekä myy lippu-linkkipainike, 
// jota klikattaessa aukeaa myy lippuja-lomake (pohjatietona ko. tapahtuma).

function Etusivu() {

    const [tapahtumat, setTapahtumat] = useState([]);
    const [ladataan, setLadataan] = useState(true);
    const [virhe, setVirhe] = useState('');
    const [haku, setHaku] = useState('');

    useEffect(() => {
        const haeTapahtumat = async () => {
            try {
                const vastaus = await fetch(API_URL);

                if (!vastaus.ok) {
                    throw new Error('Tapahtumien haku epäonnistui');
                }

                const data = await vastaus.json();
                setTapahtumat(data);

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
        return { virhe };
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
            }}>
                <SearchIcon fontSize="medium" />
                <TextField
                    label="Hae tapahtumaa nimellä"
                    value={haku}
                    onChange={(e) => setHaku(e.target.value)}
                />
            </Box>

            <Box>
                <Typography>Tapahtumat</Typography>

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