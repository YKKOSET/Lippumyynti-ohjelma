
import { useState } from 'react';

import { Box, Paper, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Divider, IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from './Popup';

const Tapahtumalomake = ({ jarjestajat = [], onSubmit }) => {
    const [nimi, setNimi] = useState('');
    const [jarjestajaId, setJarjestajaId] = useState('');
    const [uusiJarjestaja, setUusiJarjestaja] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);

    const [jarjestaja, setJarjestaja] = useState({
        etunimi: '',
        sukunimi: '',
        sposti: '',
        puhelinnumero: ''
    });

    const [esityskerrat, setEsityskerrat] = useState([]);
    const lisaaEsityskerta = () => {
        setEsityskerrat([
            ...esityskerrat,
            {
                paikka: '',
                maxosallistujat: '',
                alkuaika: ''
            }
        ]);
    };

    const muutaEsityskertaa = (index, kentta, arvo) => {
        const uudetEsityskerrat = [...esityskerrat];
        uudetEsityskerrat[index][kentta] = arvo;
        setEsityskerrat(uudetEsityskerrat);
    };

    const poistaEsityskerta = (index) => {
        setEsityskerrat(
            esityskerrat.filter((_, i) => i !== index)
        );
    };

    // tallenna -painikkeen toiminnallisuus
    const kasitteleLahetys = (e) => {
        e.preventDefault();
        const tapahtuma = {
            nimi,
            jarjestaja: uusiJarjestaja
                ? jarjestaja
                : jarjestajaId || null,
            esityskerrat
        };
        // console.log('Lähetettävät tiedot:', tapahtuma);

        if (onSubmit) {
            onSubmit(tapahtuma);
        }

        // Lomakkeen tyhjennys
        setNimi('');
        setJarjestajaId('');
        setUusiJarjestaja(false);
        setJarjestaja({
            etunimi: '',
            sukunimi: '',
            sposti: '',
            puhelinnumero: ''
        });
        setEsityskerrat([]);
        setShowPopUp(true)

    };


    return (
        <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto', my: 3 }}>
            <Typography variant="h5" gutterBottom>Lisää tapahtuma</Typography>

            // Lomake alkaa
            <Box component="form" onSubmit={kasitteleLahetys} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField required fullWidth label="Tapahtuman nimi" value={nimi} onChange={(e) => setNimi(e.target.value)}/>
                
                <Divider />

                <Typography variant="h6">Järjestäjä</Typography>

                {!uusiJarjestaja ? (
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel>Valitse järjestäjä</InputLabel>
                            <Select value={jarjestajaId} label="Valitse järjestäjä" onChange={(e) => setJarjestajaId(e.target.value)}>
                                <MenuItem value="">Ei järjestäjää</MenuItem>
                                {jarjestajat.map((j) => (
                                    <MenuItem key={j.id} value={j.id}>
                                        {j.etunimi} {j.sukunimi}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button variant="outlined" onClick={() => {
                            setUusiJarjestaja(true);
                            setJarjestajaId('');
                        }}>
                            Luo uusi järjestäjä
                        </Button>

                    </Stack>
                ) : (
                    <Stack spacing={2}>

                        <Typography variant="subtitle1">
                            Uuden järjestäjän tiedot
                        </Typography>

                        <TextField label="Etunimi" value={jarjestaja.etunimi}
                            onChange={(e) => setJarjestaja({
                                ...jarjestaja,
                                etunimi: e.target.value
                            })}
                            required fullWidth />

                        <TextField label="Sukunimi" value={jarjestaja.sukunimi}
                            onChange={(e) => setJarjestaja({
                                ...jarjestaja,
                                sukunimi: e.target.value
                            })}
                            required fullWidth />

                        <TextField label="Sähköposti" type="email" value={jarjestaja.sposti}
                            onChange={(e) => setJarjestaja({
                                ...jarjestaja,
                                sposti: e.target.value
                            })} required fullWidth />

                        <TextField label="Puhelinnumero" type="tel" value={jarjestaja.puhelinnumero}
                            onChange={(e) => setJarjestaja({
                                ...jarjestaja,
                                puhelinnumero: e.target.value
                            })}
                            required fullWidth />

                        <Button variant="outlined" onClick={() => {
                            setUusiJarjestaja(false);
                            setJarjestaja({
                                etunimi: '',
                                sukunimi: '',
                                sposti: '',
                                puhelinnumero: ''
                            });
                        }}>Valitse olemassa oleva järjestäjä</Button>
                    </Stack>
                )}
                <Divider />

                <Typography variant="h6">
                    Esityskerrat
                </Typography>

                {esityskerrat.map((esityskerta, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                        <Stack direction="row" justifycontent="space-between" alignitems="center">
                           
                            <Typography variant="subtitle1">Esityskerta {index + 1}</Typography>

                            <IconButton color="error" onClick={() => poistaEsityskerta(index)} aria-label="Poista esityskerta">
                                <DeleteIcon />
                            </IconButton>
                        </Stack>

                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField
                                label="Paikka" value={esityskerta.paikka}
                                onChange={(e) => muutaEsityskertaa(
                                    index,
                                    'paikka',
                                    e.target.value
                                )}
                                fullWidth />

                            <TextField label="Maksimiosallistujat" type="number" value={esityskerta.maxosallistujat}
                                onChange={(e) => muutaEsityskertaa(
                                    index,
                                    'maxosallistujat',
                                    e.target.value
                                )} slotProps={{htmlInput: { min: 1 }}} fullWidth/>

                            <TextField label="Alkuaika" type="datetime-local" value={esityskerta.alkuaika}
                                onChange={(e) => muutaEsityskertaa(
                                    index,
                                    'alkuaika',
                                    e.target.value
                                )}
                                required fullWidth
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: {
                                        min: new Date().toISOString().slice(0, 16)
                                    }
                                }}
                            />
                        </Stack>
                    </Paper>
                ))}

                <Button variant="outlined" startIcon={<AddIcon />} onClick={lisaaEsityskerta}>
                    Lisää esityskerta
                </Button>
                
                <Divider />

                <Button type="submit" variant="contained" disabled={!nimi.trim() || esityskerrat.length === 0}>
                    Tallenna tapahtuma
                </Button>
            </Box>

            <Popup showPopUp={showPopUp} setShowPopUp={setShowPopUp}/>
        </Paper>
    );
};

export default Tapahtumalomake;