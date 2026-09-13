
<!--
# Projektin nimi
-->

# TicketGuru -lipunmyyntijärjestelmä


Tiimi Ykköset: <br>
Oksanen Joonis <br>
Paavolainen Arttu <br>
Salminen Sini <br>
Vastamäki Johanna <br>
Vähäkuopus Felix

## Johdanto


### Opintojakso
Tämä projekti on toteutettu Haaga Helian opintojaksolle Ohjelmistoprojekti 1 - SOF005AS3A-3026 syksyllä 2026. Opintojakson tavoitteena on, että opiskelijat toimivat ohjelmistoprojektin kehitystiimin jäsenenä, toteuttavat ohjelmistorajapinnan ja tekevät yhteistyötä tilaajatahon (opettaja) kanssa. Opintojakso kestää 16 viikkoa, jonka aikana ohjelmistoprojekti kehitetään.

### Tilaaja
Projektissa tilaajana on lipputoimisto, joka tilaa tiimiltä lipunmyyntijärjestelmän (TicketGuru). Järjestelmältä halutaan mm.
* Toimisto voi määritellä itse tapahtumat
* Tukevan eri lipputyyppejä (esim. aikuinen, lapsi, eläkeläinen) eri hinnoilla
* Hintoja voidaan muokata ohjelmassa
* Pystytään tarkastella myyntiraporttia ja myyntitapahtumia
* Lipunmyyntipisteessä voidaan tulostaa liput järjestelmän kautta
* Lippuihin tulostetaan tarkistuskoodi
* Mahdollinen verkkokauppa, jotta asiakkaat pystyvät omatoimisesti ostamaan lippuja


### Toteutus- ja toimintaympäristö
Projektin tietokantana toimii SQL ja tietokannan käyttöliittymänä käytämme PostgreSQL:ää. Käytämme projektissa myös REST-ohjelmistorajapintaa Back end ja Front end -osien välillä. Ohjelmiston kehitettämiseen käytetään Spring Boot -sovelluskehystä. Front end tekniikkana toimii React.
Julkaisemme lopputuloksen toimimaan verkkosivulla.


### Lopputulos
Lopputuloksena projektille on tilaajan toiveiden mukainen tuote, jota voi käyttää tietokoneella.

<!-- Johdantoon kirjoitetaan lyhyt, ytimekäs kuvaus siitä, mikä on projektin aihe,
kuka on asiakas (käyttäjä), mitä hän haluaa ja saa järjestelmältä, mitä
tekniikoita käytetään ja mitä konkreettisesti on valmiina, kun projekti päättyy.

-   Järjestelmän tarkoitus ja tiivis kuvaus siitä, mistä on kyse ja kenelle järjestelmä on tarkoitettu.
-   Toteutus- ja toimintaympäristö lyhyesti:  
    -   Palvelinpuolen ratkaisut ja teknologiat (esim. palvelinteknologia, mikä tietokantajärjestelmä on käytössä)
    -   Käyttöliittymäratkaisut ja teknologiat (esim. päätelaitteet: puhelin,
    täppäri, desktop)
-->

## Järjestelmän määrittely
Järjestelmän määrittely kuvaa käyttäjän näkökulmasta järjestelmän keskeiset toiminnot. Käyttäjäroolit määrittelevät järjestelmää käyttävät ryhmät, ja käyttäjätarinat listaa erilaisia käyttötapauksia. Käyttötapauskaavio esittää keskeiset toiminteet järjestelmälle, jakaen ne käyttäjien vastuiden mukaisesti: mitä eri toiminteita eri käyttäjäryhmät järjestelmällä tekevät.

### Käyttäjäroolit

#### Asiakas
Henkilö joka voi ostaa lipun haluamaansa tapahtumaan lipiunmyyntipisteestä tai verkkokaupasta.

Roolin käyttötapaukset:
* Tapahtumien selaaminen
* Lipun ostaminen
* Lipputyypin valinta
* Maksaminen
* Digitaalisen lipun vastaanottaminen
* Lipun palautus/vaihto

#### Lipunmyyjä
Lipputoimiston työntekijä, joka myy ja hallinnoi lippuja asiakkaille. Järjestelmän operatiivinen käyttäjä.

Roolin käyttötapaukset:
* Lippujen myynti
* Lippujen tulostaminen
* Tapahtumien ja hintojen hallinta
* Myyntiraporttien tarkastelu

#### Lipuntarkastaja
Tapahtuman ovella työskentelevä henkilö, joka tarkistaa asiakkaiden liput sisäänpääsyn yhteydessä.

Roolin käyttötapaukset:
* Lipun koodin lukeminen
* Lipun aitouden ja voimassaolon tarkistaminen
* Lippujen merkitseminen käytetyiksi

