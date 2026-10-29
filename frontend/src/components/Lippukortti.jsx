import Lippulistaus from './lippulistaus';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';


function Lippukortti( {lippu} ) {
    return (
            <Card sx={{ width: 250 }}>
                <CardHeader  />

                <CardContent>

                </CardContent>

                <CardActions sx={{ display: 'flex', justifyContent: 'right' }}>
                    {/* Tänne radiobuttonit */}
                </CardActions>

            </Card>
        );

}

export default Lippukortti;