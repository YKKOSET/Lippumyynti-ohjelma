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


function LippuCard({ /*lippu*/ }) {

    //tämä poistetaan sitten, kun lippu voidaan hakea propsina:    
    const [lippu, setValues] = useState({
        tarknro_id: '1',
        esitys_id: '2',
        tyyppi_id: '3',
        hinta: '40€',
        kaytetty: false,
    });
    

    const [kaytetty, setKaytetty] = useState(lippu.kaytetty);

    const tallenna = async () => {

        const url = kaytetty
            ? `/api/liput/${lippu.tarknro_id}/kaytetty`
            : `/api/liput/${lippu.tarknro_id}/kayttamaton`;

        await fetch(url, {
            method: "PATCH"
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
                            tarknro_id: {lippu.tarknro_id}
                        </Typography>
                        <Typography>
                            esitys_id: {lippu.esitys_id}
                        </Typography>
                        <Typography>
                            tyyppi_id: {lippu.tyyppi_id}
                        </Typography>
                        <Typography>
                            hinta: {lippu.hinta}
                        </Typography>


                        <FormControl>
                            <FormLabel>Käytetty:</FormLabel>
                            <RadioGroup row name='kaytetty' value={String(kaytetty)} onChange={(e) => setKaytetty(e.target.value === "true")} >
                                <FormControlLabel value="true" control={<Radio />} label="Käytetty" />
                                <FormControlLabel value="false" control={<Radio />} label="Käyttämätön" />
                            </RadioGroup>
                        </FormControl>

                   </Box>

                    <Button onClick={() => tallenna()} variant='contained'>Tallenna</Button>

                </CardContent>
            </Card>
        </Box>

    );
}

export default LippuCard;