import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';

function LippuCard() {


    const [lippu, setValues] = useState({
        tarknro_id: '',
        esitys_id: '',
        tyyppi_id: '',
        hinta: '',
        kaytetty: '',
    });

    const [viesti, setViesti] = useState('');
    const [virhe, setVirhe] = useState('');

    const muuta = (e) => {
        setValues({
            ...lippu,
            [e.target.name]: e.target.value
        });
        setViesti(''); //viesti poistuu kun kirjoittaa
        setVirhe(''); //virheviesti poistuu kun kirjoittaa
    };

    return (


        <Box>
            <Card>
                <CardContent
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>

                    <Box>
                        <Typography>
                            tarknro_id
                        </Typography>
                        <Typography>
                            esitys_id
                        </Typography>
                        <Typography>
                            tyyppi_id
                        </Typography>
                        <Typography>
                            hinta
                        </Typography>


                        <FormControl>
                            <FormLabel>Käytetty:</FormLabel>
                            <RadioGroup row name='kaytetty' value={lippu.kaytetty} onChange={(e) => muuta(e)} >
                                <FormControlLabel value="Käytetty" control={<Radio />} label="Käytetty" />
                                <FormControlLabel value="Käyttämätön" control={<Radio />} label="Käyttämätön" />
                            </RadioGroup>
                        </FormControl>

                    </Box>

                    <Button onClick={() => muuta()} variant='contained' startIcon={<CreateIcon />} required fullWidth>Tallenna</Button>

                    <Button variant="contained">Muokkaa</Button>

                </CardContent>
            </Card>
            <Typography>{viesti}</Typography>
            <Typography>{virhe}</Typography>
        </Box>

    );
}

export default LippuCard;