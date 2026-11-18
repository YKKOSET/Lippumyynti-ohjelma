import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


function Tapahtumakortti({ tapahtuma }) {

return(
        <Card sx={{maxWidth: 200}}>

            <CardContent>

                <Typography>
                    {tapahtuma.nimi}
                </Typography>

                <Typography>
                    Järjestäjä
                </Typography>

                <Typography>
                    {tapahtuma.jarjestaja?.etunimi}{' '}
                    {tapahtuma.jarjestaja?.sukunimi}
                </Typography>

                <Typography>
                    {tapahtuma.jarjestaja?.sahkoposti}
                </Typography>

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
        </Card>

);
}

export default Tapahtumakortti;