
import { useLocation } from 'react-router';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function YksittainenTapahtuma() {

    const location = useLocation();

    const tapahtuma = location.state?.tapahtuma;

    // Tarkistetaan, löytyykö tapahtuman tiedot
    if (!tapahtuma) {
        return (
            <Typography> Tapahtuman tietoja ei löytynyt. </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>{tapahtuma.nimi}</Typography>
                <Typography variant="h6" sx={{ mt: 3 }}>Järjestäjä</Typography>
                <Typography>
                    {tapahtuma.jarjestaja?.etunimi}{' '}
                    {tapahtuma.jarjestaja?.sukunimi}
                </Typography>
                <Typography>
                    {tapahtuma.jarjestaja?.sahkoposti}
                </Typography>

                <Typography variant="h6" sx={{ mt: 3 }}>
                    Esityskerrat ({tapahtuma.esityskerrat?.length ?? 0})
                </Typography>

                {tapahtuma.esityskerrat?.map((esitys) => (
                    <Paper key={esitys.id} variant="outlined" sx={{ p: 2, mt: 2 }}>
                        <Typography>{esitys.alkuaika}</Typography>
                        <Typography>{esitys.paikka?.nimi}</Typography>
                        <Typography>{esitys.paikka?.katuosoite}</Typography>
                        <Typography>{esitys.paikka?.postinumero?.postinumero}</Typography>
                        <Typography> Enimmäisosallistujat: {esitys.maxOsallistujat}</Typography>
                    </Paper>
                ))}

                {(!tapahtuma.esityskerrat ||
                    tapahtuma.esityskerrat.length === 0) && (
                    <Typography sx={{ mt: 2 }}>Ei tulevia esityskertoja.</Typography>
                )}
            </Paper>
        </Box>
    );
}

export default YksittainenTapahtuma;
