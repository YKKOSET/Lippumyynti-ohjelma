import { useOutletContext } from 'react-router';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import { api } from './LippuTietokanta';

const nimiTapahtumasta = (t) => t?.nimi ?? t?.nimi_ ?? t?.name ?? null;

const euro = (n) => `${n.toFixed(2).replace('.', ',')} €`;

// Osto- ja ostorivitietojen nimet voivat vaihdella Java-mallien mukaan.
// Tunnistetaan yleisimmät kenttänimet, jotta GET /api/ostot -vastaus voidaan näyttää.
const ensimmainenArvo = (obj, nimet) => {
    for (const nimi of nimet) {
        const arvo = obj?.[nimi];
        if (arvo !== undefined && arvo !== null && arvo !== '') return arvo;
    }
    return null;
};

const ostonAikaleima = (osto) => ensimmainenArvo(osto, [
    'ostoaika', 'ostoAika', 'aikaleima', 'createdAt', 'created_at',
    'pvm', 'paivamaara', 'päivämäärä', 'date', 'timestamp',
]);

const ostonRivit = (osto) => {
    const rivit = ensimmainenArvo(osto, ['ostorivit', 'ostoRivit', 'rivit', 'liput', 'tickets', 'items']);
    if (Array.isArray(rivit)) return rivit;
    // Jos Osto-mallissa on vain yksi suora lippuviite.
    const lippu = ensimmainenArvo(osto, ['lippu', 'ticket']);
    return lippu ? [{ lippu }] : [];
};

const rivinLippu = (rivi) => ensimmainenArvo(rivi, ['lippu', 'ticket']) ?? rivi;

const rivinLippuId = (rivi) => {
    const lippu = rivinLippu(rivi);
    return ensimmainenArvo(lippu, ['id', 'lippuId', 'lippu_id', 'sarjanumero']) ??
        ensimmainenArvo(rivi, ['lippuId', 'lippu_id', 'ticketId']);
};

