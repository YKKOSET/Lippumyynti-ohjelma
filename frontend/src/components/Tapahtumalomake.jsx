
import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Divider,
    IconButton,
    Stack
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from './Popup';
import { api } from './LippuTietokanta';

const TYHJA_JARJESTAJA = {
    etunimi: '',
    sukunimi: '',
    sposti: '',
    puhelinnumero: ''
};

const nimiTapahtumasta = (t) =>
    t?.nimi ?? t?.nimi_ ?? t?.name ?? '';

const tapahtumanJarjestajaId = (t) =>
    t?.jarjestaja?.id ?? t?.jarjestajaId ?? null;

const paikallinenAikaKenttaan = (paiva = new Date()) => {
    const paikallinen = new Date(
        paiva.getTime() - paiva.getTimezoneOffset() * 60000
    );
    return paikallinen.toISOString().slice(0, 16);
};

const Tapahtumalomake = ({ onSubmit }) => {
    const [nimi, setNimi] = useState('');
    const [tapahtumat, setTapahtumat] = useState([]);
    const [tapahtumatVirhe, setTapahtumatVirhe] = useState('');
    const [tapahtumaId, setTapahtumaId] = useState('');
    const [uusiTapahtuma, setUusiTapahtuma] = useState(false);

    const [jarjestajat, setJarjestajat] = useState([]);
    const [jarjestajatVirhe, setJarjestajatVirhe] = useState('');
    const [jarjestajaId, setJarjestajaId] = useState('');
    const [uusiJarjestaja, setUusiJarjestaja] = useState(false);
    const [jarjestaja, setJarjestaja] = useState(TYHJA_JARJESTAJA);

    const [showPopUp, setShowPopUp] = useState(false);
    const [tallennetaan, setTallennetaan] = useState(false);
    const [tallennusVirhe, setTallennusVirhe] = useState('');

    // Haetaan nykyiset tapahtumat ja järjestäjät
    const lataaListat = useCallback(async (signal) => {
        const hae = async (haku, setLista, setVirhe, teksti) => {
            try {
                const data = await haku(signal);
                setLista(Array.isArray(data) ? data : []);
                setVirhe('');
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error(`${teksti}:`, err);
                setVirhe(err.message || teksti);
            }
        };

        await Promise.all([
            hae(
                api.tapahtumat.hae,
                setTapahtumat,
                setTapahtumatVirhe,
                'Tapahtumien haku epäonnistui'
            ),
            hae(
                api.jarjestajat.hae,
                setJarjestajat,
                setJarjestajatVirhe,
                'Järjestäjien haku epäonnistui'
            ),
        ]);
    }, []);

    useEffect(() => {
        const ac = new AbortController();
        lataaListat(ac.signal);
        return () => ac.abort();
    }, [lataaListat]);

    // Uudella järjestäjällä ei ole vielä tapahtumia
    const luodaanUusiTapahtuma =
        uusiTapahtuma || uusiJarjestaja;

    // Valitun järjestäjän tapahtumat
    const valittavatTapahtumat = jarjestajaId
        ? tapahtumat.filter(
            (t) =>
                String(tapahtumanJarjestajaId(t)) ===
                String(jarjestajaId)
        )
        : tapahtumat;

    const vaihdaJarjestaja = (id) => {
        setJarjestajaId(id);
        setTapahtumaId('');
    };

    // Esityskerrat
    const [esityskerrat, setEsityskerrat] = useState([]);

    const lisaaEsityskerta = () => {
        setEsityskerrat((nykyiset) => [
            ...nykyiset,
            {
                paikka: '',
                katuosoite: '',
                postinumero: '',
                postitoimipaikka: '',
                maxosallistujat: '',
                alkuaika: ''
            }
        ]);
    };

    const muutaEsityskertaa = (index, kentta, arvo) => {
        setEsityskerrat((nykyiset) =>
            nykyiset.map((esityskerta, i) =>
                i === index
                    ? { ...esityskerta, [kentta]: arvo }
                    : esityskerta
            )
        );
    };

    const poistaEsityskerta = (index) => {
        setEsityskerrat((nykyiset) =>
            nykyiset.filter((_, i) => i !== index)
        );
    };

    // Tallenna-painikkeen toiminnallisuus
    const kasitteleLahetys = async (e) => {
        e.preventDefault();

        if (tallennetaan) return;

        if (!luodaanUusiTapahtuma && !tapahtumaId) {
            setTallennusVirhe('Valitse tapahtuma tai luo uusi tapahtuma.');
            return;
        }

        if (esityskerrat.length === 0) {
            setTallennusVirhe('Lisää vähintään yksi esityskerta.');
            return;
        }

        const virheellinenEsityskerta = esityskerrat.find((e) => {
            if (!e.alkuaika || Number.isNaN(new Date(e.alkuaika).getTime())) {
                return true;
            }

            if (
                e.maxosallistujat !== '' &&
                (!Number.isInteger(Number(e.maxosallistujat)) ||
                    Number(e.maxosallistujat) < 1)
            ) {
                return true;
            }

            // Jos paikalle on annettu postinumero,
            // myös postitoimipaikka pitää antaa.
            if (
                e.postinumero.trim() &&
                !e.postitoimipaikka.trim()
            ) {
                return true;
            }

            return false;
        });

        if (virheellinenEsityskerta) {
            setTallennusVirhe(
                'Tarkista esityskertojen alkuaika, maksimiosallistujien määrä sekä postinumeron postitoimipaikka.'
            );
            return;
        }

        const tapahtuma = {
            tapahtuma: luodaanUusiTapahtuma
                ? { nimi: nimi.trim() }
                : { id: tapahtumaId },

            jarjestaja: uusiJarjestaja
                ? jarjestaja
                : jarjestajaId || null,

            esityskerrat: esityskerrat.map((e) => ({
                paikka: e.paikka.trim(),
                katuosoite: e.katuosoite.trim(),
                postinumero: e.postinumero.trim(),
                postitoimipaikka: e.postitoimipaikka.trim(),
                maxosallistujat: e.maxosallistujat,
                alkuaika: e.alkuaika
            }))
        };

        setTallennetaan(true);
        setTallennusVirhe('');

        try {
            await api.luoTapahtuma(tapahtuma);
        } catch (err) {
            console.error(
                'Tapahtuman tallennus epäonnistui:',
                err
            );

            setTallennusVirhe(
                err.message || 'Tapahtuman tallennus epäonnistui'
            );

            return;
        } finally {
            setTallennetaan(false);
        }

        if (onSubmit) {
            onSubmit(tapahtuma);
        }

        // Päivitetään valintalistat
        await lataaListat();

        // Lomakkeen tyhjennys
        setNimi('');
        setTapahtumaId('');
        setUusiTapahtuma(false);
        setJarjestajaId('');
        setUusiJarjestaja(false);
        setJarjestaja(TYHJA_JARJESTAJA);
        setEsityskerrat([]);
        setShowPopUp(true);
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto', my: 3 }}>

            <Typography variant="h5" gutterBottom>
                Lisää tapahtuma
            </Typography>

            <Box
                component="form"
                onSubmit={kasitteleLahetys}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}
            >

                {/* JÄRJESTÄJÄ */}

                <Typography variant="h6">
                    Järjestäjä
                </Typography>

                {!uusiJarjestaja ? (
                    <Stack spacing={2}>

                        <FormControl fullWidth>
                            <InputLabel>
                                Valitse järjestäjä
                            </InputLabel>

                            <Select
                                value={jarjestajaId}
                                label="Valitse järjestäjä"
                                onChange={(e) =>
                                    vaihdaJarjestaja(e.target.value)
                                }
                            >
                                <MenuItem value="">
                                    Ei järjestäjää
                                </MenuItem>

                                {jarjestajat.map((j) => (
                                    <MenuItem
                                        key={j.id}
                                        value={j.id}
                                    >
                                        {j.etunimi} {j.sukunimi}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {jarjestajatVirhe && (
                            <Typography
                                color="error"
                                sx={{ fontSize: '.85rem' }}
                            >
                                {jarjestajatVirhe}
                            </Typography>
                        )}

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setUusiJarjestaja(true);
                                vaihdaJarjestaja('');
                            }}
                        >
                            Luo uusi järjestäjä
                        </Button>

                    </Stack>
                ) : (
                    <Stack spacing={2}>

                        <Typography variant="subtitle1">
                            Uuden järjestäjän tiedot
                        </Typography>

                        <TextField
                            label="Etunimi"
                            value={jarjestaja.etunimi}
                            onChange={(e) =>
                                setJarjestaja({
                                    ...jarjestaja,
                                    etunimi: e.target.value
                                })
                            }
                            required
                            fullWidth
                        />

                        <TextField
                            label="Sukunimi"
                            value={jarjestaja.sukunimi}
                            onChange={(e) =>
                                setJarjestaja({
                                    ...jarjestaja,
                                    sukunimi: e.target.value
                                })
                            }
                            required
                            fullWidth
                        />

                        <TextField
                            label="Sähköposti"
                            type="email"
                            value={jarjestaja.sposti}
                            onChange={(e) =>
                                setJarjestaja({
                                    ...jarjestaja,
                                    sposti: e.target.value
                                })
                            }
                            required
                            fullWidth
                        />

                        <TextField
                            label="Puhelinnumero"
                            type="tel"
                            value={jarjestaja.puhelinnumero}
                            onChange={(e) =>
                                setJarjestaja({
                                    ...jarjestaja,
                                    puhelinnumero: e.target.value
                                })
                            }
                            required
                            fullWidth
                        />

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setUusiJarjestaja(false);
                                setJarjestaja(TYHJA_JARJESTAJA);
                            }}
                        >
                            Valitse olemassa oleva järjestäjä
                        </Button>

                    </Stack>
                )}

                <Divider />

                {/* TAPAHTUMA */}

                <Typography variant="h6">
                    Tapahtuma
                </Typography>

                {!luodaanUusiTapahtuma ? (
                    <Stack spacing={2}>

                        <FormControl fullWidth required>
                            <InputLabel>
                                Valitse tapahtuma
                            </InputLabel>

                            <Select
                                value={tapahtumaId}
                                label="Valitse tapahtuma"
                                onChange={(e) =>
                                    setTapahtumaId(e.target.value)
                                }
                            >
                                {valittavatTapahtumat.map((t) => (
                                    <MenuItem
                                        key={t.id}
                                        value={t.id}
                                    >
                                        {nimiTapahtumasta(t)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {jarjestajaId &&
                            valittavatTapahtumat.length === 0 && (
                                <Typography sx={{ fontSize: '.85rem' }}>
                                    Valitulla järjestäjällä ei ole vielä
                                    tapahtumia. Luo uusi tapahtuma.
                                </Typography>
                            )}

                        {tapahtumatVirhe && (
                            <Typography
                                color="error"
                                sx={{ fontSize: '.85rem' }}
                            >
                                {tapahtumatVirhe}
                            </Typography>
                        )}

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setUusiTapahtuma(true);
                                setTapahtumaId('');
                            }}
                        >
                            Luo uusi tapahtuma
                        </Button>

                    </Stack>
                ) : (
                    <Stack spacing={2}>

                        <TextField
                            required
                            fullWidth
                            label="Tapahtuman nimi"
                            value={nimi}
                            onChange={(e) =>
                                setNimi(e.target.value)
                            }
                        />

                        {!uusiJarjestaja && (
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setUusiTapahtuma(false);
                                    setNimi('');
                                }}
                            >
                                Valitse olemassa oleva tapahtuma
                            </Button>
                        )}

                    </Stack>
                )}

                <Divider />

                {/* ESITYSKERRAT */}

                <Typography variant="h6">
                    Esityskerrat
                </Typography>

                {esityskerrat.map((esityskerta, index) => (
                    <Paper
                        key={index}
                        variant="outlined"
                        sx={{ p: 2 }}
                    >

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >

                            <Typography variant="subtitle1">
                                Esityskerta {index + 1}
                            </Typography>

                            <IconButton
                                color="error"
                                onClick={() => poistaEsityskerta(index)}
                                aria-label="Poista esityskerta"
                            >
                                <DeleteIcon />
                            </IconButton>

                        </Stack>

                        <Stack spacing={2} sx={{ mt: 2 }}>

                            {/* PAIKAN NIMI */}

                            <TextField
                                label="Paikka"
                                value={esityskerta.paikka}
                                onChange={(e) =>
                                    muutaEsityskertaa(
                                        index,
                                        'paikka',
                                        e.target.value
                                    )
                                }
                                fullWidth
                            />

                            {/* KATUOSOITE */}

                            <TextField
                                label="Katuosoite"
                                value={esityskerta.katuosoite}
                                onChange={(e) =>
                                    muutaEsityskertaa(
                                        index,
                                        'katuosoite',
                                        e.target.value
                                    )
                                }
                                fullWidth
                            />

                            {/* POSTINUMERO */}

                            <TextField
                                label="Postinumero"
                                value={esityskerta.postinumero}
                                onChange={(e) =>
                                    muutaEsityskertaa(
                                        index,
                                        'postinumero',
                                        e.target.value
                                    )
                                }
                                inputProps={{ maxLength: 5 }}
                                fullWidth
                            />

                            {/* POSTITOIMIPAIKKA */}

                            <TextField
                                label="Postitoimipaikka"
                                value={esityskerta.postitoimipaikka}
                                onChange={(e) =>
                                    muutaEsityskertaa(
                                        index,
                                        'postitoimipaikka',
                                        e.target.value
                                    )
                                }
                                fullWidth
                            />

                            {/* MAKSIMIOSALLISTUJAT */}

                            <TextField
                                label="Maksimiosallistujat"
                                type="number"
                                value={esityskerta.maxosallistujat}
                                onChange={(e) =>
                                    muutaEsityskertaa(
                                        index,
                                        'maxosallistujat',
                                        e.target.value
                                    )
                                }
                                slotProps={{
                                    htmlInput: { min: 1 }
                                }}
                                fullWidth
                            />

                            {/* ALKUAika */}

                            <TextField
                                label="Alkuaika"
                                type="datetime-local"
                                value={esityskerta.alkuaika}
                                onChange={(e) =>
                                    muutaEsityskertaa(
                                        index,
                                        'alkuaika',
                                        e.target.value
                                    )
                                }
                                required
                                fullWidth
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: {
                                        min: paikallinenAikaKenttaan()
                                    }
                                }}
                            />

                        </Stack>
                    </Paper>
                ))}

                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={lisaaEsityskerta}
                >
                    Lisää esityskerta
                </Button>

                <Divider />

                {/* TALLENNUS */}

                <Button
                    type="submit"
                    variant="contained"
                    disabled={
                        tallennetaan ||
                        (luodaanUusiTapahtuma
                            ? !nimi.trim()
                            : !tapahtumaId) ||
                        esityskerrat.length === 0
                    }
                >
                    {tallennetaan
                        ? 'Tallennetaan...'
                        : 'Tallenna tapahtuma'}
                </Button>

                {tallennusVirhe && (
                    <Typography
                        color="error"
                        sx={{ fontSize: '.85rem' }}
                        role="alert"
                    >
                        {tallennusVirhe}
                    </Typography>
                )}

            </Box>

            <Popup
                showPopUp={showPopUp}
                setShowPopUp={setShowPopUp}
            />

        </Paper>
    );
};

export default Tapahtumalomake;
