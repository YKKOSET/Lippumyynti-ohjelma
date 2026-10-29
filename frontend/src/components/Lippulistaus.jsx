
function Lippulistaus({lippu}) {
        return (
            <>
            ID: {lippu.id} <br />
            Hinta: {lippu.hinta} € <br />
            Koodi: {lippu.koodi} <br />
            Käytetty: {lippu.kaytetty ? "Kyllä" : "Ei"} <br />
            <br />
            </>
    );

}

export default Lippulistaus;