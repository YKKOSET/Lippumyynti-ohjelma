import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';

// ---------------------------------------------------------------
// OSOITTEET: vaihda omiksi
// ---------------------------------------------------------------
const API_URLS = {
    tapahtumat: 'http://localhost:8080/api/tapahtumat',
    esityskerrat: 'https://localhost:8080/api/esityskerrat',
    liput: 'http://localhost:8080/api/liput',
};

// Sama Basic-tunnistautuminen kuin LippuCardissa (poista, jos API ei vaadi sitä)
const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

// ---------------------------------------------------------------
// ODOTETTU DATA
// tapahtumat:   [{ id, nimi }]
// esityskerrat: [{ id, tapahtumaId, alkuaika }]
// liput:        [{ id, esityskertaId, lipputyyppi: { nimi }, hinta, saatavilla }]
// (tapahtumaId ja esityskertaId voivat olla myös sisäkkäisiä: tapahtuma.id, esityskerta.id)
// ---------------------------------------------------------------
const lipunEsitysId = (lippu) => lippu.esityskertaId ?? lippu.esityskerta?.id;
const esityksenTapahtumaId = (esitys) => esitys.tapahtumaId ?? esitys.tapahtuma?.id;

const euro = (n) => `${n.toFixed(2).replace('.', ',')} €`;

const muotoileAika = (alkuaika) =>
    alkuaika
        ? new Date(alkuaika).toLocaleString('fi-FI', {
              weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit',
          })
        : '';

// Hakee yhden osoitteen ja palauttaa aina taulukon
const haeJson = async (url, signal) => {
    const res = await fetch(url, {
        signal,
        headers: { 'Authorization': 'Basic ' + btoa(`${username}:${password}`) },
    });
    if (!res.ok) throw new Error(`Haku epäonnistui (${url}): ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

// ---------------------------------------------------------------
// YKSI MYYNTIKORTTI
// ---------------------------------------------------------------
function MyyntiKortti({ lippu, tapahtuma, esityskerta, onSell }) {
    const [maara, setMaara] = useState(1);
    const [viesti, setViesti] = useState('');

    const loppu = lippu.saatavilla <= 0;
    const vahan = !loppu && lippu.saatavilla <= 5;

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
                    <Typography component="time" sx={tyylit.aika}>
                        {muotoileAika(esityskerta?.alkuaika)}
                    </Typography>
                    <Typography sx={tyylit.tapahtumaNimi}>{tapahtuma?.nimi}</Typography>
                    <Typography sx={tyylit.tyyppi}>{lipputyyppi}</Typography>
                    <Typography sx={tyylit.sarjanumero}>Sarjanumero: {lippu.id}</Typography>
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
// KAIKKI LIPUT: tapahtuma > esityskerta > liput
// ---------------------------------------------------------------
function TicketSales({ onSale }) {
    const [tapahtumat, setTapahtumat] = useState([]);
    const [esityskerrat, setEsityskerrat] = useState([]);
    const [liput, setLiput] = useState([]);
    const [lataa, setLataa] = useState(true);
    const [virhe, setVirhe] = useState('');
    const [myynti, setMyynti] = useState({ kpl: 0, summa: 0 });

    // Haetaan kaikki kolme kerralla, kun komponentti avautuu
    useEffect(() => {
        const ac = new AbortController();

        const haeKaikki = async () => {
            setLataa(true);
            setVirhe('');
            try {
                const [t, e, l] = await Promise.all([
                    haeJson(API_URLS.tapahtumat, ac.signal),
                    haeJson(API_URLS.esityskerrat, ac.signal),
                    haeJson(API_URLS.liput, ac.signal),
                ]);
                setTapahtumat(t);
                setEsityskerrat(e);
                setLiput(l);
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error('Tietojen haku epäonnistui:', err);
                setVirhe('Tietojen haku epäonnistui');
            } finally {
                if (!ac.signal.aborted) setLataa(false);
            }
        };

        haeKaikki();
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

    // Ryhmitellään: tapahtumat aakkosjärjestyksessä, esityskerrat ajan mukaan.
    // Tyhjiä tapahtumia ja esityskertoja ei näytetä.
    const ryhmat = useMemo(() => {
        const esityksetAjanMukaan = [...esityskerrat].sort(
            (a, b) => new Date(a.alkuaika) - new Date(b.alkuaika)
        );

        return [...tapahtumat]
            .sort((a, b) => (a.nimi ?? '').localeCompare(b.nimi ?? '', 'fi'))
            .map((tapahtuma) => ({
                tapahtuma,
                esitykset: esityksetAjanMukaan
                    .filter((e) => esityksenTapahtumaId(e) === tapahtuma.id)
                    .map((esityskerta) => ({
                        esityskerta,
                        liput: liput.filter((l) => lipunEsitysId(l) === esityskerta.id),
                    }))
                    .filter((e) => e.liput.length > 0),
            }))
            .filter((r) => r.esitykset.length > 0);
    }, [tapahtumat, esityskerrat, liput]);

    return (
        <Box sx={tyylit.sivu}>
            <Typography variant="h6" sx={tyylit.otsikko}>Myy liput</Typography>
            <Typography sx={tyylit.yhteenveto}>
                Myyty: {myynti.kpl} kpl · {euro(myynti.summa)}
            </Typography>

            {lataa && <CircularProgress size={24} sx={{ ml: 3 }} />}

            {virhe && <Typography color="error" sx={{ ml: 3 }}>{virhe}</Typography>}

            {!lataa && !virhe && ryhmat.length === 0 && (
                <Typography sx={{ ml: 3 }}>Ei myytäviä lippuja.</Typography>
            )}

            {ryhmat.map(({ tapahtuma, esitykset }) => (
                <Box key={tapahtuma.id} component="section">
                    {/* Väliotsikko: tapahtuma */}
                    <Typography variant="h5" component="h2" sx={tyylit.tapahtumaOtsikko}>
                        {tapahtuma.nimi}
                    </Typography>

                    {esitykset.map(({ esityskerta, liput: esityksenLiput }) => (
                        <Box key={esityskerta.id}>
                            {/* Väliotsikko: esityskerta */}
                            <Typography variant="subtitle1" component="h3" sx={tyylit.esitysOtsikko}>
                                {muotoileAika(esityskerta.alkuaika)}
                            </Typography>

                            <Box sx={tyylit.lista}>
                                {esityksenLiput.map((l) => (
                                    <MyyntiKortti
                                        key={l.id}
                                        lippu={l}
                                        tapahtuma={tapahtuma}
                                        esityskerta={esityskerta}
                                        onSell={kasitteleMyynti}
                                    />
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            ))}
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

    // Väliotsikot: tapahtuma ja sen esityskerrat
    tapahtumaOtsikko: { textAlign: 'left', ml: 3, mt: 4, fontWeight: 700, color: VARIT.teksti },
    esitysOtsikko: {
        textAlign: 'left',
        ml: 3,
        mt: 2,
        mb: 1,
        fontWeight: 600,
        color: VARIT.korostus,
        textTransform: 'capitalize',
    },

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
    tapahtumaNimi: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25, mt: 0.5 },
    sarjanumero: { fontSize: '.8rem', color: VARIT.himmea, mt: 1.5, wordBreak: 'break-all' },
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
