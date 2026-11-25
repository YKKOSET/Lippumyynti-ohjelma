import { useOutletContext } from 'react-router';

import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// ---------------------------------------------------------------
// OSOITE: vaihda omaksi
// ---------------------------------------------------------------
const API_BASE = 'http://localhost:8080/api';

// Esityskerran liput: {tapahtumaId}/{esityskertaId}/liput (muuta alkuosa tarvittaessa)
const lippuUrl = (tapahtumaId, esityskertaId) =>
    `${API_BASE}/tapahtumat/${tapahtumaId}/${esityskertaId}/liput`;

// Lipun merkitseminen ostetuksi: /{id}/ostettu (muuta alkuosa ja metodi tarvittaessa)
const ostettuUrl = (lippuId) => `${API_BASE}/liput/${lippuId}/ostettu`;
// Palautus vaatii vastaavan PATCH-reitin palvelimelle.
const ostamatonUrl = (lippuId) => `${API_BASE}/liput/${lippuId}/ostamaton`;
const OSTETTU_METODI = 'PATCH';

// Basic-tunnistautuminen (poista, jos API ei vaadi sitä)
const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

// Muodostaa Basic-tunnistautumisen myös ääkkösiä sisältäville tunnuksille.
const basicAuth = () => {
    const tunnukset = `${username ?? ''}:${password ?? ''}`;
    const tavut = new TextEncoder().encode(tunnukset);
    let binaari = '';
    tavut.forEach((tavu) => { binaari += String.fromCharCode(tavu); });
    return `Basic ${btoa(binaari)}`;
};