const muotoileOstoAika = (arvo) => {
    if (arvo === null || arvo === undefined || arvo === '') return 'Ajankohta ei ole saatavilla';
    const pvm = new Date(arvo);
    if (Number.isNaN(pvm.getTime())) return String(arvo);
    return pvm.toLocaleString('fi-FI', {
        day: 'numeric', month: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
};

// ---------------------------------------------------------------
// OSTOHISTORIA-SIVU
// Hakee ostot itse (GET /api/ostot). Tapahtumat tulevat menuvalikon
// kautta (useOutletContext). Niiden esityskertojen lipuista muodostetaan
// hakutaulu, jolla ostoriveille täydennetään tapahtuman nimi, hinta ja lipputyyppi,
// jos ostorivin vastauksessa ne puuttuvat.
// ---------------------------------------------------------------
function OstoHistoria() {
    const { tapahtumat = [] } = useOutletContext();

    const [ostot, setOstot] = useState([]);
    const [lataaOstoja, setLataaOstoja] = useState(true);
    const [ostotVirhe, setOstotVirhe] = useState('');

    // { 'lippuId': { lippu, nimi } } – vain täydennystä varten
    const [lipputiedot, setLipputiedot] = useState({});

    // Haetaan ostotapahtumat
    useEffect(() => {
        const ac = new AbortController();

        const haeOstot = async () => {
            setLataaOstoja(true);
            setOstotVirhe('');
            try {
                const data = await api.ostot.hae(ac.signal);
                console.log('[OSTOT] GET /api/ostot raakavastaus:', data);
                setOstot(Array.isArray(data) ? data : []);
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error('Ostotapahtumien haku epäonnistui:', err);
                setOstotVirhe(err.message || 'Ostotapahtumien haku epäonnistui.');
            } finally {
                if (!ac.signal.aborted) setLataaOstoja(false);
            }
        };

        haeOstot();
        return () => ac.abort();
    }, []);

    // Haetaan liput esityskerroittain pelkkää täydennystä varten.
    // Epäonnistuminen ei estä historian näyttämistä.
    useEffect(() => {
        if (tapahtumat.length === 0) return;
        const ac = new AbortController();

        const haeLiput = async () => {
            const taulu = {};
            await Promise.all(
                tapahtumat.flatMap((t) =>
                    (t.esityskerrat ?? []).map(async (e) => {
                        try {
                            const data = await api.haeEsityskerranLiput(t.id, e.id, ac.signal);
                            if (!Array.isArray(data)) return;
                            const nimi = nimiTapahtumasta(t) ?? 'Nimetön tapahtuma';
                            data.forEach((lippu) => { taulu[String(lippu.id)] = { lippu, nimi }; });
                        } catch (err) {
                            if (err.name !== 'AbortError') console.warn('Lippujen haku epäonnistui:', err);
                        }
                    })
                )
            );
            if (!ac.signal.aborted) setLipputiedot(taulu);
        };

        haeLiput();
        return () => ac.abort();
    }, [tapahtumat]);

    const jarjestetyt = [...ostot].sort((a, b) => {
        const ta = new Date(ostonAikaleima(a) || 0).getTime();
        const tb = new Date(ostonAikaleima(b) || 0).getTime();
        return tb - ta;
    });

    return (
        <Box sx={tyylit.sivu}>
            <Typography variant="h6" sx={tyylit.otsikko}>Osto historia</Typography>

            {lataaOstoja && (
                <Box sx={tyylit.latausRivi}>
                    <CircularProgress size={20} />
                    <Typography>Haetaan ostotapahtumia...</Typography>
                </Box>
            )}

            {ostotVirhe && <Typography color="error" sx={tyylit.sisennys}>{ostotVirhe}</Typography>}

            {!lataaOstoja && !ostotVirhe && ostot.length === 0 && (
                <Typography sx={{ ...tyylit.sisennys, color: VARIT.himmea }}>
                    Ostotapahtumia ei löytynyt. Tarkista, että GET /api/ostot palauttaa tallennetut ostot.
                </Typography>
            )}

            {!lataaOstoja && !ostotVirhe && jarjestetyt.map((osto, index) => {
                const ostorivit = ostonRivit(osto);
                const ostoId = ensimmainenArvo(osto, ['id', 'ostoId']) ?? index + 1;
                const aika = ostonAikaleima(osto);
                const summa = ensimmainenArvo(osto, ['yhteensa', 'kokonaishinta', 'summa', 'total', 'hinta']);

                return (
                    <Box key={ostoId} sx={tyylit.korttiUlko}>
                        <Card variant="outlined" sx={tyylit.osto}>
                            <Box sx={tyylit.ostoOtsikko}>
                                <Typography sx={{ fontWeight: 700 }}>Osto #{ostoId}</Typography>
                                <Typography sx={{ color: VARIT.himmea, fontSize: '.9rem' }}>
                                    {muotoileOstoAika(aika)}
                                </Typography>
                            </Box>

                            {summa !== null && (
                                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                                    Yhteensä: {euro(Number(summa))}
                                </Typography>
                            )}

                            {ostorivit.length > 0 ? ostorivit.map((rivi, riviIndex) => {
                                const lippu = rivinLippu(rivi);
                                const lippuId = rivinLippuId(rivi);
                                const tunnettu = lipputiedot[String(lippuId)];
                                const tunnettuLippu = tunnettu?.lippu;

                                const hinta =
                                    ensimmainenArvo(rivi, ['hinta', 'myyntihinta', 'price']) ??
                                    ensimmainenArvo(lippu, ['hinta', 'price']) ??
                                    tunnettuLippu?.hinta;
                                const tyyppi =
                                    ensimmainenArvo(lippu?.lipputyyppi, ['nimi', 'nimi_']) ??
                                    ensimmainenArvo(rivi, ['lipputyyppiNimi', 'tyyppi']) ??
                                    tunnettuLippu?.lipputyyppi?.nimi ??
                                    tunnettuLippu?.lipputyyppi?.nimi_;
                                const tapahtuma =
                                    ensimmainenArvo(lippu, ['tapahtumaNimi', 'nimi']) ??
                                    tunnettu?.nimi ??
                                    'Lippu';

                                return (
                                    <Box key={`${lippuId ?? 'rivi'}-${riviIndex}`} sx={tyylit.listaRivi}>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography sx={{ fontWeight: 600 }}>
                                                {tapahtuma}{tyyppi ? ` · ${tyyppi}` : ''}
                                            </Typography>
                                            <Typography sx={tyylit.sarjanumero}>
                                                Sarjanumero: {lippuId ?? 'Ei saatavilla'}
                                            </Typography>
                                        </Box>
                                        {hinta !== null && hinta !== undefined && (
                                            <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                {euro(Number(hinta))}
                                            </Typography>
                                        )}
                                    </Box>
                                );
                            }) : (
                                <Typography sx={{ color: VARIT.himmea, fontSize: '.9rem' }}>
                                    Ostolle ei löytynyt ostorivejä API-vastauksesta.
                                </Typography>
                            )}
                        </Card>
                    </Box>
                );
            })}
        </Box>
    );
}

export default OstoHistoria;

// ---------------------------------------------------------------
// VÄRIT JA TYYLIT
// ---------------------------------------------------------------
const VARIT = {
    teksti: '#14213d',
    himmea: '#5b6478',
    viiva: '#c9d0e0',
};

const tyylit = {
    sivu: { pb: 4 },
    otsikko: { textAlign: 'left', ml: 3, mt: 4, mb: 2, fontWeight: 600 },
    sisennys: { ml: 3, textAlign: 'left' },
    latausRivi: { display: 'flex', alignItems: 'center', gap: 1, ml: 3 },
    korttiUlko: { ml: 3, mr: 3, mb: 2 },
    osto: {
        width: '100%',
        maxWidth: 620,
        p: 2.5,
        border: `1px solid ${VARIT.viiva}`,
        borderRadius: '14px',
        color: VARIT.teksti,
        bgcolor: '#fff',
        textAlign: 'left',
    },
    ostoOtsikko: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
        mb: 1,
    },
    sarjanumero: { fontSize: '.8rem', color: VARIT.himmea, mt: 1.5, wordBreak: 'break-all' },
    listaRivi: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 1.5,
        py: 1,
        borderBottom: `1px solid ${VARIT.viiva}`,
        textAlign: 'left',
        '&:last-child': { borderBottom: 0, pb: 0 },
    },
};