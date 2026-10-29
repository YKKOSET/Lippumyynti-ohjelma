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
const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

//TÄMÄ LIPPUCARD TALLENTAA MEIDÄN _OMAN_ APPLIKAATION LIPUN KÄYTETYKSI/KÄYTTÄMÄTTÖMÄKSI.

function LippuCard({ /*lippu*/ }) {

    //tästä otetaan kovakoodattu data pois sitten, kun lippu voidaan tuoda propsina (fetch: haetaan renderistä ulkoisena datana, erillinen hakukomponentti)    
    const [lippu, setValues] = useState({
        id: '5bc04a8b-c2ee-4337-95f8-ac9846fe3151',
        esityskerta: {
            alkuaika: '2028-10-01T19:00:00.000Z',
        },
        lipputyyppi: {
            id_: 1,
            nimi_: 'Lastenlippu',
        },
        hinta: 10,
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
                'Authorization': 'Basic ' + btoa(`${username}:${password}`),
            },
        });
    };

    return (


        <Box sx={{ ml: 3 }}>
            <Card sx={{ width: 500, border: "1px solid #ccc", borderRadius: 2 }}>
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "stretch",
                        gap: 4,
                        textAlign: "left",
                    }}>

                    <Box>
                        <Typography>
                            Sarjanumero:
                        </Typography>
                        <Typography>
                            {lippu.id}
                        </Typography>
                        <Typography>
                            Esitysaika: {lippu.esityskerta.alkuaika}
                        </Typography>
                        <Typography>
                            Lipputyyppi: {lippu.lipputyyppi.nimi_}
                        </Typography>
                        <Typography sx={{ mb: 2 }}>
                            Hinta: {lippu.hinta} €
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