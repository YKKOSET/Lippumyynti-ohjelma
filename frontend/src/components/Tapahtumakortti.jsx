import { useState } from 'react';
import { useNavigate } from 'react-router';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Collapse } from '@mui/material';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

//alkamisaika vaihdettava järjelliseen muotoon
//lisää varjoa yms. kortin ulkoreunoille
//vie muotoilut ja värit App
//tarkista automaatiotestit löytääkö kortit edelleen

function Tapahtumakortti({ tapahtuma }) {

    const [auki, setAuki] = useState(false);
    const navigate = useNavigate();

    const avaaKortti = async () => {
        setAuki(!auki);
    };


    return (
        <Card sx={{ maxWidth: 200 }} >
            <CardActionArea onClick={avaaKortti}>
                <CardContent>

                    {/*Heti näkyvät tiedot*/}
                    <Typography variant="h5">{tapahtuma.nimi}</Typography>


                    {/*Lisätiedot alkaa*/}
                    <Collapse in={auki}>

                        <Typography variant="h6" sx={{ mt: 2 }}>Järjestäjä:</Typography>
                        <Typography>{tapahtuma.jarjestaja?.etunimi}{' '}{tapahtuma.jarjestaja?.sukunimi}</Typography>
                        <Typography>{tapahtuma.jarjestaja?.sahkoposti}</Typography>


                        <Typography variant="h6" sx={{ mt: 2 }}>Esityskerrat({tapahtuma.esityskerrat?.length ?? 0}):</Typography>
                        {tapahtuma.esityskerrat?.map((esitys) => (
                            <Box key={esitys.id}>
                                <Typography>..</Typography>
                                <Typography>{esitys.alkuaika}</Typography>
                                <Typography>{esitys.paikka?.nimi}</Typography>
                                <Typography>{esitys.paikka?.katuosoite}</Typography>
                                <Typography>{esitys.paikka?.postinumero?.postinumero}{' '}{esitys.paikka?.postinumero?.postitoimipaikka}</Typography>

                                <Typography>Max.{esitys.maxOsallistujat}{' '}hlöä</Typography>
                            </Box>
                        ))}

                        {(!tapahtuma.esityskerrat || tapahtuma.esityskerrat.length === 0) && (
                            <Typography>Ei tulevia esityskertoja.</Typography>
                        )}


                        <Button onClick={() => navigate("/myynti", {
                            state: { tapahtuma: tapahtuma }
                        })} sx={{
                            mt: 2,
                            backgroundColor: 'secondary.main',
                            color: 'secondary.contrastText',
                            borderRadius: 2,
                            padding: '3px 16px',
                            color: 'secondary.contrastText',
                            '&:hover': {
                                backgroundColor: 'secondary.dark',
                            },
                        }}>Myy lippuja</Button>

                    </Collapse>

                    <Typography variant="caption" color="secondary" sx={{ display: 'block', mt: 2, opacity: '0.5' }}
                    >
                        {auki ? 'Näytä vähemmän ▲' : 'Näytä lisää ▼'}
                    </Typography>


                </CardContent>
            </CardActionArea>
        </Card>

    );
}

export default Tapahtumakortti;