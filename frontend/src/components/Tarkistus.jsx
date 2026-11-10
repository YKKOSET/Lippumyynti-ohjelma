import { useState } from 'react';

import Hakupalkki from './Hakupalkki';

import { Typography } from '@mui/material';

//Tämän tilalla pitäisi näkyä lipun tarkistus eli onko hakupalkki.jsx ? 

function Tarkistus() {

     const [haettuLippu, setHaettuLippu] = useState(null);




    return (
        <>

            <Typography sx={{ textAlign: "left", ml: 3, mt: 2 }}>Hae lippu sarjanumerolla:</Typography>
            <Hakupalkki onLoytyi={setHaettuLippu} />
            {haettuLippu && <LippuCard lippu={haettuLippu} />}

            <Hakupalkki/>

        </>
    );

}

export default Tarkistus;