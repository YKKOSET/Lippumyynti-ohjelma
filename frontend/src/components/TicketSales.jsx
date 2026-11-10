import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';

// ---------------------------------------------------------------
// LIPPUJEN HAKU: vaihda tähän oma osoite
// ---------------------------------------------------------------
const API_URL = 'http://localhost:8080/api/liput';

// Sama Basic-tunnistautuminen kuin LippuCardissa (poista, jos API ei vaadi sitä)
const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

const euro = (n) => `${n.toFixed(2).replace('.', ',')} €`;

// ---------------------------------------------------------------
// YKSI MYYNTIKORTTI
// ---------------------------------------------------------------
function MyyntiKortti({ lippu, onSell }) {
    const [maara, setMaara] = useState(1);
    const [viesti, setViesti] = useState('');

    const loppu = lippu.saatavilla <= 0;
    const vahan = !loppu && lippu.saatavilla <= 5;

    const esitysaika = lippu.esityskerta?.alkuaika
        ? new Date(lippu.esityskerta.alkuaika).toLocaleString('fi-FI', {
              weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit',
          })
        : '';
    const lipputyyppi = lippu.lipputyyppi?.nimi ?? lippu.lipputyyppi?.nimi_ ?? '';

    const muuta = (delta) =>
        setMaara((m) => Math.min(Math.max(1, m + delta), Math.max(1, lippu.saatavilla)));

    const myy = () => {
        if (loppu || maara > lippu.saatavilla) return;
        onSell(lippu.id, maara);
        setViesti(`Myyty ${maara} kpl · ${euro(maara * lippu.hinta)}`);
        setMaara(1);
    };

    return (
        <Box sx={tyylit.korttiUlko}>
            <Card elevation={0} sx={tyylit.kortti}>
                {/* Vasen osa */}
                <Box sx={[tyylit.runko, loppu && tyylit.loppuunmyyty]}>
                    <Typography component="time" sx={tyylit.aika}>{esitysaika}</Typography>
                    <Typography sx={tyylit.sarjaLabel}>Sarjanumero</Typography>
                    <Typography sx={tyylit.sarjanumero}>{lippu.id}</Typography>
                    <Typography sx={tyylit.tyyppi}>{lipputyyppi}</Typography>
                    <Typography sx={[tyylit.saatavilla, vahan && tyylit.saatavillaVahan]}>
                        {loppu ? 'Loppuunmyyty' : `${lippu.saatavilla} lippua jäljellä`}
                    </Typography>
                </Box>

                {/* Oikea osa */}
                <Box sx={tyylit.kanta}>
                    <Typography sx={tyylit.hinta}>{euro(lippu.hinta)}</Typography>

                    <ButtonGroup size="small" disabled={loppu} sx={tyylit.maaraValitsin} aria-label="Lippujen määrä">
                        <Button sx={tyylit.maaraNappi} onClick={() => muuta(-1)} disabled={maara <= 1}>−</Button>
                        <Button sx={tyylit.maaraNumero} disableRipple>{loppu ? 0 : maara}</Button>
                        <Button sx={tyylit.maaraNappi} onClick={() => muuta(1)} disabled={maara >= lippu.saatavilla}>+</Button>
                    </ButtonGroup>

                    <Button variant="contained" disableElevation sx={tyylit.myyNappi} onClick={myy} disabled={loppu}>
                        {loppu ? 'Ei saatavilla' : `Myy ${euro(maara * lippu.hinta)}`}
                    </Button>

                    <Typography sx={tyylit.viesti} role="status">{viesti}</Typography>
                </Box>
            </Card>
        </Box>
    );
}