#### Tapahtumajärjestäjä
Tapahtuman järjestäjä, joka on kiinnostunut oman tapahtumansa tiedoista ja myyntiraportista.

Roolin käyttötapaukset:
* Tapahtuman tietojen ja myyntitilastojen tarkastelu (kävijämäärät, myytyjen lippujen määrät ja tuotot)

<br>

### Käyttäjätarinat

#### Tarina 1: Saman päivän esitys
Kaverukset Christian ja Laura haluavat mennä Teatterin Aave -esitykseen perjantaina. Perjantaina heidän saapuessaan lipunmyynnille myyjä kertoo, että päivä on loppuunmyyty eikä lippuja kyseiselle päivälle enää ole. Myyjä kertoo, että ensi viikon lauantaina on vielä paikkoja jäljellä. Kaverukset ostavat liput lauantain esitykseen jotka saavat heti tulostettuna, ja joutuvat keksimään muuta tekemistä illalleen. <br>
Seuraavana lauantaina Christian ja Laura saapuvat ajallaan esitykseen. Ovella valvoja tarkistaa liput, ja merkitsee ne käytetyksi kavereiden mennessä sisään.

#### Tarina 2: Tapahtuman kannattavuus
Erään tapahtumahallin omistaja pohtii, kannattaako Kuukauden Kirja -tapahtumaa järjestää enää. Päätöksensä tueksi hän haluaa tietää, kuinka monta kävijää edellisessä tapahtumassa on ollut ja kuinka paljon tapahtuma on tienannut, jotta voi verrata niitä tapahtuman järjestämisestä aiheutuviin kuluihin. <br>
Omistaja ottaa yhteyttä lipputoimistoon jonka kautta liput myydään ja tahtoo tietää tapahtuman tilastot. Lipputoimiston työntekijä selvittää järjestelmästään Kuukauden kirja -tapahtumaan myytyjen lippujen myyntiraportin ja osaa kertoa, että tapahtumaan ostettiin 314 aikuisten lippua ja 42 lasten lippua. Näin ollen tuottoja oli yhteensä 4020 euroa. Tämän perusteella omistaja voi pohtia, kannattaako tapahtumaa enää järjestää vai olisiko mahdollista lisätä tapahtuman houkuttelevuutta.

#### Tarina 3: Lipun tulostus
Lipunmyyjänä haluan, että jokaiselle myydylle lipulle tulostuu automaattisesti fyysinen lippu, jossa näkyy tapahtuman tiedot sekä yksilöllinen, helposti luettava koodi, jotta asiakas saa mukaansa toimivan pääsylipun heti oston yhteydessä. Tulostuksen tulisi onnistua sekä ennakkomyynnissä että tapahtumapäivänä ovella tapahtuvassa myynnissä. Haluan myös, että tulostusvirheen sattuessa lippua voidaan tulostaa uudelleen ilman, että asiakkaalta veloitetaan kahdesti tai että järjestelmään syntyy virheellisiä kaksoiskappaleita samasta lipusta.

#### Tarina 4: Lipun tarkastus ovella
Ovella työskentelevänä henkilönä haluan lukea lipussa olevan koodin järjestelmän avulla, jotta näen välittömästi, onko lippu aito, oikeaan tapahtumaan kuuluva ja vielä käyttämätön. Kun lippu todetaan kelvolliseksi, haluan pystyä merkitsemään sen käytetyksi yhdellä toiminnolla, jotta samaa lippua ei voida käyttää uudelleen sisäänpääsyyn. Mikäli lippu on jo käytetty tai virheellinen, haluan järjestelmän ilmoittavan siitä selkeästi, jotta voin estää asiakkaan pääsyn ja toimia tilanteen vaatimalla tavalla.

#### Tarina 5: Tungos ja tuplaliput
Lipputoimisto sai ison tapahtumajärjestäjän asiakkaakseen. Tapahtuman suosio yllätti ja liput myytiin hetkessä loppuun. Ongelmaksi koitui, ettei myydyt liput päivittyneet reaaliajassa eri lipunmyyntipisteisiin, jolloin tapahtumaan myytiin liikaa lippuja. Seurauksena tilojen enimmäismäärä ylittyi. Tapahtuma sai huonoa palautetta tungoksesta, josta seurasi muitakin käytännön ongelmia. Lisäksi asiakkaille oli tulostunut tuplalippuja samoilla sarjanumeroilla. Osa asiakkaista ei päässyt paikalle ja he myivät alkuperäisiä lippujaan yksityisesti eteenpäin ennen tapahtumaa. Tapahtumapäivänä ovella oli paljon selvittelyä, oliko eteenpäin myydyt liput väärennettyjä vai alkuperäisiä ”tuplalippuja”. Tämä hidasti kaikkien sisäänpääsyä sekä lisäsi pahaa mieltä ja mainehaittaa lipputoimistolle.

