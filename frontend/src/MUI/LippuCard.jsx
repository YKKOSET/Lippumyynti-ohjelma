import Lippulistaus from '../components/lippulistaus';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';

//TÄMÄ LIPPUCARD TALLENTAA MEIDÄN _OMAN_ APPLIKAATION LIPUN KÄYTETYKSI/KÄYTTÄMÄTTÖMÄKSI.

function LippuCard({ /*lippu*/ }) {

    //tästä otetaan sarjanumero ja false pois sitten, kun lippu voidaan tuoda propsina (fetch: haetaan renderistä ulkoisena datana, erillinen hakukomponentti)    
    const [lippu, setValues] = useState({
        id: '5bc04a8b-c2ee-4337-95f8-ac9846fe3151',
        kaytetty: false,
    });

    const [kaytetty, setKaytetty] = useState(lippu.kaytetty);

    const tallenna = async () => {

        const url = kaytetty
            ? `https://lippumyynti-ohjelma.onrender.com/api/liput/${lippu.id}/kaytetty`
            : `https://lippumyynti-ohjelma.onrender.com/api/liput/${lippu.id}/kayttamaton`;

        await fetch(url, {
            method: "PATCH",
            headers: {
                'Authorization': 'Basic ' + btoa('ADMIN:ADMIN'),
            },
        });
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
                            Sarjanumero: {lippu.id}
                        </Typography>
                        <Typography>

                        </Typography>
                        <Typography>

                        </Typography>
                        <Typography>

                        </Typography>


                        <FormControl>
                            <FormLabel>Lipun tila:</FormLabel>
                            <RadioGroup row name='kaytetty' value={String(kaytetty)} onChange={(e) => setKaytetty(e.target.value === "true")} >
                                <FormControlLabel value="true" control={<Radio />} label="Käytetty" />
                                <FormControlLabel value="false" control={<Radio />} label="Käyttämätön" />
                            </RadioGroup>
                        </FormControl>

                    </Box>

                    <Button onClick={tallenna} variant='contained'>Tallenna</Button>

                </CardContent>
            </Card>
        </Box>

    );
}

export default LippuCard;