// ---------------------------------------------------------------
// LISTA KAIKISTA LIPUISTA (hakee datan API:sta)
// Odotettu vastaus: taulukko lippuja, esim.
// [{ id, esityskerta: { alkuaika }, lipputyyppi: { nimi }, hinta, saatavilla }]
// ---------------------------------------------------------------
function TicketSales({ onSale }) {
    const [liput, setLiput] = useState([]);
    const [lataa, setLataa] = useState(true);
    const [virhe, setVirhe] = useState('');
    const [myynti, setMyynti] = useState({ kpl: 0, summa: 0 });

    // Haetaan liput kerran, kun komponentti avautuu
    useEffect(() => {
        const ac = new AbortController();

        const haeLiput = async () => {
            setLataa(true);
            setVirhe('');
            try {
                const res = await fetch(API_URL, {
                    signal: ac.signal,
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${username}:${password}`),
                    },
                });
                if (!res.ok) throw new Error(`Haku epäonnistui: ${res.status}`);

                const data = await res.json();
                setLiput(Array.isArray(data) ? data : []);
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error('Lippujen haku epäonnistui:', err);
                setVirhe('Lippujen haku epäonnistui');
            } finally {
                if (!ac.signal.aborted) setLataa(false);
            }
        };

        haeLiput();
        return () => ac.abort();
    }, []);

    const kasitteleMyynti = (id, maara) => {
        const lippu = liput.find((l) => l.id === id);
        if (!lippu || maara > lippu.saatavilla) return;

        setLiput((lista) =>
            lista.map((l) => (l.id === id ? { ...l, saatavilla: l.saatavilla - maara } : l))
        );
        setMyynti((m) => ({ kpl: m.kpl + maara, summa: m.summa + maara * lippu.hinta }));
        onSale?.({ ticketId: id, quantity: maara, total: maara * lippu.hinta });
    };

    const jarjestetty = useMemo(
        () => [...liput].sort((a, b) => new Date(a.esityskerta?.alkuaika) - new Date(b.esityskerta?.alkuaika)),
        [liput]
    );

    return (
        <Box sx={tyylit.sivu}>
            <Typography variant="h6" sx={tyylit.otsikko}>Myy liput</Typography>
            <Typography sx={tyylit.yhteenveto}>
                Myyty: {myynti.kpl} kpl · {euro(myynti.summa)}
            </Typography>

            {lataa && <CircularProgress size={24} sx={{ ml: 3 }} />}

            {virhe && (
                <Typography color="error" sx={{ ml: 3 }}>{virhe}</Typography>
            )}

            {!lataa && !virhe && jarjestetty.length === 0 && (
                <Typography sx={{ ml: 3 }}>Ei myytäviä lippuja.</Typography>
            )}

            {jarjestetty.length > 0 && (
                <Box sx={tyylit.lista}>
                    {jarjestetty.map((l) => (
                        <MyyntiKortti key={l.id} lippu={l} onSell={kasitteleMyynti} />
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default TicketSales;

// ---------------------------------------------------------------
// VÄRIT (muuta tyylin värit täältä)
// ---------------------------------------------------------------
const VARIT = {
    teksti: '#14213d',
    himmea: '#5b6478',
    korostus: '#2b59ff',
    korostusHover: '#1f45d1',
    viiva: '#c9d0e0',
    kantaTausta: '#f7f9fd',
    varoitus: '#b4540a',
    onnistui: '#15803d',
};

// ---------------------------------------------------------------
// TYYLIT (jokaisella osalla oma nimi ja selite)
// ---------------------------------------------------------------
const tyylit = {
    // Koko sivun osio
    sivu: { pb: 4 },

    // Otsikko ja myyntiyhteenveto
    otsikko: { textAlign: 'left', ml: 3, mt: 4, fontWeight: 600 },
    yhteenveto: { textAlign: 'left', ml: 3, mb: 2, color: VARIT.himmea },

    // Korttien lista
    lista: { display: 'flex', flexDirection: 'column', gap: 2 },
    korttiUlko: { ml: 3, mr: 3 },

    // Itse kortti: kaksi osaa vierekkäin (runko + kanta)
    kortti: {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr auto' }, // pienellä näytöllä allekkain
        width: '100%',
        maxWidth: 620,                                      // kortin enimmäisleveys
        border: `1px solid ${VARIT.viiva}`,
        borderRadius: '14px',
        overflow: 'hidden',
        color: VARIT.teksti,
        bgcolor: '#fff',
    },
    loppuunmyyty: { opacity: 0.6 },

    // Vasen osa: tapahtuman tiedot
    runko: { p: '20px 20px 20px 24px', textAlign: 'left', minWidth: 0 },
    aika: {
        display: 'block',
        fontSize: '.85rem',
        fontWeight: 600,
        color: VARIT.korostus,
        textTransform: 'capitalize',
    },
    sarjaLabel: { fontSize: '.8rem', color: VARIT.himmea, mt: 1.5 },
    sarjanumero: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25, wordBreak: 'break-all' },
    tyyppi: { fontSize: '.95rem', color: VARIT.himmea, mt: 0.5 },
    saatavilla: { fontSize: '.9rem', color: VARIT.himmea, mt: 2 },
    saatavillaVahan: { color: VARIT.varoitus, fontWeight: 600 },

    // Oikea osa: hinta ja myynti (perforoitu kanta)
    kanta: {
        width: { xs: 'auto', sm: 210 },
        p: '20px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        bgcolor: VARIT.kantaTausta,
        position: 'relative',
        borderLeft: { xs: 0, sm: `2px dashed ${VARIT.viiva}` },
        borderTop: { xs: `2px dashed ${VARIT.viiva}`, sm: 0 },
        // Perforaation pyöreät lovet
        '&::before, &::after': {
            content: '""',
            position: 'absolute',
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: 'background.default',
            border: `1px solid ${VARIT.viiva}`,
        },
        '&::before': { top: -11, left: -11 },
        '&::after': {
            top: { xs: -11, sm: 'auto' },
            bottom: { xs: 'auto', sm: -11 },
            left: { xs: 'auto', sm: -11 },
            right: { xs: -11, sm: 'auto' },
        },
    },
    hinta: { fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' },

    // Määrän valinta (− 1 +)
    maaraValitsin: { width: '100%' },
    maaraNumero: { flex: 1, pointerEvents: 'none', fontWeight: 600, color: VARIT.teksti },
    maaraNappi: { color: VARIT.teksti, borderColor: VARIT.viiva, minWidth: 40 },

    // Myy-painike
    myyNappi: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '10px',
        bgcolor: VARIT.korostus,
        '&:hover': { bgcolor: VARIT.korostusHover },
    },

    // Vahvistus myynnin jälkeen
    viesti: { fontSize: '.8rem', color: VARIT.onnistui, textAlign: 'center', minHeight: '1.2em' },
};
