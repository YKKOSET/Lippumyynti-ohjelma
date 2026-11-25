import { useState } from 'react';
import { useNavigate } from 'react-router';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Collapse } from '@mui/material';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


function Tapahtumakortti({ tapahtuma }) {

    const [auki, setAuki] = useState(false);
    const navigate = useNavigate();

    const avaaKortti = async () => {
        setAuki(!auki);
    };


    return (
        <Card>
            <CardActionArea onClick={avaaKortti}>
                <CardContent>

                    {/*Heti näkyvät tiedot*/}
                    <Typography variant="h5">{tapahtuma.nimi}</Typography>

                    <Typography variant="caption" color="secondary" sx={{ display: 'block', mt: 2, opacity: '0.5' }}>
                        {auki ? 'Näytä vähemmän ▲' : 'Näytä lisää ▼'}
                    </Typography>

                </CardContent>
            </CardActionArea>

            {/*Lisätiedot alkaa*/}
            <Collapse in={auki}>
                <CardContent>

                    <Typography variant="h6" sx={{ mt: 2 }}>Järjestäjä:</Typography>
                    <Typography>{tapahtuma.jarjestaja?.etunimi}{' '}{tapahtuma.jarjestaja?.sukunimi}</Typography>
                    <Typography>{tapahtuma.jarjestaja?.sahkoposti}</Typography>


                    <Typography variant="h6" sx={{ mt: 2 }}>Esityskerrat({tapahtuma.esityskerrat?.length ?? 0}):</Typography>
                    {tapahtuma.esityskerrat?.map((esitys) => (
                        <Box key={esitys.id}>
                            <Typography>..</Typography>
                            <Typography>{new Date(esitys.alkuaika).toLocaleString('fi-FI', {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</Typography>
                            <Typography>{esitys.paikka?.nimi}</Typography>
                            <Typography>{esitys.paikka?.katuosoite}</Typography>
                            <Typography>{esitys.paikka?.postinumero?.postinumero}{' '}{esitys.paikka?.postinumero?.postitoimipaikka}</Typography>

                            <Typography>Max.{esitys.maxOsallistujat}{' '}hlöä</Typography>
                        </Box>
                    ))}

                    {(!tapahtuma.esityskerrat || tapahtuma.esityskerrat.length === 0) && (
                        <Typography>Ei tulevia esityskertoja.</Typography>
                    )}


                    <Button variant="contained" color="secondary" onClick={() => {
                        navigate("/myynti", {
                            state: { tapahtuma: tapahtuma }
                        });
                    }}>Myy lippuja</Button>

                </CardContent>
            </Collapse>
        </Card>

    );
}

export default Tapahtumakortti;