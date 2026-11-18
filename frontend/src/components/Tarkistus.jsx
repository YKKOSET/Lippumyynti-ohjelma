import { useState } from 'react';

import Hakupalkki from './Hakupalkki';
import { Typography } from '@mui/material';
import LippuCard from '../MUI/LippuCard';


function Tarkistus() {

     const [haettuLippu, setHaettuLippu] = useState(null);


    return (
        <>

            <Typography sx={{ textAlign: "left", ml: 3, mt: 2 }}>Hae lippu sarjanumerolla:</Typography>
            <Hakupalkki onLoytyi={setHaettuLippu} />
            {haettuLippu && <LippuCard lippu={haettuLippu} />}

        </>
    );

}

export default Tarkistus;