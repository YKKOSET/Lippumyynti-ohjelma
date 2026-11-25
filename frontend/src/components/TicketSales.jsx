import { useOutletContext } from 'react-router';

import { useState, useEffect, useMemo } from 'react';
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

// ---------------------------------------------------------------
// LIPPUTYYPIT
// Jokaiselle esityskerralle tarjotaan nämä tyypit samassa järjestyksessä.
// HINNAT OVAT VAIN ESIMERKKEJÄ: vaihda ne omiksi tai hae myöhemmin kannasta.
// ---------------------------------------------------------------
const LIPPUTYYPIT = [
    { id: 'elakelainen', nimi: 'Eläkeläinen', hinta: 15 },
    { id: 'opiskelija', nimi: 'Opiskelija', hinta: 15 },
    { id: 'normaali', nimi: 'Normaalihintainen', hinta: 20 },
    { id: 'lapsi', nimi: 'Lastenlippu', hinta: 10 },
];

// ---------------------------------------------------------------
// ODOTETTU DATA
// useOutletContext(): tapahtumat: [{ id, nimi, esityskerrat: [{ id, alkuaika, maxOsallistujat, paikka: { nimi } }] }]
// Lippuja ei haeta kannasta. Myyntilista muodostuu tyyppikohtaisista määristä
// ({ 'tapahtumaId-esityskertaId': { elakelainen: 0, opiskelija: 2, ... } }).
// ---------------------------------------------------------------

// Enimmäisosallistujamäärä numerona (null = ei tietoa)
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
              weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit',
          })
        : '';

// Tapahtuman nimi eri muodoista
const nimiTapahtumasta = (t) => t?.nimi ?? t?.nimi_ ?? t?.name ?? null;

