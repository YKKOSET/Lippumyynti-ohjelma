import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Popup from '../components/Popup';

const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

const API_URL = 'https://lippumyynti-ohjelma.onrender.com/api/liput';

// Tyylitelty liukukytkin, jonka sisällä lukee tila.
// Vihreä = käyttämätön, punainen = käytetty
const TilaKytkin = styled(Switch)(() => ({
    width: 150,
    height: 36,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 4,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(114px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#e53935',
                opacity: 1,
                border: 0,
            },
            // Näytetään "KÄYTETTY" kun kytkin on päällä
            '& + .MuiSwitch-track::before': {
                opacity: 1,
            },
            '& + .MuiSwitch-track::after': {
                opacity: 0,
            },
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.6,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 28,
        height: 28,
        boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
    },
    '& .MuiSwitch-track': {
        position: 'relative',
        borderRadius: 18,
        backgroundColor: '#43a047',
        opacity: 1,
        transition: 'background-color 300ms',
        '&::before, &::after': {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
            transition: 'opacity 300ms',
        },
        // Teksti kun lippu on käytetty (nuppi oikealla, teksti vasemmalla)
        '&::before': {
            content: '"KÄYTETTY"',
            left: 14,
            opacity: 0,
        },
        // Teksti kun lippu on käyttämätön (nuppi vasemmalla, teksti oikealla)
        '&::after': {
            content: '"KÄYTTÄMÄTÖN"',
            right: 14,
            opacity: 1,
        },
    },
}));

// Tallentaa meidän OMAN applikaation lipun käytetyksi/käyttämättömäksi.
// Lippu haetaan Hakupalkilla ja annetaan tälle propsina.
// Tila tallentuu heti, kun kytkintä liikutetaan.
function LippuCard({ lippu }) {

    const [kaytetty, setKaytetty] = useState(Boolean(lippu?.kaytetty));
    const [tallennetaan, setTallennetaan] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);
    const [virhe, setVirhe] = useState('');

    // Asetetaan kytkin lipun tietojen mukaan, kun haetaan uusi lippu
    useEffect(() => {
        setKaytetty(Boolean(lippu?.kaytetty));
        setVirhe('');
    }, [lippu?.id, lippu?.kaytetty]);

    // Jos lippua ei ole (vielä), ei piirretä mitään
    if (!lippu) return null;

    const vaihdaTila = async (e) => {
        if (tallennetaan) return;

        const uusiTila = e.target.checked;
        const edellinenTila = kaytetty;

        // Päivitetään kytkin heti
        setKaytetty(uusiTila);
        setTallennetaan(true);
        setVirhe('');

        const tila = uusiTila ? 'kaytetty' : 'kayttamaton';
        const url = `${API_URL}/${encodeURIComponent(lippu.id)}/${tila}`;

        try {
            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${username}:${password}`),
                },
            });

            if (!res.ok) {
                throw new Error(`Tallennus epäonnistui: ${res.status}`);
            }

            // Kun tallennus on tehty, näytetään popup onnistumisesta
            setShowPopUp(true);
        } catch (err) {
            console.error('Lipun tallennus epäonnistui:', err);
            // Palautetaan kytkin edelliseen tilaan
            setKaytetty(edellinenTila);
            setVirhe('Tallennus epäonnistui');
        } finally {
            setTallennetaan(false);
        }
    };

    // Muotoillaan esitysaika luettavaan muotoon
    const esitysaika = lippu.esityskerta?.alkuaika
        ? new Date(lippu.esityskerta.alkuaika).toLocaleString('fi-FI')
        : '';

    // Tukee sekä nimeä "nimi" että "nimi_"
    const lipputyyppi = lippu.lipputyyppi?.nimi ?? lippu.lipputyyppi?.nimi_ ?? '';

    return (
        <Box sx={{ ml: 3 }}>
            <Card sx={{ width: 500, border: '1px solid #ccc', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'left' }}>
                    <Typography>Sarjanumero:</Typography>
                    <Typography>{lippu.id}</Typography>
                    <Typography>Esitysaika: {esitysaika}</Typography>
                    <Typography>Lipputyyppi: {lipputyyppi}</Typography>
                    <Typography sx={{ mb: 2 }}>Hinta: {lippu.hinta} €</Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TilaKytkin
                            checked={kaytetty}
                            onChange={vaihdaTila}
                            disabled={tallennetaan}
                        />
                        {tallennetaan && <CircularProgress size={18} />}
                    </Box>

                    {virhe && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {virhe}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            <Popup showPopUp={showPopUp} setShowPopUp={setShowPopUp} />
        </Box>
    );
}

export default LippuCard;