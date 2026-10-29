import Lippulistaus from './lippulistaus';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function Lippukortti({ lippu }) {
    const [kaytetty, setKaytetty] = useState(lippu.kaytetty);
    const [tallennetaan, setTallennetaan] = useState(false);
    const [viesti, setViesti] = useState('');

    const tallenna = async () => {
        if (tallennetaan) return;
        setTallennetaan(true);
        setViesti('');

        const url = `https://lippupalvelu-uons.onrender.com/ticket/${lippu.id}`;

        try {
            const vastaus = await fetch(url, {
                method: "PATCH",
                headers: {
                    'Authorization': 'Basic ' + btoa('admin@projekti.fi:jokin-vahva-salasana-123'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ kaytetty: true }),
            });

            if (!vastaus.ok) {
                throw new Error(
                    `Tallennus epäonnistui: ${vastaus.status}`
                );
            }

            setKaytetty(true);
            setViesti('Lippu merkitty käytetyksi.');
        } catch (virhe) {
            console.error('Lipun tallennus epäonnistui:', virhe);
            setViesti('Tallennus epäonnistui.');
        } finally {
            setTallennetaan(false);
        }
    };

    return (
        <Card sx={{ width: 500, ml: 3, border: "1px solid #ccc", borderRadius: 2 }}>
            <CardContent sx={{ textAlign: "left" }}>
                <Typography>
                    Lippu id: {lippu.id}
                </Typography>
                <Typography>
                    Hinta: {lippu.hinta} €
                </Typography>
                <Typography>
                    Koodi: {lippu.koodi}
                </Typography>
                <Typography>
                    Käytetty: {lippu.kaytetty ? "Kyllä" : "Ei"}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'right' }}>
                <Button variant='contained' onClick={tallenna}
                    disabled={tallennetaan}
                >
                    {tallennetaan
                        ? 'Tallennetaan...'
                        : 'Merkitse lippu käytetyksi'}
                </Button>
            </CardActions>
            {viesti && (
                <Typography sx={{ mt: 2 }}>{viesti}</Typography>
            )}
        </Card>
    );
}

export default Lippukortti;