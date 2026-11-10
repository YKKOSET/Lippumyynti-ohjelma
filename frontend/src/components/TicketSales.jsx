import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';

// ---------------------------------------------------------------
// OSOITE: vaihda omaksi
// ---------------------------------------------------------------
const API_BASE = 'http://localhost:8080/api';

const URLS = {
    tapahtumat: `${API_BASE}/tapahtumat`,
    liput: `${API_BASE}/liput`,
};

// Sama Basic-tunnistautuminen kuin LippuCardissa (poista, jos API ei vaadi sitä)
const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

// Kenttä, jossa on enimmäisosallistujamäärä (vaihda oikean kentän nimeksi)
const MAKSIMI_KENTTA = 'maksimiosallistujamaara';

// ---------------------------------------------------------------
// ODOTETTU DATA
// tapahtumat: [{ id, nimi, maksimiosallistujamaara, esityskerrat?: [{ id }] }]
// liput:      [{ id, hinta, lipputyyppi: { nimi }, esityskerta: { id, alkuaika } }]
//
// Lipun tapahtuma etsitään näin (ensimmäinen osuma voittaa):
//   1. esityskerta.tapahtumaId tai esityskerta.tapahtuma.id
//   2. tapahtuman esityskerrat-listasta (jos tapahtuma-vastauksessa on esityskerrat)
//
// Jäljellä olevat liput esityskerralla = tapahtuman enimmäisosallistujamäärä
//                                        - esityskerran jo ostetut liput (liput-listan rivit)
//                                        - tässä näkymässä myydyt liput
// ---------------------------------------------------------------

// Tapahtuman nimi
const tapahtumanNimi = (tapahtuma) => tapahtuma?.nimi ?? tapahtuma?.nimi_ ?? null;

// Enimmäisosallistujamäärä numerona (null = ei rajaa)
const haeMaksimi = (tapahtuma) => {
    const arvo = tapahtuma?.[MAKSIMI_KENTTA];
    if (arvo === null || arvo === undefined || arvo === '') return null;
    const luku = Number(arvo);
    return Number.isFinite(luku) ? luku : null;
};

// Jo ostetut liput esityskerralla. Jos tieto tulee muualta, muuta vain tätä funktiota.
const ostetutMaara = (esityksenLiput) => esityksenLiput.length;

const euro = (n) => `${n.toFixed(2).replace('.', ',')} €`;

const muotoileAika = (alkuaika) =>
    alkuaika
        ? new Date(alkuaika).toLocaleString('fi-FI', {
              weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit',
          })
        : '';

