DROP TABLE IF EXISTS lipputyyppi;
DROP TABLE IF EXISTS ostorivi;
DROP TABLE IF EXISTS lippu;
DROP TABLE IF EXISTS esityskerta;
DROP TABLE IF EXISTS paikka;
DROP TABLE IF EXISTS osto;
DROP TABLE IF EXISTS asiakas;
DROP TABLE IF EXISTS postinumero;
DROP TABLE IF EXISTS tapahtuma;
DROP TABLE IF EXISTS jarjestaja;

CREATE TABLE jarjestaja (
    jarjestaja_id BIGSERIAL PRIMARY KEY,
    etunimi VARCHAR(50),
    sukunimi VARCHAR(100),
    sahkoposti VARCHAR(300),
    puhelin VARCHAR(20)
);

CREATE TABLE tapahtuma (
    tapahtuma_id BIGSERIAL PRIMARY KEY,
    nimi VARCHAR(200) NOT NULL,
    jarjestaja_id BIGSERIAL,
    CONSTRAINT fk_jarjestaja_id
        FOREIGN KEY (jarjestaja_id)
        REFERENCES jarjestaja(jarjestaja_id)
);

CREATE TABLE lipputyyppi (
    lipputyyppi_id BIGSERIAL PRIMARY KEY,
    nimi VARCHAR(100) NOT NULL
);

CREATE TABLE postinumero (
    postinumero VARCHAR(5) PRIMARY KEY,
    postitoimipaikka VARCHAR(50) NOT NULL
);

CREATE TABLE asiakas (
    asiakas_id BIGSERIAL PRIMARY KEY,
    etunimi VARCHAR(50),
    sukunimi VARCHAR(100),
    sahkoposti VARCHAR(300),
    puhelin VARCHAR(20)
);

CREATE TABLE osto (
    kuitti_id BIGSERIAL PRIMARY KEY,
    ostoaika TIMESTAMP NOT NULL,
    kokonaishinta NUMERIC(10,2) NOT NULL,
	asiakas_Id BIGSERIAL,
    CONSTRAINT fk_asiakas_id
        FOREIGN KEY (asiakas_id)
        REFERENCES asiakas(asiakas_id)
);

CREATE TABLE paikka (
    paikka_id BIGSERIAL PRIMARY KEY,
    nimi VARCHAR(200) NOT NULL,
    katuosoite VARCHAR(100) NOT NULL,
	postinumero VARCHAR(5) NOT NULL,
    CONSTRAINT fk_postinumero
        FOREIGN KEY (postinumero)
        REFERENCES postinumero(postinumero)
);

CREATE TABLE esityskerta (
    esityskerta_id BIGSERIAL PRIMARY KEY,
    max_osallistujat INTEGER,
    alkuaika TIMESTAMP NOT NULL,
    paikka_id BIGSERIAL,
    CONSTRAINT fk_paikka_id
        FOREIGN KEY (paikka_id)
        REFERENCES paikka(paikka_id),
    tapahtuma_id BIGSERIAL NOT NULL,
    CONSTRAINT fk_tapahtuma_id
        FOREIGN KEY (tapahtuma_id)
        REFERENCES tapahtuma(tapahtuma_id)
);

CREATE TABLE lippu (
    tark_nro BIGSERIAL PRIMARY KEY,
    hinta NUMERIC(10,2) NOT NULL,
    kaytetty BOOLEAN NOT NULL,
    esityskerta_id BIGSERIAL NOT NULL,
    CONSTRAINT fk_esityskerta_id
        FOREIGN KEY (esityskerta_id)
        REFERENCES esityskerta(esityskerta_id)
);

CREATE TABLE ostorivi (
    ostorivi_id BIGSERIAL PRIMARY KEY,
    myyntihinta NUMERIC(10,2) NOT NULL,
    kuitti_id BIGSERIAL NOT NULL,
    CONSTRAINT fk_kuitti_id
        FOREIGN KEY (kuitti_id)
        REFERENCES osto(kuitti_id),
    tark_nro BIGSERIAL NOT NULL,
    CONSTRAINT fk_tark_nro
        FOREIGN KEY (tark_nro)
        REFERENCES lippu(tark_nro)
);
