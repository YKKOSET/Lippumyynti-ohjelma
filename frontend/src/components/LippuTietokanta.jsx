const API_BASE = 'http://localhost:8080/api';
const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

// Basic-tunnistautuminen myös ääkkösiä sisältäville tunnuksille.
const basicAuth = () => {
    let binaari = '';
    new TextEncoder().encode(`${username ?? ''}:${password ?? ''}`)
        .forEach((tavu) => { binaari += String.fromCharCode(tavu); });
    return `Basic ${btoa(binaari)}`;
};

// Yleinen pyyntö: palauttaa vastauksen JSON-muodossa (tai null) ja heittää virheen, jos pyyntö epäonnistuu.
const pyynto = async (metodi, polku, runko, virheteksti = 'Pyyntö epäonnistui', signal) => {
    const res = await fetch(`${API_BASE}${polku}`, {
        method: metodi,
        signal,
        headers: {
            'Authorization': basicAuth(),
            'Accept': 'application/json',
            ...(runko !== undefined && { 'Content-Type': 'application/json' }),
        },
        body: runko !== undefined ? JSON.stringify(runko) : undefined,
    });
    const vastaus = await res.text();
    if (!res.ok) {
        throw Object.assign(new Error(`${virheteksti} (${res.status}): ${vastaus || res.statusText}`), { status: res.status });
    }
    try { return vastaus ? JSON.parse(vastaus) : null; } catch { return null; }
};

// Perus-CRUD yhdelle resurssille, esim. resurssi('/tapahtumat', 'Tapahtuma').
const resurssi = (polku, nimi) => ({
    hae: (signal) => pyynto('GET', polku, undefined, `${nimi}: haku epäonnistui`, signal),
    haeYksi: (id) => pyynto('GET', `${polku}/${id}`, undefined, `${nimi}: haku epäonnistui`),
    luo: (data) => pyynto('POST', polku, data, `${nimi}: luonti epäonnistui`),
    paivita: (id, data) => pyynto('PUT', `${polku}/${id}`, data, `${nimi}: päivitys epäonnistui`),
    poista: (id) => pyynto('DELETE', `${polku}/${id}`, undefined, `${nimi}: poisto epäonnistui`),
});

// Kaikki sovelluksen api-kutsut. Uusi kutsu = yksi rivi tähän.
export const api = {
    tapahtumat: resurssi('/tapahtumat', 'Tapahtuma'),
    liput: resurssi('/liput', 'Lippu'),
    ostot: resurssi('/ostot', 'Osto'),
    jarjestajat: resurssi('/jarjestajat', 'Järjestäjä'),

    luoLippu: async (esityskertaId, tyyppi) => {
        const lippu = await pyynto('POST', '/liput', {
            hinta: tyyppi.hinta,
            ostettu: true,
            kaytetty: false,
            esityskerta: { id: esityskertaId },
            lipputyyppi: { id_: tyyppi.dbId },
        }, 'Lipun luonti epäonnistui');
        if (lippu?.id == null) throw new Error('Lipun luonti epäonnistui: vastauksessa ei ollut lipun id:tä.');
        return lippu;
    },

    lahetaOsto: (ostoPayload) =>
        pyynto('POST', '/ostot', ostoPayload, 'Ostotapahtuman tallennus epäonnistui'),

    haeEsityskerranLiput: (tapahtumaId, esityskertaId, signal) =>
        pyynto('GET', `/tapahtumat/${tapahtumaId}/${esityskertaId}/liput`, undefined, 'Lippujen haku epäonnistui', signal),

    // Tallentaa tapahtuman lomakkeelta vaiheittain: järjestäjä -> tapahtuma -> esityskerrat.
    // tapahtuma: { id } (olemassa oleva) tai { nimi } (uusi)
    // jarjestaja: olio (uusi), id (olemassa oleva) tai null
    // Palauttaa tapahtuman id:n.
    
    luoTapahtuma: async ({ tapahtuma, jarjestaja, esityskerrat }) => {
        let jarjestajaRef = null;

        if (jarjestaja && typeof jarjestaja === 'object') {
            const uusi = await api.jarjestajat.luo(jarjestaja);
            jarjestajaRef = { id: uusi.id };
        } else if (jarjestaja) {
            jarjestajaRef = { id: jarjestaja };
        }

        let tapahtumaId = tapahtuma.id;

        if (tapahtumaId === undefined) {
            const uusi = await api.tapahtumat.luo({
                nimi: tapahtuma.nimi,
                jarjestaja: jarjestajaRef
            });
            tapahtumaId = uusi.id;
        }

        
        
        for (const [i, e] of esityskerrat.entries()) {
            try {
                await pyynto('POST', '/esityskerrat', {
                    alkuaika: new Date(e.alkuaika).toISOString(),

                    maxOsallistujat: e.maxosallistujat === ''
                        ? null
                        : Number(e.maxosallistujat),

                    paikka: e.paikka?.trim()
                        ? {
                            nimi: e.paikka.trim(),
                            katuosoite: e.katuosoite?.trim() || '',
                            postinumero: e.postinumero?.trim()
                                ? {
                                    postinumero: e.postinumero.trim(),
                                    postitoimipaikka: e.postitoimipaikka?.trim() || ''
                                }
                                : null
                        }
                        : null,

                    tapahtuma: { id: tapahtumaId },

                }, 'Esityskerran tallennus epäonnistui');

            } catch (err) {
                throw new Error(
                    `Tapahtuma tallennettiin (id ${tapahtumaId}), mutta esityskerran ${i + 1} tallennus epäonnistui: ${err.message}`
                );
            }
        }



        return tapahtumaId;
    },


    // Palauttaa lipun tai null, jos lippua ei löydy. signal = AbortController-signaali haun peruuttamiseen.
    haeLippu: async (lippuId, signal) => {
        try {
            return await pyynto('GET', `/liput/${encodeURIComponent(lippuId)}`, undefined, 'Lipun haku epäonnistui', signal);
        } catch (err) {
            if (err.status === 404) return null;
            throw err;
        }
    },

    // PATCH /api/liput/{id}/kaytetty tai /kayttamaton
    merkitseKaytetyksi: (lippuId, kaytetty) =>
        pyynto('PATCH', `/liput/${encodeURIComponent(lippuId)}/${kaytetty ? 'kaytetty' : 'kayttamaton'}`, undefined, 'Lipun tilan tallennus epäonnistui'),

    // Palauttaa { saatavilla, jaljella, viesti }
    tarkistaSaatavuus: (esityskertaId, maara) =>
        pyynto('GET', `/liput/saatavuus?esityskertaId=${esityskertaId}&maara=${maara}`, undefined, 'Saatavuuden tarkistus epäonnistui'),
};

// Käyttö komponentissa: <LippuTietokanta>{(api) => ...}</LippuTietokanta>
// Muualla (hookit, apufunktiot): import { api } from './LippuTietokanta';
function LippuTietokanta({ children }) {
    return children(api);
}

export default LippuTietokanta;