// Hakee osoitteen ja palauttaa aina taulukon
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
// jaljella = esityskerralle jäljellä olevat liput (null = ei rajaa)
// ---------------------------------------------------------------
function MyyntiKortti({ lippu, nimi, esityskerta, jaljella, onSell }) {
    const [maara, setMaara] = useState(1);
    const [viesti, setViesti] = useState('');

    const rajaOlemassa = jaljella !== null;
    const ylaraja = rajaOlemassa ? jaljella : Infinity;
    const loppu = ylaraja <= 0;
    const vahan = rajaOlemassa && !loppu && jaljella <= 5;

    const lipputyyppi = lippu.lipputyyppi?.nimi ?? lippu.lipputyyppi?.nimi_ ?? '';

    const muuta = (delta) =>
        setMaara((m) => Math.min(Math.max(1, m + delta), Math.max(1, ylaraja)));

    const myy = () => {
        if (loppu || maara > ylaraja) return;
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
                    <Typography sx={tyylit.tapahtumaNimi}>{nimi}</Typography>
                    <Typography sx={tyylit.tyyppi}>{lipputyyppi}</Typography>
                    <Typography sx={tyylit.sarjanumero}>Sarjanumero: {lippu.id}</Typography>
                    {loppu && <Typography sx={tyylit.saatavilla}>Loppuunmyyty</Typography>}
                    {!loppu && rajaOlemassa && (
                        <Typography sx={[tyylit.saatavilla, vahan && tyylit.saatavillaVahan]}>
                            {jaljella} lippua jäljellä
                        </Typography>
                    )}
                </Box>

                {/* Oikea osa */}
                <Box sx={tyylit.kanta}>
                    <Typography sx={tyylit.hinta}>{euro(lippu.hinta)}</Typography>

                    <ButtonGroup size="small" disabled={loppu} sx={tyylit.maaraValitsin} aria-label="Lippujen määrä">
                        <Button sx={tyylit.maaraNappi} onClick={() => muuta(-1)} disabled={maara <= 1}>−</Button>
                        <Button sx={tyylit.maaraNumero} disableRipple>{loppu ? 0 : maara}</Button>
                        <Button sx={tyylit.maaraNappi} onClick={() => muuta(1)} disabled={maara >= ylaraja}>+</Button>
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
// KAIKKI LIPUT: ryhmitelty esityskerroittain, otsikkona tapahtuman nimi
// ---------------------------------------------------------------
function TicketSales({ onSale }) {
    const [tapahtumat, setTapahtumat] = useState([]);
    const [liput, setLiput] = useState([]);
    const [myydytEsityksittain, setMyydytEsityksittain] = useState({}); // { esityskertaId: kpl }
    const [lataa, setLataa] = useState(true);
    const [virhe, setVirhe] = useState('');
    const [myynti, setMyynti] = useState({ kpl: 0, summa: 0 });

    // Haetaan tapahtumat ja liput yhtä aikaa, kun komponentti avautuu
    useEffect(() => {
        const ac = new AbortController();

        const haeKaikki = async () => {
            setLataa(true);
            setVirhe('');
            try {
                const [t, l] = await Promise.all([
                    haeJson(URLS.tapahtumat, ac.signal),
                    haeJson(URLS.liput, ac.signal),
                ]);
                setTapahtumat(t);
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

    // Liput ryhmitellään esityskerroittain. Otsikko ja enimmäismäärä tulevat esityskerran tapahtumalta.
    const ryhmat = useMemo(() => {
        const tapahtumaIdlla = new Map(tapahtumat.map((t) => [String(t.id), t]));

        // Jos tapahtumalla on esityskerrat-lista, voidaan esityskerrasta löytää tapahtuma
        const tapahtumaEsityksella = new Map();
        tapahtumat.forEach((t) =>
            (t.esityskerrat ?? []).forEach((e) => tapahtumaEsityksella.set(String(e.id), t))
        );

        const etsiTapahtuma = (esityskerta) => {
            if (!esityskerta) return null;
            const suoraId = esityskerta.tapahtumaId ?? esityskerta.tapahtuma?.id;
            if (suoraId !== undefined && suoraId !== null && tapahtumaIdlla.has(String(suoraId))) {
                return tapahtumaIdlla.get(String(suoraId));
            }
            return tapahtumaEsityksella.get(String(esityskerta.id)) ?? null;
        };

        const kartta = new Map();
        liput.forEach((lippu) => {
            const esityskerta = lippu.esityskerta ?? null;
            const avain = String(esityskerta?.id ?? lippu.esityskertaId ?? 'ei-esityskertaa');
            if (!kartta.has(avain)) kartta.set(avain, { avain, esityskerta, liput: [] });
            kartta.get(avain).liput.push(lippu);
        });

        return [...kartta.values()]
            .map((r) => {
                const tapahtuma = etsiTapahtuma(r.esityskerta);
                const nimi = tapahtumanNimi(tapahtuma);
                if (!nimi) {
                    console.warn(
                        'Esityskerralle ei löytynyt tapahtumaa. Esityskerta:', r.esityskerta,
                        'Esimerkkitapahtuma:', tapahtumat[0]
                    );
                }
                const maksimi = haeMaksimi(tapahtuma);
                const myydyt = myydytEsityksittain[r.avain] ?? 0;
                return {
                    ...r,
                    nimi: nimi ?? 'Muut liput',
                    maksimi,
                    jaljella: maksimi === null ? null : Math.max(0, maksimi - ostetutMaara(r.liput) - myydyt),
                };
            })
            .sort(
                (a, b) =>
                    a.nimi.localeCompare(b.nimi, 'fi') ||
                    new Date(a.esityskerta?.alkuaika) - new Date(b.esityskerta?.alkuaika)
            );
    }, [tapahtumat, liput, myydytEsityksittain]);

    const kasitteleMyynti = (avain, lippuId, maara) => {
        const ryhma = ryhmat.find((r) => r.avain === avain);
        const lippu = ryhma?.liput.find((l) => l.id === lippuId);
        if (!lippu) return;
        if (ryhma.jaljella !== null && maara > ryhma.jaljella) return;

        // Kasvatetaan esityskerran myytyjen määrää, jolloin jäljellä oleva määrä pienenee
        setMyydytEsityksittain((m) => ({ ...m, [avain]: (m[avain] ?? 0) + maara }));
        setMyynti((m) => ({ kpl: m.kpl + maara, summa: m.summa + maara * lippu.hinta }));
        onSale?.({
            esityskertaId: ryhma.esityskerta?.id,
            ticketId: lippuId,
            quantity: maara,
            total: maara * lippu.hinta,
        });
    };

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

            {ryhmat.map(({ avain, nimi, esityskerta, liput: esityksenLiput, maksimi, jaljella }) => (
                <Box key={avain} component="section">
                    {/* Väliotsikko: tapahtuman nimi */}
                    <Typography variant="h5" component="h2" sx={tyylit.tapahtumaOtsikko}>
                        {nimi}
                    </Typography>
                    <Typography sx={tyylit.tapahtumaTiedot}>
                        {[
                            muotoileAika(esityskerta?.alkuaika),
                            maksimi !== null ? `Jäljellä ${jaljella} / ${maksimi} lippua` : '',
                        ]
                            .filter(Boolean)
                            .join(' · ')}
                    </Typography>

                    <Box sx={tyylit.lista}>
                        {esityksenLiput.map((l) => (
                            <MyyntiKortti
                                key={l.id}
                                lippu={l}
                                nimi={nimi}
                                esityskerta={esityskerta}
                                jaljella={jaljella}
                                onSell={(id, maara) => kasitteleMyynti(avain, id, maara)}
                            />
                        ))}
                    </Box>
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

    // Väliotsikko: tapahtuma
    tapahtumaOtsikko: { textAlign: 'left', ml: 3, mt: 4, fontWeight: 700, color: VARIT.teksti },
    tapahtumaTiedot: { textAlign: 'left', ml: 3, mb: 1.5, fontSize: '.9rem', color: VARIT.himmea },

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
        mb: 0.5,
    },
    tapahtumaNimi: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25 },
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