// ---------------------------------------------------------------
// YKSI LIPPUKORTTI (yksi lipputyyppi)
// Vasen osa: aika, tapahtuman nimi ja lipputyyppi.
// Oikea osa (perforoitu kanta): hinta sekä määrä + / - -painikkeilla.
// ---------------------------------------------------------------
function LippuKortti({ tyyppi, maara, nimi, esityskerta, onLisaa, onVahenna }) {
    return (
        <Box sx={tyylit.korttiUlko}>
            <Card elevation={0} sx={tyylit.kortti}>
                {/* Vasen osa */}
                <Box sx={tyylit.runko}>
                    <Typography component="time" sx={tyylit.aika}>
                        {muotoileAika(esityskerta?.alkuaika)}
                    </Typography>
                    <Typography sx={tyylit.tapahtumaNimi}>{nimi}</Typography>
                    <Typography sx={tyylit.tyyppi}>{tyyppi.nimi}</Typography>
                </Box>

                {/* Oikea osa */}
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

// ---------------------------------------------------------------
// KAIKKI TAPAHTUMAT: jokainen esityskerta omana ryhmänään,
// otsikkona tapahtuman nimi. Jokaisen esityskerran alla ovat lipputyypit.
// ---------------------------------------------------------------
function TicketSales() {

    //vastaanottaa menuvalikon kautta tiedot
    const {
        tapahtumat = [],
        lataa = false,
        virhe = '',
        navigoituTapahtuma = null
    } = useOutletContext();

    // { 'tapahtumaId-esityskertaId': { [lipputyyppiId]: määrä } }
    const [maarat, setMaarat] = useState({});
    const [maksuViesti, setMaksuViesti] = useState('');

    // Haku: tyhjä valinta = kaikki
    const [valittuTapahtuma, setValittuTapahtuma] = useState(''); // tapahtuman id
    const [valittuEsitys, setValittuEsitys] = useState('');       // ryhmän avain (tapahtumaId-esityskertaId)

    //aseta pudotusvalikkoon navigoinnin mukana tulleen tapahtuman tiedot
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

    // Esityskerta-valinnassa näkyvät vain valitun tapahtuman esityskerrat (tai kaikki, jos tapahtumaa ei valittu)
    const esitysVaihtoehdot = ryhmat.filter(
        (r) => !valittuTapahtuma || String(r.tapahtuma.id) === valittuTapahtuma
    );

    // Näytettävät ryhmät hakuvalintojen mukaan
    const nakyvat = ryhmat.filter(
        (r) =>
            (!valittuTapahtuma || String(r.tapahtuma.id) === valittuTapahtuma) &&
            (!valittuEsitys || r.avain === valittuEsitys)
    );

    const vaihdaTapahtuma = (id) => {
        setValittuTapahtuma(id);
        setValittuEsitys(''); // esityskerta valitaan uudelleen uuden tapahtuman sisältä
    };

    const poistaValinnat = () => {
        setValittuTapahtuma('');
        setValittuEsitys('');
    };

    const haeMaara = (avain, tyyppiId) => maarat[avain]?.[tyyppiId] ?? 0;

    // muutos: +1 tai -1. Määrä ei mene alle nollan.
    const muutaMaaraa = (avain, tyyppiId, muutos) => {
        setMaksuViesti('');
        setMaarat((vanhat) => {
            const nyt = vanhat[avain]?.[tyyppiId] ?? 0;
            return {
                ...vanhat,
                [avain]: { ...vanhat[avain], [tyyppiId]: Math.max(0, nyt + muutos) },
            };
        });
    };

    const nollaaRivi = (avain, tyyppiId) => {
        setMaarat((vanhat) => ({ ...vanhat, [avain]: { ...vanhat[avain], [tyyppiId]: 0 } }));
    };

    const tyhjennaLista = () => {
        setMaarat({});
        setMaksuViesti('');
    };

    // Myyntilista: kaikki rivit, joiden määrä on yli nolla (kaikista esityskerroista,
    // myös hakusuodatuksen ulkopuolisista, jotta valinnat eivät katoa suodatettaessa)
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

    // ---------------------------------------------------------------
    // MAKSU: lippujen luomista kantaan ei ole vielä toteutettu.
    // Myöhemmin tässä luodaan jokaisesta valitusta lipusta uusi lippu-tietue
    // (esityskertaId + lipputyyppi + hinta) ja niistä yksi osto POST /api/ostot.
    // ---------------------------------------------------------------
    const suoritaMaksu = () => {
        if (valitut.length === 0) return;
        setMaksuViesti('Lippujen luominen kantaan ei ole vielä käytössä. Mitään ei tallennettu.');
    };

    return (
        <Box sx={tyylit.sivu}>
            <Typography variant="h6" sx={tyylit.otsikko}>Myy liput</Typography>

            {/* Hakuvalikko: tapahtuma ja esityskerta. Ei valintaa = kaikki. */}
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

            {/* Myyntilista: valitut määrät ja kokonaishinta */}
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
                        disabled={valitut.length === 0}
                    >
                        {`Suorita maksu ${valitut.length > 0 ? euro(kokonaishinta) : ''}`}
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={tyylit.poistaNappi}
                        onClick={tyhjennaLista}
                        disabled={valitut.length === 0}
                    >
                        Tyhjennä lista
                    </Button>

                    <Typography sx={tyylit.viesti} role="status">{maksuViesti}</Typography>
                </Card>
            </Box>

            {lataa && <CircularProgress size={24} sx={{ ml: 3, mt: 2 }} />}

            {virhe && <Typography color="error" sx={{ ml: 3 }}>{virhe}</Typography>}

            {!lataa && !virhe && ryhmat.length === 0 && (
                <Typography sx={{ ml: 3 }}>Ei tapahtumia.</Typography>
            )}

            {nakyvat.map((ryhma) => {
                const { avain, nimi, esityskerta, maksimi } = ryhma;
                return (
                    <Box key={avain} component="section">
                        <Typography variant="h5" component="h2" sx={tyylit.tapahtumaOtsikko}>
                            {nimi}
                        </Typography>
                        <Typography sx={tyylit.tapahtumaTiedot}>
                            {[
                                muotoileAika(esityskerta.alkuaika),
                                esityskerta.paikka?.nimi,
                                maksimi !== null ? `Paikkoja enintään ${maksimi}` : '',
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        </Typography>

                        <Box sx={tyylit.lista}>
                            {LIPPUTYYPIT.map((tyyppi) => (
                                <LippuKortti
                                    key={tyyppi.id}
                                    tyyppi={tyyppi}
                                    maara={haeMaara(avain, tyyppi.id)}
                                    nimi={nimi}
                                    esityskerta={esityskerta}
                                    onLisaa={() => muutaMaaraa(avain, tyyppi.id, 1)}
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
    onnistui: '#15803d',
};

// ---------------------------------------------------------------
// TYYLIT (jokaisella osalla oma nimi ja selite)
// ---------------------------------------------------------------
const tyylit = {
    // Koko sivun osio
    sivu: { pb: 4 },
    otsikko: { textAlign: 'left', ml: 3, mt: 4, fontWeight: 600 },

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
    tyyppi: { fontSize: '.95rem', color: VARIT.himmea, mt: 0.5 },

    // Oikea osa: hinta ja määrä (perforoitu kanta)
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
    maaraRivi: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 },
    maara: { minWidth: 36, textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 },
    pyoreaNappi: {
        border: `1px solid ${VARIT.korostus}`,
        color: VARIT.korostus,
        '&.Mui-disabled': { borderColor: VARIT.viiva },
    },

    // Myy-painike
    myyNappi: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '10px',
        bgcolor: VARIT.korostus,
        '&:hover': { bgcolor: VARIT.korostusHover },
    },

    // Hakuvalikko sivun alussa
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

    // Toissijaiset painikkeet
    poistaNappi: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '10px',
        color: VARIT.korostus,
        borderColor: VARIT.korostus,
    },

    // Myyntilista (myytävät liput ja kokonaishinta)
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

    // Viesti maksun jälkeen
    viesti: { fontSize: '.8rem', color: VARIT.onnistui, textAlign: 'center', minHeight: '1.2em' },
};