#### Tarina 6: Peruutusoikeus
Asiakas on ostanut lipun tapahtumaan Syysyö Sastamalassa. Alkusyksystä hän kuitenkin loukkaantuu tapaturmaisesti. Saattajan avustamana sekä raajat kipsattuna hän lähtee käymään lipunmyyntipisteellä, koska he eivät löydä mahdollisuutta asioida netin kautta, eikä puhelimitsekaan oikein osattu auttaa, että mitä lipun kanssa voisi nyt tehdä. Asiakas näyttää lipunmyyntipisteellä lääkärintodistuksen sekä ostamansa paperisen lipun. Hän toivoisi, että saisi lippua vastaan rahat takaisin taikka vaihtaa lipun toiseen, myöhemmin tulevaan tapahtumaan. Lipunmyyntipisteellä henkilökunta ei oikein tiedä miten lipun kanssa kuuluisi toimia, kun ei ole lipunmyyntijärjestelmääkään, jonne voisi kirjata lipun palautuneeksi. Lopulta he ottavat lipun kuitenkin takaisin myyntiin ja antavat samanhintaisen, tulevan tapahtuman lipun tilalle. He pahoittelevat, että asiakas joutui asian vuoksi tulemaan fyysisesti paikan päälle. Asiakas on tyytyväinen, että asia hoitui parhain päin, mutta olisi halunnut mieluummin asioida verkossa.

#### Tarina 7: Lipun ostaminen verkosta
Asiakas haluaa ostaa lipun tulevana viikonloppuna järjestettävään tapahtumaan. Hän avaa lipputoimiston verkkosivut ja valitsee haluamansa tapahtuman sekä näytöksestä vapaan paikan. Asiakas valitsee aikuisten lipun, maksaa ostoksen verkkopankissa ja saa onnistuneen maksun jälkeen sähköpostiinsa vahvistuksen sekä digitaalisen lipun. Lipussa näkyvät tapahtuman tiedot ja yksilöllinen koodi, jonka hän voi näyttää puhelimestaan tapahtuman ovella. Asiakkaan ei näin tarvitse käydä lipunmyyntipisteellä tai tulostaa lippua etukäteen.

#### Tarina 8: Tapahtuman tietojen ja hintojen hallinta
Lipputoimiston työntekijä saa tiedon, että tapahtumajärjestäjä on muuttanut tulevan tapahtuman lippujen hintoja. Aikuisten lipun hinta nousee 20 eurosta 25 euroon ja lasten lipun hinta 10 eurosta 12 euroon. Työntekijä kirjautuu lipunmyyntijärjestelmään ja päivittää tapahtuman hinnat sekä muut tarvittavat tapahtumatiedot. Järjestelmä tallentaa muutokset, minkä jälkeen asiakkaat näkevät verkkokaupassa uudet hinnat ja järjestelmä laskee ostoksen loppusumman niiden perusteella.

#### Tarina 9: Aiemman ostoksen etsiminen
Lipunmyyjä saa asiakkaalta kyselyn aikaisemmin ostetusta lipusta. Asiakas ei löydä lippuaan eikä muista, milloin ostos on tehty. Lipunmyyjä etsii järjestelmästä asiakkaan ostoksen esim. tietyn tapahtuman ostotietojen perusteella. Järjestelmä näyttää löydetyn ostoksen tiedot, jolloin myyjä voi tarkistaa lipun tilanteen ja tarvittaessa auttaa asiakasta.

#### Tarina 10: Tapahtuman tietojen seuranta
Tapahtumajärjestäjä haluaa nähdä, kuinka paljon tapahtumaan on vielä vapaita paikkoja ja kuinka monta lippua on jo myyty. Hän pääsee katsomaan näitä tilastoja tapahtumajärjestäjälle jaetun linkin kautta. Linkin kautta avautuu näkymä järjestelmän tietoihin kyseisestä tapahtumasta ja siihen liittyvistä tilastoista. Tapahtumajärjestäjä on tyytyväinen toiminnallisuuteen, koska hän pääsee tutkimaan ajankohtaista dataa.


### Käyttötapauskaavio

![Käyttötapauskaavio](./kuvat/kayttotapauskaavio.png)


<!-- Määrittelyssä järjestelmää tarkastellaan käyttäjän näkökulmasta. Järjestelmän
toiminnot hahmotellaan käyttötapausten tai käyttäjätarinoiden kautta, ja kuvataan järjestelmän
käyttäjäryhmät.

-   Lyhyt kuvaus käyttäjäryhmistä (rooleista)
-   Käyttäjäroolit ja roolien tarvitsemat toiminnot, esim. käyttötapauskaaviona
    (use case diagram) tai käyttäjätarinoina.
-   Lyhyt kuvaus käyttötapauksista tai käyttäjätarinat

