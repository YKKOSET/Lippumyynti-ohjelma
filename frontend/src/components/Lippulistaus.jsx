
function Lippulistaus({lippu}) {
        return (
            <>
            ID: {lippu.id} <br />
            Hinta: {lippu.hinta} <br />
            Lipputyyppi: {lippu.lipputyyppi.nimi} <br />
            Kaytetty: {lippu.kaytetty} <br />
            <br />
            </>
    );

}

export default Lippulistaus;