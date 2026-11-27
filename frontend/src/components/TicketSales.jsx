import { useOutletContext } from 'react-router';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LippuTietokanta from './LippuTietokanta';

const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

// dbId = Lipputyyppi-taulun id_ tietokannassa.
const LIPPUTYYPIT = [
    { id: 'elakelainen', nimi: 'Eläkeläinen', hinta: 15, dbId: 1 },
    { id: 'opiskelija', nimi: 'Opiskelija', hinta: 15, dbId: 2 },
    { id: 'normaali', nimi: 'Normaalihintainen', hinta: 20, dbId: 3 },
    { id: 'lapsi', nimi: 'Lastenlippu', hinta: 10, dbId: 4 },
];

const haeMaksimi = (esityskerta) => {
    const arvo = esityskerta?.maxOsallistujat;
    if (arvo === null || arvo === undefined || arvo === '') return null;
    const luku = Number(arvo);
    return Number.isFinite(luku) ? luku : null;
};

const euro = (n) => `${Number(n).toFixed(2).replace('.', ',')} €`;

const muotoileAika = (alkuaika) =>
    alkuaika
        ? new Date(alkuaika).toLocaleString('fi-FI', {
              weekday: 'short',
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '';

const nimiTapahtumasta = (t) => t?.nimi ?? t?.nimi_ ?? t?.name ?? null;

function LippuKortti({ tyyppi, maara, nimi, esityskerta, lisaysEstetty, onLisaa, onVahenna }) {
    return (
        <Box sx={tyylit.korttiUlko}>
            <Card elevation={0} sx={tyylit.kortti}>
                <Box sx={tyylit.runko}>
                    <Typography component="time" sx={tyylit.aika}>
                        {muotoileAika(esityskerta?.alkuaika)}
                    </Typography>
                    <Typography sx={tyylit.tapahtumaNimi}>{nimi}</Typography>
                    <Typography sx={tyylit.tyyppi}>{tyyppi.nimi}</Typography>
                </Box>

                <Box sx={tyylit.kanta}>
                    <Typography sx={tyylit.hinta}>{euro(tyyppi.hinta)}</Typography>

                    <Box sx={tyylit.maaraRivi}>
                        <IconButton
                            size="small"
                            onClick={onVahenna}
                            disabled={maara === 0}
                            aria-label={`Vähennä: ${tyyppi.nimi}`}
                            sx={tyylit.pyoreaNappi}
                        >
                            <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={tyylit.maara} role="status" aria-label={`${tyyppi.nimi}, määrä`}>
                            {maara}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={onLisaa}
                            disabled={lisaysEstetty}
                            aria-label={`Lisää: ${tyyppi.nimi}`}
                            sx={tyylit.pyoreaNappi}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}

function MyyntiSisalto({ onMaksu, api }) {
    const { luoLippu, lahetaOsto, tarkistaSaatavuus } = api;

    const {
        tapahtumat = [],
        lataa = false,
        virhe = '',
        navigoituTapahtuma = null
    } = useOutletContext();

    // { 'tapahtumaId-esityskertaId': { [lipputyyppiId]: määrä } }
    const [maarat, setMaarat] = useState({});
    const [maksuViesti, setMaksuViesti] = useState('');
    const [maksuVirhe, setMaksuVirhe] = useState('');
    const [kasitellaan, setKasitellaan] = useState(false);
    const [tarkistetaan, setTarkistetaan] = useState(false);

    // { [esityskertaId]: vapaita paikkoja palvelimen mukaan }
    const [jaljella, setJaljella] = useState({});

    const [valittuTapahtuma, setValittuTapahtuma] = useState('');
    const [valittuEsitys, setValittuEsitys] = useState('');

    useEffect(() => {
        if (!navigoituTapahtuma?.id) return;

        setValittuTapahtuma(String(navigoituTapahtuma.id));
        setValittuEsitys('');
    }, [navigoituTapahtuma?.id]);

    const ryhmat = useMemo(
        () =>
            tapahtumat
                .flatMap((tapahtuma) =>
                    (tapahtuma.esityskerrat ?? []).map((esitys) => ({
                        avain: `${tapahtuma.id}-${esitys.id}`,
                        tapahtuma,
                        nimi: nimiTapahtumasta(tapahtuma) ?? 'Nimetön tapahtuma',
                        esityskerta: esitys,
                        maksimi: haeMaksimi(esitys),
                    }))
                )
                .sort(
                    (a, b) =>
                        a.nimi.localeCompare(b.nimi, 'fi') ||
                        new Date(a.esityskerta.alkuaika) - new Date(b.esityskerta.alkuaika)
                ),
        [tapahtumat]
    );

    const paivitaJaljella = useCallback(async () => {
        const tulokset = await Promise.all(
            ryhmat.map(async ({ esityskerta }) => {
                try {
                    const data = await tarkistaSaatavuus(esityskerta.id, 1);
                    return [esityskerta.id, data.jaljella];
                } catch (err) {
                    console.error('Jäljellä olevien paikkojen haku epäonnistui:', err);
                    return null;
                }
            })
        );
        setJaljella(Object.fromEntries(tulokset.filter(Boolean)));
    }, [ryhmat, tarkistaSaatavuus]);

    useEffect(() => {
        paivitaJaljella();
    }, [paivitaJaljella]);

    const esitysVaihtoehdot = ryhmat.filter(
        (r) => !valittuTapahtuma || String(r.tapahtuma.id) === valittuTapahtuma
    );

    const nakyvat = ryhmat.filter(
        (r) =>
            (!valittuTapahtuma || String(r.tapahtuma.id) === valittuTapahtuma) &&
            (!valittuEsitys || r.avain === valittuEsitys)
    );

    const vaihdaTapahtuma = (id) => {
        setValittuTapahtuma(id);
        setValittuEsitys('');
    };

    const poistaValinnat = () => {
        setValittuTapahtuma('');
        setValittuEsitys('');
    };

    const haeMaara = (avain, tyyppiId) => maarat[avain]?.[tyyppiId] ?? 0;

    const muutaMaaraa = (avain, tyyppiId, muutos) => {
        if (kasitellaan) return;
        setMaksuViesti('');
        setMaksuVirhe('');
        setMaarat((vanhat) => {
            const nyt = vanhat[avain]?.[tyyppiId] ?? 0;
            return {
                ...vanhat,
                [avain]: { ...vanhat[avain], [tyyppiId]: Math.max(0, nyt + muutos) },
            };
        });
    };

    // Tarkistaa palvelimelta, että yksi lippu lisää on myytävissä, ennen kuin määrää kasvatetaan.
    const lisaaLippu = async (ryhma, tyyppiId) => {
        if (kasitellaan || tarkistetaan) return;
        const { avain, esityskerta } = ryhma;
        const valittuYhteensa = LIPPUTYYPIT.reduce((summa, t) => summa + haeMaara(avain, t.id), 0);

        setTarkistetaan(true);
        try {
            const data = await tarkistaSaatavuus(esityskerta.id, valittuYhteensa + 1);
            setJaljella((vanhat) => ({ ...vanhat, [esityskerta.id]: data.jaljella }));
            if (!data.saatavilla) {
                setMaksuViesti('');
                setMaksuVirhe(`Lippuja ei ole enää saatavilla: paikkoja on jäljellä ${data.jaljella}.`);
                return;
            }
            muutaMaaraa(avain, tyyppiId, 1);
        } catch (err) {
            console.error('Saatavuuden tarkistus epäonnistui:', err);
            setMaksuVirhe(err.message || 'Saatavuuden tarkistus epäonnistui.');
        } finally {
            setTarkistetaan(false);
        }
    };

    const nollaaRivi = (avain, tyyppiId) => {
        if (kasitellaan) return;
        setMaarat((vanhat) => ({ ...vanhat, [avain]: { ...vanhat[avain], [tyyppiId]: 0 } }));
    };

    const tyhjennaLista = () => {
        if (kasitellaan) return;
        setMaarat({});
        setMaksuViesti('');
        setMaksuVirhe('');
    };

    // Kaikki rivit, joiden määrä on yli nolla (myös suodatuksen ulkopuolelta)
    const valitut = useMemo(
        () =>
            ryhmat.flatMap((ryhma) =>
                LIPPUTYYPIT
                    .map((tyyppi) => {
                        const maara = maarat[ryhma.avain]?.[tyyppi.id] ?? 0;
                        return { ryhma, tyyppi, maara, summa: maara * tyyppi.hinta };
                    })
                    .filter((rivi) => rivi.maara > 0)
            ),
        [ryhmat, maarat]
    );

    const lippuja = valitut.reduce((summa, r) => summa + r.maara, 0);
    const kokonaishinta = valitut.reduce((summa, r) => summa + r.summa, 0);

    // Luo liput peräkkäin ja tallentaa onnistuneista yhden oston.
    // Epäonnistuneet liput jäävät myyntilistalle.
    const suoritaMaksu = async () => {
        if (valitut.length === 0 || kasitellaan) return;

        const myytavat = valitut.map(({ ryhma, tyyppi, maara }) => ({ ryhma, tyyppi, maara }));

        setKasitellaan(true);
        setMaksuViesti('');
        setMaksuVirhe('');

        try {
            // Jos yhdelläkään esityskerralla ei ole tarpeeksi paikkoja, mitään ei luoda.
            const maaratEsityksittain = {};
            myytavat.forEach(({ ryhma, maara }) => {
                const id = ryhma.esityskerta.id;
                maaratEsityksittain[id] = (maaratEsityksittain[id] ?? 0) + maara;
            });
            for (const [esityskertaId, maara] of Object.entries(maaratEsityksittain)) {
                let saatavuus;
                try {
                    saatavuus = await tarkistaSaatavuus(esityskertaId, maara);
                } catch (err) {
                    console.error('Saatavuuden tarkistus epäonnistui:', err);
                    setMaksuVirhe(err.message || 'Saatavuuden tarkistus epäonnistui.');
                    return;
                }
                if (!saatavuus.saatavilla) {
                    setMaksuVirhe(
                        `Lippuja ei ole tarpeeksi: valitsit ${maara} lippua, mutta paikkoja on jäljellä ${saatavuus.jaljella}.`
                    );
                    return;
                }
            }

            const luodut = [];
            const jaljelle = {};
            const virheet = [];

            for (const { ryhma, tyyppi, maara } of myytavat) {
                for (let i = 0; i < maara; i += 1) {
                    try {
                        const lippu = await luoLippu(ryhma.esityskerta.id, tyyppi);
                        luodut.push({
                            lippu,
                            hinta: tyyppi.hinta,
                            tapahtumaId: ryhma.tapahtuma.id,
                            esityskertaId: ryhma.esityskerta.id,
                        });
                    } catch (err) {
                        virheet.push(err.message || String(err));
                        console.error('Lipun luonti epäonnistui:', err);
                        jaljelle[ryhma.avain] = {
                            ...jaljelle[ryhma.avain],
                            [tyyppi.id]: (jaljelle[ryhma.avain]?.[tyyppi.id] ?? 0) + 1,
                        };
                    }
                }
            }

            if (luodut.length > 0) {
                const yhteensa = luodut.reduce((summa, l) => summa + Number(l.hinta || 0), 0);

                const ostoPayload = {
                    ostoaika: new Date().toISOString(),
                    kokonaishinta: Number(yhteensa.toFixed(2)),
                    ostorivit: luodut.map(({ lippu, hinta }) => ({
                        lippu: { id: lippu.id },
                        myyntihinta: Number(Number(hinta || 0).toFixed(2)),
                    })),
                };

                let ostoTallennettu = false;
                try {
                    await lahetaOsto(ostoPayload);
                    ostoTallennettu = true;
                } catch (err) {
                    console.error('Ostotapahtuman tallennus epäonnistui:', err);
                    setMaksuVirhe(`Liput luotiin ostetuiksi, mutta ostotapahtuman tallennus epäonnistui. ${err.message || ''}`);
                }

                try {
                    onMaksu?.({
                        liput: luodut.map(({ lippu, hinta, tapahtumaId, esityskertaId }) => ({
                            id: lippu.id, hinta, tapahtumaId, esityskertaId,
                        })),
                        yhteensa,
                    });
                } catch (err) {
                    console.error('onMaksu-käsittelijä epäonnistui:', err);
                }

                setMaksuViesti(
                    ostoTallennettu
                        ? `Maksu suoritettu ja ostotapahtuma tallennettu: ${luodut.length} kpl · ${euro(yhteensa)}`
                        : `Liput luotu: ${luodut.length} kpl · ${euro(yhteensa)}`
                );
            }

            if (virheet.length > 0) {
                setMaksuVirhe((vanha) =>
                    `${virheet.length} lipun luonti epäonnistui. Epäonnistuneet liput jäivät myyntilistalle. ${virheet[0]}` +
                    (vanha ? ` ${vanha}` : '')
                );
            }

            setMaarat(jaljelle);
        } finally {
            await paivitaJaljella();
            setKasitellaan(false);
        }
    };

    return (
        <Box sx={tyylit.sivu}>
            <Typography variant="h6" sx={tyylit.otsikko}>Myy liput</Typography>

            <Box sx={tyylit.haku}>
                <FormControl size="small" sx={tyylit.hakuKentta}>
                    <InputLabel id="haku-tapahtuma" shrink>Tapahtuma</InputLabel>
                    <Select
                        labelId="haku-tapahtuma"
                        label="Tapahtuma"
                        value={valittuTapahtuma}
                        displayEmpty
                        notched
                        onChange={(e) => vaihdaTapahtuma(e.target.value)}
                    >
                        <MenuItem value="">Kaikki tapahtumat</MenuItem>
                        {tapahtumat.map((t) => (
                            <MenuItem key={t.id} value={String(t.id)}>
                                {nimiTapahtumasta(t) ?? 'Nimetön tapahtuma'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={tyylit.hakuKentta}>
                    <InputLabel id="haku-esitys" shrink>Esityskerta</InputLabel>
                    <Select
                        labelId="haku-esitys"
                        label="Esityskerta"
                        value={valittuEsitys}
                        displayEmpty
                        notched
                        onChange={(e) => setValittuEsitys(e.target.value)}
                    >
                        <MenuItem value="">Kaikki esityskerrat</MenuItem>
                        {esitysVaihtoehdot.map((r) => (
                            <MenuItem key={r.avain} value={r.avain}>
                                {[
                                    valittuTapahtuma ? '' : r.nimi,
                                    muotoileAika(r.esityskerta.alkuaika),
                                    r.esityskerta.paikka?.nimi,
                                ]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    size="small"
                    sx={tyylit.poistaNappi}
                    onClick={poistaValinnat}
                    disabled={!valittuTapahtuma && !valittuEsitys}
                >
                    Poista valinnat
                </Button>
            </Box>

            <Box sx={tyylit.korttiUlko}>
                <Card variant="outlined" sx={tyylit.myyntilista}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Myyntilista ({lippuja} kpl)
                    </Typography>

                    {valitut.length === 0 && (
                        <Typography sx={tyylit.tyhjaLista}>
                            Lisää lippuja esityskerran + -painikkeilla, niin ne tulevat tähän.
                        </Typography>
                    )}

                    {valitut.map(({ ryhma, tyyppi, maara, summa }) => (
                        <Box key={`${ryhma.avain}-${tyyppi.id}`} sx={tyylit.listaRivi}>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 600 }}>
                                    {ryhma.nimi} · {tyyppi.nimi}
                                </Typography>
                                <Typography sx={tyylit.rivinLisatieto}>
                                    {[muotoileAika(ryhma.esityskerta.alkuaika), `${maara} × ${euro(tyyppi.hinta)}`]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{euro(summa)}</Typography>
                            <Button size="small" onClick={() => nollaaRivi(ryhma.avain, tyyppi.id)}>Poista</Button>
                        </Box>
                    ))}

                    <Box sx={tyylit.yhteensaRivi}>
                        <Typography sx={{ fontWeight: 700 }}>Yhteensä</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{euro(kokonaishinta)}</Typography>
                    </Box>

                    <Button
                        variant="contained"
                        disableElevation
                        sx={tyylit.myyNappi}
                        onClick={suoritaMaksu}
                        disabled={valitut.length === 0 || kasitellaan}
                    >
                        {kasitellaan
                            ? 'Käsitellään...'
                            : `Suorita maksu ${valitut.length > 0 ? euro(kokonaishinta) : ''}`}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={tyylit.poistaNappi}
                        onClick={tyhjennaLista}
                        disabled={valitut.length === 0 || kasitellaan}
                    >
                        Tyhjennä lista
                    </Button>

                    <Typography sx={tyylit.viesti} role="status">{maksuViesti}</Typography>
                    {maksuVirhe && (
                        <Typography color="error" sx={{ fontSize: '.85rem', textAlign: 'center' }} role="alert">
                            {maksuVirhe}
                        </Typography>
                    )}
                </Card>
            </Box>

            {lataa && <CircularProgress size={24} sx={{ ml: 3, mt: 2 }} />}

            {virhe && <Typography color="error" sx={{ ml: 3 }}>{virhe}</Typography>}

            {!lataa && !virhe && ryhmat.length === 0 && (
                <Typography sx={{ ml: 3 }}>Ei tapahtumia.</Typography>
            )}

            {nakyvat.map((ryhma) => {
                const { avain, nimi, esityskerta, maksimi } = ryhma;
                const palvelimelta = jaljella[esityskerta.id];
                const valittuMaara = LIPPUTYYPIT.reduce((summa, t) => summa + haeMaara(avain, t.id), 0);
                const vapaana = palvelimelta === undefined ? null : Math.max(0, palvelimelta - valittuMaara);
                return (
                    <Box key={avain} component="section">
                        <Typography variant="h5" component="h2" sx={tyylit.tapahtumaOtsikko}>
                            {nimi}
                        </Typography>
                        <Typography sx={tyylit.tapahtumaTiedot}>
                            {[muotoileAika(esityskerta.alkuaika), esityskerta.paikka?.nimi]
                                .filter(Boolean)
                                .join(' · ')}
                            {vapaana !== null && (
                                <>
                                    {' · '}Lippuja jäljellä{' '}
                                    <Box component="strong" sx={{ color: VARIT.teksti }}>{vapaana}</Box>
                                    {maksimi !== null && ` / ${maksimi}`}
                                </>
                            )}
                        </Typography>

                        <Box sx={tyylit.lista}>
                            {LIPPUTYYPIT.map((tyyppi) => (
                                <LippuKortti
                                    key={tyyppi.id}
                                    tyyppi={tyyppi}
                                    maara={haeMaara(avain, tyyppi.id)}
                                    nimi={nimi}
                                    esityskerta={esityskerta}
                                    lisaysEstetty={kasitellaan || tarkistetaan || (vapaana !== null && vapaana <= 0)}
                                    onLisaa={() => lisaaLippu(ryhma, tyyppi.id)}
                                    onVahenna={() => muutaMaaraa(avain, tyyppi.id, -1)}
                                />
                            ))}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

function TicketSales({ onMaksu }) {
    return (
        <LippuTietokanta tunnus={username} salasana={password}>
            {(api) => <MyyntiSisalto api={api} onMaksu={onMaksu} />}
        </LippuTietokanta>
    );
}

export default TicketSales;

const VARIT = {
    teksti: '#14213d',
    himmea: '#5b6478',
    korostus: '#2b59ff',
    korostusHover: '#1f45d1',
    viiva: '#c9d0e0',
    kantaTausta: '#f7f9fd',
    onnistui: '#15803d',
};

const tyylit = {
    sivu: { pb: 4 },
    otsikko: { textAlign: 'left', ml: 3, mt: 4, fontWeight: 600 },

    tapahtumaOtsikko: { textAlign: 'left', ml: 3, mt: 4, fontWeight: 700, color: VARIT.teksti },
    tapahtumaTiedot: { textAlign: 'left', ml: 3, mb: 1.5, fontSize: '.9rem', color: VARIT.himmea },

    lista: { display: 'flex', flexDirection: 'column', gap: 2 },
    korttiUlko: { ml: 3, mr: 3 },

    kortti: {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
        width: '100%',
        maxWidth: 620,
        border: `1px solid ${VARIT.viiva}`,
        borderRadius: '14px',
        overflow: 'hidden',
        color: VARIT.teksti,
        bgcolor: '#fff',
    },

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
    tyyppi: { fontSize: '.95rem', color: VARIT.himmea, mt: 0.5 },

    kanta: {
        width: { xs: 'auto', sm: 210 },
        p: '20px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 1.5,
        bgcolor: VARIT.kantaTausta,
        position: 'relative',
        borderLeft: { xs: 0, sm: `2px dashed ${VARIT.viiva}` },
        borderTop: { xs: `2px dashed ${VARIT.viiva}`, sm: 0 },
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
    maaraRivi: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 },
    maara: { minWidth: 36, textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 },
    pyoreaNappi: {
        border: `1px solid ${VARIT.korostus}`,
        color: VARIT.korostus,
        '&.Mui-disabled': { borderColor: VARIT.viiva },
    },

    myyNappi: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '10px',
        bgcolor: VARIT.korostus,
        '&:hover': { bgcolor: VARIT.korostusHover },
    },

    haku: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
        ml: 3,
        mr: 3,
        mb: 2,
    },
    hakuKentta: { minWidth: 220, flex: '1 1 220px', maxWidth: 320, textAlign: 'left' },

    poistaNappi: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '10px',
        color: VARIT.korostus,
        borderColor: VARIT.korostus,
    },

    myyntilista: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        width: '100%',
        maxWidth: 620,
        p: 2.5,
        mb: 2,
        border: `1px solid ${VARIT.viiva}`,
        borderRadius: '14px',
        color: VARIT.teksti,
        bgcolor: '#fff',
    },
    tyhjaLista: { color: VARIT.himmea, fontSize: '.9rem' },
    listaRivi: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        alignItems: 'center',
        gap: 1.5,
        pb: 1,
        borderBottom: `1px solid ${VARIT.viiva}`,
        textAlign: 'left',
    },
    rivinLisatieto: { fontSize: '.8rem', color: VARIT.himmea, mt: 0.5 },
    yhteensaRivi: { display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' },

    viesti: { fontSize: '.8rem', color: VARIT.onnistui, textAlign: 'center', minHeight: '1.2em' },
};