Kuvauksissa kannattaa harkita, mikä on toteuttajalle ja asiakkaalle oleellista
tietoa ja keskittyä siihen.  -->

 

## Käyttöliittymä

![Käyttöliittymäkaavio](./kuvat/kayttoliittyma.png)


<!-- Esitetään käyttöliittymän tärkeimmät (vain ne!) näkymät sekä niiden väliset siirtymät käyttöliittymäkaaviona. 

Jos näkymän tarkoitus ei ole itsestään selvä, se pitää kuvata lyhyesti. -->

## Tietokanta

<!-- Järjestelmään säilöttävä ja siinä käsiteltävät tiedot ja niiden väliset suhteet
kuvataan käsitekaaviolla. Käsitemalliin sisältyy myös taulujen välisten viiteyhteyksien ja avainten
määritykset. Tietokanta kuvataan käyttäen jotain kuvausmenetelmää, joko ER-kaaviota ja UML-luokkakaaviota.

Lisäksi kukin järjestelmän tietoelementti ja sen attribuutit kuvataan
tietohakemistossa. Tietohakemisto tarkoittaa yksinkertaisesti vain jokaisen elementin (taulun) ja niiden
attribuuttien (kentät/sarakkeet) listausta ja lyhyttä kuvausta esim. tähän tyyliin:

> ### _Tilit_
> _Tilit-taulu sisältää käyttäjätilit. Käyttäjällä voi olla monta tiliä. Tili kuuluu aina vain yhdelle käyttäjälle._
>
> Kenttä | Tyyppi | Kuvaus
> ------ | ------ | ------
> id | int PK | Tilin id
> nimimerkki | varchar(30) |  Tilin nimimerkki
> avatar | int FK | Tilin avatar, viittaus [avatar](#Avatar)-tauluun
> kayttaja | int FK | Viittaus käyttäjään [käyttäjä](#Kayttaja)-taulussa -->

## Tekninen kuvaus

<!-- Teknisessä kuvauksessa esitetään järjestelmän toteutuksen suunnittelussa tehdyt tekniset
ratkaisut, esim.

-   Missä mikäkin järjestelmän komponentti ajetaan (tietokone, palvelinohjelma)
    ja komponenttien väliset yhteydet (vaikkapa tähän tyyliin:
    https://security.ufl.edu/it-workers/risk-assessment/creating-an-information-systemdata-flow-diagram/)
-   Palvelintoteutuksen yleiskuvaus: teknologiat, deployment-ratkaisut yms.
-   Keskeisten rajapintojen kuvaukset, esimerkit REST-rajapinta. Tarvittaessa voidaan rajapinnan käyttöä täsmentää
    UML-sekvenssikaavioilla.
-   Toteutuksen yleisiä ratkaisuja, esim. turvallisuus.

Tämän lisäksi

-   ohjelmakoodin tulee olla kommentoitua
-   luokkien, metodien ja muuttujien tulee olla kuvaavasti nimettyjä ja noudattaa
    johdonmukaisia nimeämiskäytäntöjä
-   ohjelmiston pitää olla organisoitu komponentteihin niin, että turhalta toistolta
    vältytään -->

## Testaus

<!-- Tässä kohdin selvitetään, miten ohjelmiston oikea toiminta varmistetaan
testaamalla projektin aikana: millaisia testauksia tehdään ja missä vaiheessa.
Testauksen tarkemmat sisällöt ja testisuoritusten tulosten raportit kirjataan
erillisiin dokumentteihin.

Tänne kirjataan myös lopuksi järjestelmän tunnetut ongelmat, joita ei ole korjattu. -->

## Asennustiedot

<!-- Järjestelmän asennus on syytä dokumentoida kahdesta näkökulmasta:

-   järjestelmän kehitysympäristö: miten järjestelmän kehitysympäristön saisi
    rakennettua johonkin toiseen koneeseen

-   järjestelmän asentaminen tuotantoympäristöön: miten järjestelmän saisi
    asennettua johonkin uuteen ympäristöön.

Asennusohjeesta tulisi ainakin käydä ilmi, miten käytettävä tietokanta ja
käyttäjät tulee ohjelmistoa asentaessa määritellä (käytettävä tietokanta,
käyttäjätunnus, salasana, tietokannan luonti yms.). -->

## Käynnistys- ja käyttöohje

<!-- Tyypillisesti tässä riittää kertoa ohjelman käynnistykseen tarvittava URL sekä
mahdolliset kirjautumiseen tarvittavat tunnukset. Jos järjestelmän
käynnistämiseen tai käyttöön liittyy joitain muita toimenpiteitä tai toimintajärjestykseen liittyviä asioita, nekin kerrotaan tässä yhteydessä.

Usko tai älä, tulet tarvitsemaan tätä itsekin, kun tauon jälkeen palaat
järjestelmän pariin !
-->

