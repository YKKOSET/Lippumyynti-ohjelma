import { useState } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { useNavigate } from 'react-router';
import { Button } from '@mui/material';

function Tapahtumakortti({ tapahtuma }) {

    const navigate = useNavigate();

    return (
        <>
            <Card sx={{ maxWidth: 200 }}>
                <CardActionArea
                    onClick={() => navigate(`/tapahtumat/${tapahtuma.id}`)}
                >
                    <CardContent>

                        <Typography>
                            {tapahtuma.nimi} <br/>
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                            <Typography fontWeight="bold">
                                Järjestäjä:
                            </Typography>

                            <Typography>
                                {tapahtuma.jarjestaja?.etunimi}{' '}
                                {tapahtuma.jarjestaja?.sukunimi}
                            </Typography>
                        </Box>

                        <Typography>
                            Esityskerrat ({tapahtuma.esityskerrat?.length ?? 0})
                        </Typography>

                        {tapahtuma.esityskerrat?.map((esitys) => (
                            <Box key={esitys.id}>

                                <Typography>
                                    {esitys.alkuaika}
                                </Typography>

                                <Typography>
                                    {esitys.paikka?.nimi}
                                </Typography>

                                <Typography>
                                    {esitys.paikka?.katuosoite}
                                </Typography>

                                <Typography>
                                    {esitys.paikka?.postinumero?.postinumero}{' '}
                                </Typography>

                                <Typography>
                                    Enimmäisosallistujat: {esitys.maxOsallistujat}
                                </Typography>
                            </Box>
                        ))}

                        {(!tapahtuma.esityskerrat ||
                            tapahtuma.esityskerrat.length === 0) && (
                                <Typography>
                                    Ei tulevia esityskertoja.
                                </Typography>
                            )}
                    </CardContent>
                </CardActionArea>
                <CardContent>
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
                </CardContent >
            </Card >
        </>
    );

}

export default Tapahtumakortti;