// Hakee osoitteen ja palauttaa aina taulukon
const haeJson = async (url, signal) => {
    const res = await fetch(url, {
        signal,
        headers: { 'Authorization': basicAuth() },
    });
    if (!res.ok) throw new Error(`Haku epäonnistui (${url}): ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

// Merkitsee lipun ostetuksi tietokantaan. Sama API-reitti ja PUT-metodi kuin aiemmin.
// Lukee myös palvelimen virhevastauksen, jotta syy näkyy kehittäjäkonsolissa.
const merkitseOstetuksi = async (lippuId) => {
    const url = ostettuUrl(lippuId);
    const res = await fetch(url, {
        method: OSTETTU_METODI,
        headers: { 'Authorization': basicAuth() },
    });

    const vastaus = await res.text();
    if (!res.ok) {
        throw new Error(`Lipun ${lippuId} merkitseminen epäonnistui (${res.status}): ${vastaus || res.statusText}`);
    }
    return true;
};

// Kysyy backendiltä, riittääkö esityskerralla vapaita paikkoja haluttuun määrään.
// Palauttaa { saatavilla: boolean, jaljella: number, viesti: string }.
const tarkistaSaatavuus = async (esityskertaId, maara) => {
    const res = await fetch(
        `${API_BASE}/liput/saatavuus?esityskertaId=${esityskertaId}&maara=${maara}`,
        { headers: { 'Authorization': basicAuth() } }
    );
    if (!res.ok) throw new Error(`Saatavuuden tarkistus epäonnistui (${res.status})`);
    return res.json();
};

// ---------------------------------------------------------------
// ODOTETTU DATA
// props.tapahtumat: [{ id, nimi, esityskerrat: [{ id, alkuaika, maxOsallistujat, paikka: { nimi } }] }]
// Liput haetaan tässä tiedostossa jokaiselle esityskerralle erikseen
// (/liput-vastauksen lipuissa ei ole tietoa esityskerrasta).
//
// Jäljellä-tieto näytetään vain esityskerran otsikkorivillä (ei lippukorteissa) eikä se rajoita myyntiä:
//   jäljellä = esityskerran maxOsallistujat - ostetut liput (ostettu === true)
// ---------------------------------------------------------------

// Enimmäisosallistujamäärä numerona (null = ei tietoa)
const haeMaksimi = (esityskerta) => {
    const arvo = esityskerta?.maxOsallistujat;
    if (arvo === null || arvo === undefined || arvo === '') return null;
    const luku = Number(arvo);
    return Number.isFinite(luku) ? luku : null;
};

// Jo ostetut liput esityskerralla
const ostetutMaara = (esityksenLiput) => esityksenLiput.filter((l) => l.ostettu).length;

const euro = (n) => `${n.toFixed(2).replace('.', ',')} €`;

const muotoileAika = (alkuaika) =>
    alkuaika
        ? new Date(alkuaika).toLocaleString('fi-FI', {
              weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit',
          })
        : '';

// Osto- ja ostorivitietojen nimet voivat vaihdella Java-mallien mukaan.
// Tunnistetaan yleisimmät kenttänimet, jotta GET /api/ostot -vastaus voidaan näyttää.
const ensimmainenArvo = (obj, nimet) => {
    for (const nimi of nimet) {
        const arvo = obj?.[nimi];
        if (arvo !== undefined && arvo !== null && arvo !== '') return arvo;
    }
    return null;
};

const ostonAikaleima = (osto) => ensimmainenArvo(osto, [
    'ostoaika', 'ostoAika', 'aikaleima', 'createdAt', 'created_at',
    'pvm', 'paivamaara', 'päivämäärä', 'date', 'timestamp'
]);

const ostonRivit = (osto) => {
    const rivit = ensimmainenArvo(osto, ['ostorivit', 'ostoRivit', 'rivit', 'liput', 'tickets', 'items']);
    if (Array.isArray(rivit)) return rivit;
    // Jos Osto-mallissa on vain yksi suora lippuviite.
    const lippu = ensimmainenArvo(osto, ['lippu', 'ticket']);
    return lippu ? [{ lippu }] : [];
};

const rivinLippu = (rivi) => ensimmainenArvo(rivi, ['lippu', 'ticket']) ?? rivi;
const rivinLippuId = (rivi) => {
    const lippu = rivinLippu(rivi);
    return ensimmainenArvo(lippu, ['id', 'lippuId', 'lippu_id', 'sarjanumero']) ??
        ensimmainenArvo(rivi, ['lippuId', 'lippu_id', 'ticketId']);
};

const muotoileOstoAika = (arvo) => {
    if (arvo === null || arvo === undefined || arvo === '') return 'Ajankohta ei ole saatavilla';
    const pvm = typeof arvo === 'number' ? new Date(arvo) : new Date(arvo);
    if (Number.isNaN(pvm.getTime())) return String(arvo);
    return pvm.toLocaleString('fi-FI', {
        day: 'numeric', month: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
};

// ---------------------------------------------------------------
// YKSI MYYNTIKORTTI
// tila: 'vapaa' | 'listalla' | 'myyty'
// Jokaisella lipulla on oma sarjanumero, joten lippuja käsitellään yksi kerrallaan
// ---------------------------------------------------------------
function MyyntiKortti({ lippu, nimi, esityskerta, tila, onLisaa, onPoista }) {
    const lipputyyppi = lippu.lipputyyppi?.nimi ?? lippu.lipputyyppi?.nimi_ ?? '';
    const myyty = tila === 'myyty';
    const listalla = tila === 'listalla';

    return (
        <Box sx={tyylit.korttiUlko}>
            <Card elevation={0} sx={tyylit.kortti}>
                {/* Vasen osa */}
                <Box sx={[tyylit.runko, myyty && tyylit.loppuunmyyty]}>
                    <Typography component="time" sx={tyylit.aika}>
                        {muotoileAika(esityskerta?.alkuaika)}
                    </Typography>
                    <Typography sx={tyylit.tapahtumaNimi}>{nimi}</Typography>
                    <Typography sx={tyylit.tyyppi}>{lipputyyppi}</Typography>
                    <Typography sx={tyylit.sarjanumero}>Sarjanumero: {lippu.id}</Typography>
                </Box>

                {/* Oikea osa */}
                <Box sx={tyylit.kanta}>
                    <Typography sx={tyylit.hinta}>{euro(lippu.hinta)}</Typography>

                    {listalla ? (
                        <Button variant="outlined" disableElevation sx={tyylit.poistaNappi} onClick={onPoista}>
                            Poista listalta
                        </Button>
                    ) : (
                        <Button variant="contained" disableElevation sx={tyylit.myyNappi} onClick={onLisaa} disabled={myyty}>
                            {myyty ? 'Myyty' : 'Myy lippu'}
                        </Button>
                    )}

                    <Typography sx={tyylit.viesti} role="status">
                        {listalla ? 'Lisätty myyntilistaan' : ''}
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}

// Tapahtuman nimi eri muodoista
const nimiTapahtumasta = (t) => t?.nimi ?? t?.nimi_ ?? t?.name ?? null;

// ---------------------------------------------------------------
// KAIKKI TAPAHTUMAT: jokainen esityskerta omana ryhmänään,
// otsikkona tapahtuman nimi. Tapahtumat tulevat propsina,
// liput haetaan jokaiselle esityskerralle omalla pyynnöllä.
//
// Myynti: "Myy lippu" lisää lipun myyntilistaan.
// "Suorita maksu" merkitsee liput ostetuiksi ja luo niistä yhden ostotapahtuman.
// ---------------------------------------------------------------
function TicketSales({ onMaksu }) {

    //vastaanottaa menuvalikon kautta tiedot
    const {
        tapahtumat = [],
        lataa = false,
        virhe = '',
        navigoituTapahtuma = null
    } = useOutletContext();


    const [haetutLiput, setHaetutLiput] = useState({}); // { 'tapahtumaId-esityskertaId': [liput] }
    const [lataaLiput, setLataaLiput] = useState(false);
    const [liputVirhe, setLiputVirhe] = useState('');

    const [valitut, setValitut] = useState([]);   // myyntilista, ei vielä maksettu
    const [maksuViesti, setMaksuViesti] = useState('');
    const [maksuVirhe, setMaksuVirhe] = useState('');
    const [kasitellaan, setKasitellaan] = useState(false); // maksu käynnissä
    const [palautetaan, setPalautetaan] = useState(false); // lippujen palautus käynnissä

    // Ostohistoria-popup
    const [listaAuki, setListaAuki] = useState(false);
    const [ostot, setOstot] = useState([]);
    const [lataaOstoja, setLataaOstoja] = useState(false);
    const [ostotVirhe, setOstotVirhe] = useState('');

    // Haku: tyhjä valinta = kaikki
    const [valittuTapahtuma, setValittuTapahtuma] = useState(''); // tapahtuman id
    const [valittuEsitys, setValittuEsitys] = useState('');       // ryhmän avain (tapahtumaId-esityskertaId)

    //aseta pudotusvalikkoon navigoinnin mukana tulleen tapahtuman tiedot
    useEffect(() => {
    if (!navigoituTapahtuma?.id) return;

    setValittuTapahtuma(String(navigoituTapahtuma.id));
    setValittuEsitys('');
}, [navigoituTapahtuma?.id]);

    // Haetaan liput jokaiselle esityskerralle
    useEffect(() => {
        if (tapahtumat.length === 0) return;
        const ac = new AbortController();

        const haeKaikki = async () => {
            setLataaLiput(true);
            setLiputVirhe('');
            let epaonnistui = 0;
            try {
                const parit = await Promise.all(
                    tapahtumat.flatMap((t) =>
                        (t.esityskerrat ?? []).map(async (e) => {
                            const avain = `${t.id}-${e.id}`;
                            try {
                                return [avain, await haeJson(lippuUrl(t.id, e.id), ac.signal)];
                            } catch (err) {
                                if (err.name === 'AbortError') throw err;
                                epaonnistui += 1;
                                console.warn('Lippujen haku epäonnistui:', avain, err);
                                return [avain, []];
                            }
                        })
                    )
                );
                setHaetutLiput(Object.fromEntries(parit));
                if (epaonnistui > 0) {
                    setLiputVirhe(`Lippuja ei saatu haettua ${epaonnistui} esityskerralle (tarkista osoite).`);
                }
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error('Lippujen haku epäonnistui:', err);
                setLiputVirhe('Lippujen haku epäonnistui');
            } finally {
                if (!ac.signal.aborted) setLataaLiput(false);
            }
        };

        haeKaikki();
        return () => ac.abort();
    }, [tapahtumat]);

    const valitutIdt = useMemo(() => new Set(valitut.map((v) => v.id)), [valitut]);

    const ryhmat = useMemo(
        () =>
            tapahtumat
                .flatMap((tapahtuma) =>
                    (tapahtuma.esityskerrat ?? []).map((esitys) => {
                        const avain = `${tapahtuma.id}-${esitys.id}`;
                        const esityksenLiput = haetutLiput[avain] ?? [];
                        const maksimi = haeMaksimi(esitys);
                        return {
                            avain,
                            tapahtuma,
                            nimi: nimiTapahtumasta(tapahtuma) ?? 'Nimetön tapahtuma',
                            esityskerta: esitys,
                            liput: esityksenLiput,
                            maksimi,
                            jaljella:
                                maksimi === null
                                    ? null
                                    : Math.max(0, maksimi - ostetutMaara(esityksenLiput)),
                        };
                    })
                )
                .sort(
                    (a, b) =>
                        a.nimi.localeCompare(b.nimi, 'fi') ||
                        new Date(a.esityskerta.alkuaika) - new Date(b.esityskerta.alkuaika)
                ),
        [tapahtumat, haetutLiput]
    );

    // Esityskerta-valinnassa näkyvät vain valitun tapahtuman esityskerrat (tai kaikki, jos tapahtumaa ei valittu)
    const esitysVaihtoehdot = ryhmat.filter(
        (r) => !valittuTapahtuma || String(r.tapahtuma.id) === valittuTapahtuma
    );

    // Näytettävät ryhmät hakuvalintojen mukaan
    const nakyvat = ryhmat.filter(
        (r) =>
            (!valittuTapahtuma || String(r.tapahtuma.id) === valittuTapahtuma) &&
            (!valittuEsitys || r.avain === valittuEsitys)
    );

    const vaihdaTapahtuma = (id) => {
        setValittuTapahtuma(id);
        setValittuEsitys(''); // esityskerta valitaan uudelleen uuden tapahtuman sisältä
    };

    const poistaValinnat = () => {
        setValittuTapahtuma('');
        setValittuEsitys('');
    };

    const lisaaListaan = (ryhma, lippu) => {
        if (valitutIdt.has(lippu.id) || lippu.ostettu) return;
        setMaksuVirhe('');
        setMaksuViesti('');
        setValitut((v) => [
            ...v,
            {
                id: lippu.id, // sarjanumero
                hinta: lippu.hinta,
                tyyppi: lippu.lipputyyppi?.nimi ?? lippu.lipputyyppi?.nimi_ ?? '',
                nimi: ryhma.nimi,
                alkuaika: ryhma.esityskerta.alkuaika,
                tapahtumaId: ryhma.tapahtuma.id,
                esityskertaId: ryhma.esityskerta.id,
            },
        ]);
    };

    const poistaListalta = (id) => setValitut((v) => v.filter((x) => x.id !== id));

    // Palauttaa kaikki tällä sivulla ladatut liput ostamattomiksi.
    // Palvelimessa täytyy olla PATCH /api/liput/{id}/ostamattomaksi -reitti.
    const palautaKaikkiOstamattomiksi = async () => {
        if (palautetaan || kasitellaan) return;
        const kaikkiLiput = Object.values(haetutLiput).flat();
        const ostetut = kaikkiLiput.filter((l) => l.ostettu);
        if (ostetut.length === 0) {
            setMaksuViesti('Yhtään ostettua lippua ei löytynyt palautettavaksi.');
            setMaksuVirhe('');
            return;
        }
        if (!window.confirm(`Palautetaanko kaikki ${ostetut.length} ostettua lippua takaisin ostamattomiksi?`)) return;

        setPalautetaan(true);
        setMaksuViesti('');
        setMaksuVirhe('');
        const onnistuneet = [];
        const epaonnistuneet = [];
        try {
            for (const lippu of ostetut) {
                try {
                    const res = await fetch(ostamatonUrl(lippu.id), {
                        method: 'PATCH',
                        headers: { 'Authorization': basicAuth() },
                    });
                    const vastaus = await res.text();
                    if (!res.ok) throw new Error(`${lippu.id}: ${res.status} ${vastaus || res.statusText}`);
                    onnistuneet.push(String(lippu.id));
                } catch (err) {
                    epaonnistuneet.push(err.message || String(err));
                }
            }

            const palautetutIdt = new Set(onnistuneet);
            setHaetutLiput((vanhat) => Object.fromEntries(
                Object.entries(vanhat).map(([avain, liput]) => [
                    avain,
                    liput.map((l) => palautetutIdt.has(String(l.id)) ? { ...l, ostettu: false } : l),
                ])
            ));
            setValitut([]);
            setMaksuViesti(`Palautettu ostamattomiksi ${onnistuneet.length} / ${ostetut.length} lippua.`);
            if (epaonnistuneet.length) {
                setMaksuVirhe(`Osa lipuista ei palautunut. ${epaonnistuneet.slice(0, 3).join('; ')}`);
            }
        } finally {
            setPalautetaan(false);
        }
    };

    const kokonaishinta = valitut.reduce((summa, v) => summa + Number(v.hinta || 0), 0);

    // Myydyt ja myymättömät liput hakusuodatuksen mukaisissa tapahtumissa ja esityskerroissa
    const nakyvatLiput = nakyvat.flatMap((r) => r.liput);
    const myydytLiput = nakyvatLiput.filter((l) => l.ostettu);
    const myytySumma = myydytLiput.reduce((summa, l) => summa + Number(l.hinta || 0), 0);

    // Haetaan ostotapahtumat OstoRestControllerin GET /api/ostot -reitiltä.
    const avaaLippulista = async () => {
        setListaAuki(true);
        setLataaOstoja(true);
        setOstotVirhe('');
        try {
            const res = await fetch(`${API_BASE}/ostot`, {
                headers: { Authorization: basicAuth() }
            });
            const vastaus = await res.text();
            if (!res.ok) throw new Error(`Ostojen haku epäonnistui (${res.status}): ${vastaus || res.statusText}`);
            const data = vastaus ? JSON.parse(vastaus) : [];
            setOstot(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Ostotapahtumien haku epäonnistui:', err);
            setOstotVirhe(err.message || 'Ostotapahtumien haku epäonnistui.');
        } finally {
            setLataaOstoja(false);
        }
    };

    // Merkitsee liput ostetuiksi peräkkäin. Näin palvelinta ei kuormiteta
    // useilla samanaikaisilla tilapäivityksillä. Vain palvelimen hyväksymät
    // liput merkitään käyttöliittymässä myydyiksi.
    const suoritaMaksu = async () => {
        if (valitut.length === 0 || kasitellaan) return;

        const myytavat = [...valitut];
        const onnistuneet = [];
        const epaonnistuneet = [];
        const virheet = [];

        setKasitellaan(true);
        setMaksuViesti('');
        setMaksuVirhe('');

        try {
            // Tarkistetaan ensin jokaisen esityskerran saatavuus. Jos yhdelläkin esityskerralla
            // ei ole tarpeeksi vapaita paikkoja, mitään ei myydä (ei osittaista myyntiä).
            const maaratEsityksittain = {};
            myytavat.forEach((l) => {
                maaratEsityksittain[l.esityskertaId] = (maaratEsityksittain[l.esityskertaId] ?? 0) + 1;
            });
            for (const [esityskertaId, maara] of Object.entries(maaratEsityksittain)) {
                let saatavuus;
                try {
                    saatavuus = await tarkistaSaatavuus(esityskertaId, maara);
                } catch (err) {
                    console.error('Saatavuuden tarkistus epäonnistui:', err);
                    setMaksuVirhe(err.message || 'Saatavuuden tarkistus epäonnistui.');
                    return;
                }
                if (!saatavuus.saatavilla) {
                    setMaksuVirhe(
                        `Lippuja ei ole tarpeeksi: valitsit ${maara} lippua, mutta paikkoja on jäljellä ${saatavuus.jaljella}.`
                    );
                    return; // finally-lohko nollaa kasitellaan-tilan
                }
            }

            for (const lippu of myytavat) {
                try {
                    await merkitseOstetuksi(lippu.id);
                    onnistuneet.push(lippu);
                } catch (err) {
                    epaonnistuneet.push(lippu);
                    virheet.push(err.message || String(err));
                    console.error('Lipun ostetuksi merkitseminen epäonnistui:', err);
                }
            }

            if (onnistuneet.length > 0) {
                const idt = new Set(onnistuneet.map((v) => String(v.id)));
                setHaetutLiput((h) =>
                    Object.fromEntries(
                        Object.entries(h).map(([avain, liput]) => [
                            avain,
                            liput.map((l) => idt.has(String(l.id)) ? { ...l, ostettu: true } : l),
                        ])
                    )
                );

                const yhteensa = onnistuneet.reduce((summa, v) => summa + Number(v.hinta || 0), 0);

                // Yksi maksu muodostaa yhden Osto-tietueen ja jokaisesta lipusta
                // oman Ostorivi-tietueen. Ostorivien tallennus ja osto-suhteen
                // asettaminen tehdään palvelimen POST /api/ostot -käsittelijässä.
                const ostoPayload = {
                    ostoaika: new Date().toISOString(),
                    kokonaishinta: Number(yhteensa.toFixed(2)),
                    ostorivit: onnistuneet.map((lippu) => ({
                        lippu: { id: lippu.id },
                        myyntihinta: Number(Number(lippu.hinta || 0).toFixed(2)),
                    })),
                };

                let ostoTallennettu = false;
                try {
                    const ostoRes = await fetch(`${API_BASE}/ostot`, {
                        method: 'POST',
                        headers: {
                            'Authorization': basicAuth(),
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(ostoPayload),
                    });
                    const ostoVastaus = await ostoRes.text();
                    if (!ostoRes.ok) {
                        throw new Error(`Ostotapahtuman tallennus epäonnistui (${ostoRes.status}): ${ostoVastaus || ostoRes.statusText}`);
                    }
                    ostoTallennettu = true;
                    if (ostoVastaus) {
                        try {
                            const tallennettuOsto = JSON.parse(ostoVastaus);
                            setOstot((vanhat) => [tallennettuOsto, ...vanhat]);
                        } catch {
                            // POST voi palauttaa myös tyhjän tai muun kuin JSON-vastauksen.
                        }
                    }
                } catch (err) {
                    // Liput on jo merkitty ostetuiksi. Niitä ei palauteta myyntilistalle,
                    // vaikka ostokuitin tallennus epäonnistuisi.
                    console.error('Ostotapahtuman tallennus epäonnistui:', err);
                    setMaksuVirhe(`Liput merkittiin ostetuiksi, mutta ostotapahtuman tallennus epäonnistui. ${err.message || ''}`);
                }

                try {
                    onMaksu?.({
                        liput: onnistuneet.map(({ id, hinta, tapahtumaId, esityskertaId }) => ({
                            id, hinta, tapahtumaId, esityskertaId,
                        })),
                        yhteensa,
                    });
                } catch (err) {
                    console.error('onMaksu-käsittelijä epäonnistui:', err);
                }

                setMaksuViesti(
                    ostoTallennettu
                        ? `Maksu suoritettu ja ostotapahtuma tallennettu: ${onnistuneet.length} kpl · ${euro(yhteensa)}`
                        : `Liput merkitty ostetuiksi: ${onnistuneet.length} kpl · ${euro(yhteensa)}`
                );
            }

            if (epaonnistuneet.length > 0) {
                setMaksuVirhe(
                    `${epaonnistuneet.length} lipun merkitseminen ostetuksi epäonnistui. Epäonnistuneet liput jäivät myyntilistalle. ${virheet[0] || ''}`
                );
            }

            setValitut(epaonnistuneet);
        } finally {
            setKasitellaan(false);
        }
    };

    const kaikkiLataa = lataa || lataaLiput;
    const kaikkiVirhe = virhe || liputVirhe;

    return (
        <Box sx={tyylit.sivu}>
            <Typography variant="h6" sx={tyylit.otsikko}>Myy liput</Typography>

            {/* Hakuvalikko: tapahtuma ja esityskerta. Ei valintaa = kaikki. */}
            <Box sx={tyylit.haku}>
                <FormControl size="small" sx={tyylit.hakuKentta}>
                    <InputLabel id="haku-tapahtuma" shrink>Tapahtuma</InputLabel>
                    <Select
                        labelId="haku-tapahtuma"
                        label="Tapahtuma"
                        value={valittuTapahtuma}
                        displayEmpty
                        notched
                        onChange={(e) => vaihdaTapahtuma(e.target.value)}
                    >
                        <MenuItem value="">Kaikki tapahtumat</MenuItem>
                        {tapahtumat.map((t) => (
                            <MenuItem key={t.id} value={String(t.id)}>
                                {nimiTapahtumasta(t) ?? 'Nimetön tapahtuma'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={tyylit.hakuKentta}>
                    <InputLabel id="haku-esitys" shrink>Esityskerta</InputLabel>
                    <Select
                        labelId="haku-esitys"
                        label="Esityskerta"
                        value={valittuEsitys}
                        displayEmpty
                        notched
                        onChange={(e) => setValittuEsitys(e.target.value)}
                    >
                        <MenuItem value="">Kaikki esityskerrat</MenuItem>
                        {esitysVaihtoehdot.map((r) => (
                            <MenuItem key={r.avain} value={r.avain}>
                                {[
                                    valittuTapahtuma ? '' : r.nimi,
                                    muotoileAika(r.esityskerta.alkuaika),
                                    r.esityskerta.paikka?.nimi,
                                ]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    size="small"
                    sx={tyylit.poistaNappi}
                    onClick={poistaValinnat}
                    disabled={!valittuTapahtuma && !valittuEsitys}
                >
                    Poista valinnat
                </Button>
                <Button
                    size="small"
                    variant="outlined"
                    sx={tyylit.poistaNappi}
                    onClick={avaaLippulista}
                >
                    Osto historia
                </Button>
                <Button
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ ...tyylit.poistaNappi, color: '#b45309', borderColor: '#b45309' }}
                    onClick={palautaKaikkiOstamattomiksi}
                    disabled={palautetaan || kasitellaan || !Object.values(haetutLiput).some((rivit) => rivit.some((l) => l.ostettu))}
                >
                    {palautetaan ? 'Palautetaan...' : 'Palauta kaikki ostamattomiksi'}
                </Button>
            </Box>
            <Box sx={tyylit.yhteenvetoRivi}>
                <Typography sx={tyylit.yhteenvetoTeksti}>
                    Myyty: {myydytLiput.length} / {nakyvatLiput.length} kpl · {euro(myytySumma)}
                </Typography>
            </Box>

            {/* Myyntilista: myytävien lippujen sarjanumerot ja kokonaishinta */}
            <Box sx={tyylit.korttiUlko}>
                <Card variant="outlined" sx={tyylit.myyntilista}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Myyntilista ({valitut.length})
                    </Typography>

                    {valitut.length === 0 && (
                        <Typography sx={tyylit.tyhjaLista}>
                            Paina lipusta "Myy lippu", niin se lisätään tähän.
                        </Typography>
                    )}

                    {valitut.map((v) => (
                        <Box key={v.id} sx={tyylit.listaRivi}>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 600 }}>
                                    {[v.nimi, v.tyyppi].filter(Boolean).join(' · ')}
                                </Typography>
                                <Typography sx={tyylit.sarjanumero}>Sarjanumero: {v.id}</Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{euro(v.hinta)}</Typography>
                            <Button size="small" onClick={() => poistaListalta(v.id)}>Poista</Button>
                        </Box>
                    ))}

                    <Box sx={tyylit.yhteensaRivi}>
                        <Typography sx={{ fontWeight: 700 }}>Yhteensä</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{euro(kokonaishinta)}</Typography>
                    </Box>

                    <Button
                        variant="contained"
                        disableElevation
                        sx={tyylit.myyNappi}
                        onClick={suoritaMaksu}
                        disabled={valitut.length === 0 || kasitellaan}
                    >
                        {kasitellaan
                            ? 'Käsitellään...'
                            : `Suorita maksu ${valitut.length > 0 ? euro(kokonaishinta) : ''}`}
                    </Button>

                    <Typography sx={tyylit.viesti} role="status">{maksuViesti}</Typography>
                    {maksuVirhe && (
                        <Typography color="error" sx={{ fontSize: '.85rem', textAlign: 'center' }} role="alert">
                            {maksuVirhe}
                        </Typography>
                    )}
                </Card>
            </Box>

            {kaikkiLataa && <CircularProgress size={24} sx={{ ml: 3, mt: 2 }} />}

            {kaikkiVirhe && <Typography color="error" sx={{ ml: 3 }}>{kaikkiVirhe}</Typography>}

            {!kaikkiLataa && !kaikkiVirhe && ryhmat.length === 0 && (
                <Typography sx={{ ml: 3 }}>Ei tapahtumia.</Typography>
            )}

            {nakyvat.map((ryhma) => {
                const { avain, nimi, esityskerta, liput: esityksenLiput, maksimi, jaljella } = ryhma;
                return (
                    <Box key={avain} component="section">
                        <Typography variant="h5" component="h2" sx={tyylit.tapahtumaOtsikko}>
                            {nimi}
                        </Typography>
                        <Typography sx={tyylit.tapahtumaTiedot}>
                            {[
                                muotoileAika(esityskerta.alkuaika),
                                esityskerta.paikka?.nimi,
                                maksimi !== null ? `Jäljellä ${jaljella} / ${maksimi}` : '',
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        </Typography>

                        {!kaikkiLataa && esityksenLiput.length === 0 && (
                            <Typography sx={{ ml: 3 }}>Ei lippuja tälle esityskerralle.</Typography>
                        )}

                        <Box sx={tyylit.lista}>
                            {esityksenLiput.map((l) => (
                                <MyyntiKortti
                                    key={l.id}
                                    lippu={l}
                                    nimi={nimi}
                                    esityskerta={esityskerta}
                                    tila={
                                        l.ostettu
                                            ? 'myyty'
                                            : valitutIdt.has(l.id)
                                              ? 'listalla'
                                              : 'vapaa'
                                    }
                                    onLisaa={() => lisaaListaan(ryhma, l)}
                                    onPoista={() => poistaListalta(l.id)}
                                />
                            ))}
                        </Box>
                    </Box>
                );
            })}

            {/* Ostohistoria: ostotapahtumat haetaan GET /api/ostot -reitiltä */}
            <Dialog open={listaAuki} onClose={() => setListaAuki(false)} fullWidth maxWidth="sm" scroll="paper">
                <DialogTitle>Osto historia</DialogTitle>
                <DialogContent dividers>
                    {lataaOstoja && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            <Typography>Haetaan ostotapahtumia...</Typography>
                        </Box>
                    )}
                    {ostotVirhe && <Typography color="error">{ostotVirhe}</Typography>}
                    {!lataaOstoja && !ostotVirhe && ostot.length === 0 && (
                        <Typography sx={{ color: VARIT.himmea }}>
                            Ostotapahtumia ei löytynyt. Tarkista, että GET /api/ostot palauttaa tallennetut ostot.
                        </Typography>
                    )}
                    {!lataaOstoja && !ostotVirhe && [...ostot].sort((a, b) => {
                        const ta = new Date(ostonAikaleima(a) || 0).getTime();
                        const tb = new Date(ostonAikaleima(b) || 0).getTime();
                        return tb - ta;
                    }).map((osto, index) => {
                        const ostorivit = ostonRivit(osto);
                        const ostoId = ensimmainenArvo(osto, ['id', 'ostoId']) ?? index + 1;
                        const aika = ostonAikaleima(osto);
                        const summa = ensimmainenArvo(osto, ['yhteensa', 'kokonaishinta', 'summa', 'total', 'hinta']);
                        return (
                            <Card key={ostoId} variant="outlined" sx={{ p: 2, mb: 1.5, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                                    <Typography sx={{ fontWeight: 700 }}>Osto #{ostoId}</Typography>
                                    <Typography sx={{ color: VARIT.himmea, fontSize: '.9rem' }}>{muotoileOstoAika(aika)}</Typography>
                                </Box>
                                {summa !== null && (
                                    <Typography sx={{ fontWeight: 600, mb: 1 }}>Yhteensä: {euro(Number(summa))}</Typography>
                                )}
                                {ostorivit.length > 0 ? ostorivit.map((rivi, riviIndex) => {
                                    const lippu = rivinLippu(rivi);
                                    const lippuId = rivinLippuId(rivi);
                                    const tunnettuRyhmä = ryhmat.find((ryhma) => ryhma.liput.some((l) => String(l.id) === String(lippuId)));
                                    const tunnettuLippu = tunnettuRyhmä?.liput.find((l) => String(l.id) === String(lippuId));
                                    const hinta = ensimmainenArvo(rivi, ['hinta', 'price']) ?? ensimmainenArvo(lippu, ['hinta', 'price']) ?? tunnettuLippu?.hinta;
                                    const tyyppi = ensimmainenArvo(lippu?.lipputyyppi, ['nimi', 'nimi_']) ?? ensimmainenArvo(rivi, ['lipputyyppiNimi', 'tyyppi']) ?? tunnettuLippu?.lipputyyppi?.nimi ?? tunnettuLippu?.lipputyyppi?.nimi_;
                                    const tapahtuma = ensimmainenArvo(lippu, ['tapahtumaNimi', 'nimi']) ?? tunnettuRyhmä?.nimi ?? 'Lippu';
                                    return (
                                        <Box key={`${lippuId ?? 'rivi'}-${riviIndex}`} sx={{ ...tyylit.listaRivi, '&:last-child': { borderBottom: 0 } }}>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 600 }}>{tapahtuma}{tyyppi ? ` · ${tyyppi}` : ''}</Typography>
                                                <Typography sx={tyylit.sarjanumero}>Sarjanumero: {lippuId ?? 'Ei saatavilla'}</Typography>
                                            </Box>
                                            {hinta !== null && hinta !== undefined && (
                                                <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{euro(Number(hinta))}</Typography>
                                            )}
                                        </Box>
                                    );
                                }) : (
                                    <Typography sx={{ color: VARIT.himmea, fontSize: '.9rem' }}>
                                        Ostolle ei löytynyt ostorivejä API-vastauksesta.
                                    </Typography>
                                )}
                            </Card>
                        );
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setListaAuki(false)}>Sulje</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default TicketSales;

// ---------------------------------------------------------------
// VÄRIT (muuta tyylin värit täältä)
// ---------------------------------------------------------------
const VARIT = {
    teksti: '#14213d',
    himmea: '#5b6478',
    korostus: '#2b59ff',
    korostusHover: '#1f45d1',
    viiva: '#c9d0e0',
    kantaTausta: '#f7f9fd',
    varoitus: '#b4540a',
    onnistui: '#15803d',
};

// ---------------------------------------------------------------
// TYYLIT (jokaisella osalla oma nimi ja selite)
// ---------------------------------------------------------------
const tyylit = {
    // Koko sivun osio
    sivu: { pb: 4 },

    // Otsikko ja myyntiyhteenveto
    otsikko: { textAlign: 'left', ml: 3, mt: 4, fontWeight: 600 },
    yhteenveto: { textAlign: 'left', ml: 3, mb: 2, color: VARIT.himmea },
    yhteenvetoRivi: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, ml: 3, mr: 3, mb: 2 },
    yhteenvetoTeksti: { textAlign: 'left', color: VARIT.himmea },

    // Väliotsikko: tapahtuma
    tapahtumaOtsikko: { textAlign: 'left', ml: 3, mt: 4, fontWeight: 700, color: VARIT.teksti },
    tapahtumaTiedot: { textAlign: 'left', ml: 3, mb: 1.5, fontSize: '.9rem', color: VARIT.himmea },

    // Korttien lista
    lista: { display: 'flex', flexDirection: 'column', gap: 2 },
    korttiUlko: { ml: 3, mr: 3 },

    // Itse kortti: kaksi osaa vierekkäin (runko + kanta)
    kortti: {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr auto' }, // pienellä näytöllä allekkain
        width: '100%',
        maxWidth: 620,                                      // kortin enimmäisleveys
        border: `1px solid ${VARIT.viiva}`,
        borderRadius: '14px',
        overflow: 'hidden',
        color: VARIT.teksti,
        bgcolor: '#fff',
    },
    loppuunmyyty: { opacity: 0.6 },

    // Vasen osa: tapahtuman tiedot
    runko: { p: '20px 20px 20px 24px', textAlign: 'left', minWidth: 0 },
    aika: {
        display: 'block',
        fontSize: '.85rem',
        fontWeight: 600,
        color: VARIT.korostus,
        textTransform: 'capitalize',
        mb: 0.5,
    },
    tapahtumaNimi: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25 },
    sarjanumero: { fontSize: '.8rem', color: VARIT.himmea, mt: 1.5, wordBreak: 'break-all' },
    tyyppi: { fontSize: '.95rem', color: VARIT.himmea, mt: 0.5 },
    saatavilla: { fontSize: '.9rem', color: VARIT.himmea, mt: 2 },
    saatavillaVahan: { color: VARIT.varoitus, fontWeight: 600 },

    // Oikea osa: hinta ja myynti (perforoitu kanta)
    kanta: {
        width: { xs: 'auto', sm: 210 },
        p: '20px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        bgcolor: VARIT.kantaTausta,
        position: 'relative',
        borderLeft: { xs: 0, sm: `2px dashed ${VARIT.viiva}` },
        borderTop: { xs: `2px dashed ${VARIT.viiva}`, sm: 0 },
        // Perforaation pyöreät lovet
        '&::before, &::after': {
            content: '""',
            position: 'absolute',
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: 'background.default',
            border: `1px solid ${VARIT.viiva}`,
        },
        '&::before': { top: -11, left: -11 },
        '&::after': {
            top: { xs: -11, sm: 'auto' },
            bottom: { xs: 'auto', sm: -11 },
            left: { xs: 'auto', sm: -11 },
            right: { xs: -11, sm: 'auto' },
        },
    },
    hinta: { fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' },

    // Myy-painike
    myyNappi: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '10px',
        bgcolor: VARIT.korostus,
        '&:hover': { bgcolor: VARIT.korostusHover },
    },

    // Hakuvalikko sivun alussa
    haku: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
        ml: 3,
        mr: 3,
        mb: 2,
    },
    hakuKentta: { minWidth: 220, flex: '1 1 220px', maxWidth: 320, textAlign: 'left' },

    // Poista listalta -painike (kortissa)
    poistaNappi: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '10px',
        color: VARIT.korostus,
        borderColor: VARIT.korostus,
    },

    // Myyntilista (myytävät liput ja kokonaishinta)
    myyntilista: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        width: '100%',
        maxWidth: 620,
        p: 2.5,
        border: `1px solid ${VARIT.viiva}`,
        borderRadius: '14px',
        color: VARIT.teksti,
        bgcolor: '#fff',
    },
    tyhjaLista: { color: VARIT.himmea, fontSize: '.9rem' },
    listaRivi: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        alignItems: 'center',
        gap: 1.5,
        pb: 1,
        borderBottom: `1px solid ${VARIT.viiva}`,
        textAlign: 'left',
    },
    yhteensaRivi: { display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' },

    // Vahvistus myynnin jälkeen
    viesti: { fontSize: '.8rem', color: VARIT.onnistui, textAlign: 'center', minHeight: '1.2em' },
};