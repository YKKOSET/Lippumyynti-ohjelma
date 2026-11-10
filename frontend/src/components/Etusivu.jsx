import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tapahtumakortti from './Tapahtumakortti';

const API_URL = 'https://lippumyynti-ohjelma.onrender.com/api/tapahtumat';

const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

// Etusivu.jsx: tapahtumat listautuu näkyviin (kortteja). 
// Yläosassa hakuominaisuus tapahtumille: suurennuslasi ja textfield (hae tapahtumaa nimellä).
//HOX:  -> Eli etusivu sisältää haetapahtuma-komponentin ja (tapahtuma)korttilistaus-komponentin.


// Nice to know: Kun klikkaa tapahtumakorttia, näkyy tapahtuman tiedot ja esityskerrat 
// sekä MYY lippu-linkkipainike. klikattaessa avaa myy lippuja-lomakkeen (pohjatietona ko. tapahtuma).

function Etusivu() {

    const [tapahtumat, setTapahtumat] = useState([]);
    const [ladataan, setLadataan] = useState(true);
    const [virhe, setVirhe] = useState('');

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
        return (
            <Box>
                <CircularProgress />
            </Box>
        );
    }

    if (virhe) {
        return (
                {virhe}
        );
    }

    return (
        <Box>
            <Typography>Tapahtumat</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    gap: 1,
                }}
            >
                {tapahtumat.map((tapahtuma) => (
                    <Box key={tapahtuma.id}>
                        <Tapahtumakortti tapahtuma={tapahtuma} />
                    </Box>
                ))}
            </Box>

            {tapahtumat.length === 0 && (
                <Typography>
                    Ei tapahtumia.
                </Typography>
            )}
        </Box>
    );
}

export default Etusivu;