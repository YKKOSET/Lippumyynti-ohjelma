import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Popup from '../components/Popup';

const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

const API_URL = 'https://lippumyynti-ohjelma.onrender.com/api/liput';

// Värit samat kuin TicketSales-kortissa
const INK = '#14213d';
const MUTED = '#5b6478';
const ACCENT = '#2b59ff';
const LINE = '#c9d0e0';
const STUB_BG = '#f7f9fd';

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
        '&::before': {
            content: '"KÄYTETTY"',
            left: 14,
            opacity: 0,
        },
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
        ? new Date(lippu.esityskerta.alkuaika).toLocaleString('fi-FI', {
              weekday: 'short',
              day: 'numeric',
              month: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '';

    // Tukee sekä nimeä "nimi" että "nimi_"
    const lipputyyppi = lippu.lipputyyppi?.nimi ?? lippu.lipputyyppi?.nimi_ ?? '';

    return (
        <Box sx={{ ml: 3, mt: 2, mr: 3 }}>
            {/* Lippukortti: vasen runko + perforoitu kanta */}
            <Card
                elevation={0}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
                    width: '100%',
                    maxWidth: 620,
                    border: `1px solid ${LINE}`,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    color: INK,
                    bgcolor: '#fff',
                }}
            >
                {/* Runko */}
                <Box sx={{ p: '20px 20px 20px 24px', textAlign: 'left', minWidth: 0 }}>
                    <Typography
                        component="time"
                        sx={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: ACCENT, textTransform: 'capitalize' }}
                    >
                        {esitysaika}
                    </Typography>
                    <Typography sx={{ fontSize: '.8rem', color: MUTED, mt: 1.5 }}>
                        Sarjanumero
                    </Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25, wordBreak: 'break-all' }}>
                        {lippu.id}
                    </Typography>
                    <Typography sx={{ color: MUTED, fontSize: '.95rem', mt: 0.5 }}>
                        {lipputyyppi}
                    </Typography>
                </Box>

                {/* Kanta */}
                <Box
                    sx={{
                        width: { xs: 'auto', sm: 200 },
                        p: '20px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        bgcolor: STUB_BG,
                        position: 'relative',
                        borderLeft: { xs: 0, sm: `2px dashed ${LINE}` },
                        borderTop: { xs: `2px dashed ${LINE}`, sm: 0 },
                        '&::before, &::after': {
                            content: '""',
                            position: 'absolute',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: 'background.default',
                            border: `1px solid ${LINE}`,
                        },
                        '&::before': { top: -11, left: -11 },
                        '&::after': { bottom: { xs: 'auto', sm: -11 }, top: { xs: -11, sm: 'auto' }, left: { xs: 'auto', sm: -11 }, right: { xs: -11, sm: 'auto' } },
                    }}
                >
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>
                        {lippu.hinta} €
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TilaKytkin
                            checked={kaytetty}
                            onChange={vaihdaTila}
                            disabled={tallennetaan}
                        />
                        {tallennetaan && <CircularProgress size={18} />}
                    </Box>

                    {virhe && (
                        <Typography color="error" sx={{ fontSize: '.85rem', textAlign: 'center' }}>
                            {virhe}
                        </Typography>
                    )}
                </Box>
            </Card>

            <Popup showPopUp={showPopUp} setShowPopUp={setShowPopUp} />
        </Box>
    );
}

export default LippuCard;
