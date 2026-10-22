DROP TABLE IF EXISTS ostorivi;
DROP TABLE IF EXISTS lippu;
DROP TABLE IF EXISTS lipputyyppi;
DROP TABLE IF EXISTS esityskerta;
DROP TABLE IF EXISTS paikka;
DROP TABLE IF EXISTS osto;
DROP TABLE IF EXISTS asiakas;
DROP TABLE IF EXISTS postinumero;
DROP TABLE IF EXISTS tapahtuma;
DROP TABLE IF EXISTS jarjestaja;
DROP TABLE IF EXISTS users;

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
    jarjestaja_id BIGINT,
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
	asiakas_id BIGINT,
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
    paikka_id BIGINT,
    CONSTRAINT fk_paikka_id
        FOREIGN KEY (paikka_id)
        REFERENCES paikka(paikka_id),
    tapahtuma_id BIGINT NOT NULL,
    CONSTRAINT fk_tapahtuma_id
        FOREIGN KEY (tapahtuma_id)
        REFERENCES tapahtuma(tapahtuma_id)
);

CREATE TABLE lippu (
    tark_nro UUID NOT NULL PRIMARY KEY,
    hinta NUMERIC(10,2) NOT NULL,
    kaytetty BOOLEAN NOT NULL,
    esityskerta_id BIGINT NOT NULL,
    CONSTRAINT fk_esityskerta_id
        FOREIGN KEY (esityskerta_id)
        REFERENCES esityskerta(esityskerta_id),
    lipputyyppi_id BIGINT NOT NULL,
    CONSTRAINT fk_lipputyyppi_id
        FOREIGN KEY (lipputyyppi_id)
        REFERENCES lipputyyppi(lipputyyppi_id)
);

CREATE TABLE ostorivi (
    ostorivi_id BIGSERIAL PRIMARY KEY,
    myyntihinta NUMERIC(10,2) NOT NULL,
    kuitti_id BIGINT NOT NULL,
    CONSTRAINT fk_kuitti_id
        FOREIGN KEY (kuitti_id)
        REFERENCES osto(kuitti_id),
    tark_nro UUID NOT NULL,
    CONSTRAINT fk_tark_nro
        FOREIGN KEY (tark_nro)
        REFERENCES lippu(tark_nro)
);

CREATE TABLE users (
	appuser_id BIGSERIAL PRIMARY KEY,
	username VARCHAR NOT NULL UNIQUE,
	password_hash VARCHAR NOT NULL,
	app_role VARCHAR NOT NULL
);


-- Jarjestajat
INSERT INTO jarjestaja (etunimi, sukunimi, sahkoposti, puhelin) VALUES
('Matti', 'Halminen', 'matin@kukat.fi', '0401234567'),
('Tom', 'Aatti', 'tom.aatti@gmail.com', '0407654321'),
('Naami', 'Puronen', 'NewKirjailijaliitto@liitto.fi', '0501234567'),
('Tony', 'Swift', 'music@tomorrowland.com', '0206537769'),
('Mikko', 'Korhonen', 'mikko@clockfest.fi', '0509876543');

-- Tapahtumat
INSERT INTO tapahtuma (nimi, jarjestaja_id) VALUES
('Keikkakeidas', 1),
('Teatterin Aave', 1),
('Vantaan kirjamessut', 2),
('Helsinki festivalland', 3),
('Ruislock 2026', 4);

-- Lipputyypit
INSERT INTO lipputyyppi (nimi) VALUES
('Lastenlippu'),
('Opiskelija'),
('Eläkeläinen'),
('Normaalihintainen');

-- Postinumero ja paikka (Javassa ei ole, mutta esityskerta tarvitsee paikka_id:n, ks. huomio alla)
INSERT INTO postinumero (postinumero, postitoimipaikka) VALUES
('00100', 'Helsinki');

INSERT INTO paikka (nimi, katuosoite, postinumero) VALUES
('Esimerkkipaikka', 'Esimerkkikatu 1', '00100');

-- Esityskerrat (max_osallistujat, alkuaika, paikka_id, tapahtuma_id)
INSERT INTO esityskerta (max_osallistujat, alkuaika, paikka_id, tapahtuma_id) VALUES
(100, '2028-10-01 19:00:00', 1, 2),
(100, '2028-11-08 19:00:00', 1, 2),
(100, '2028-10-01 10:00:00', 1, 1),
(100, '2028-11-01 10:00:00', 1, 1),
(100, '2028-12-12 13:00:00', 1, 3);

-- Asiakkaat
INSERT INTO asiakas (etunimi, sukunimi, sahkoposti, puhelin) VALUES
('Jordi', 'Alba', 'Jordi.Alba@gmail.com', '+358 878 8473289'),
('Jonni', 'Ponni', 'Jonni.Ponni@gmail.com', '+358 647 457938'),
('Bard', 'Chime', 'Bard.Chime@gmail.com', '+358 423 8573498'),
('Gucci', 'Mane', 'Gucci.Mane@gmail.com', '+358 312 597834');

-- Ostot (ostoaika, kokonaishinta, asiakas_id)
INSERT INTO osto (ostoaika, kokonaishinta, asiakas_id) VALUES
('2025-11-09 14:30:00', 25.00, 1),
('2025-11-15 15:30:00', 20.00, 2),
('2025-11-18 12:30:00', 10.00, 3);

-- Liput (tark_nro (ohittaa autogeneroinnin), hinta, kaytetty, esityskerta_id, lipputyyppi_id)
INSERT INTO lippu (tark_nro, hinta, kaytetty, esityskerta_id, lipputyyppi_id) VALUES
('00220000-0000-3230-8070-000000000001', 10.00, false, 1, 1), -- Lastenlippu
('00220000-0000-3230-0070-000000000002', 15.00, false, 1, 2), -- Opiskelijalippu
('00220000-0000-3230-0070-000000000003', 20.00, false, 1, 4), -- Normaali
('00220000-0000-3230-0070-000000000004', 10.00, false, 1, 3); -- Eläkeläinen

-- Ostorivit (myyntihinta, kuitti_id, tark_nro)
INSERT INTO ostorivi (myyntihinta, kuitti_id, tark_nro) VALUES
(10.00, 1, '00220000-0000-3230-8070-000000000001'),
(15.00, 1, '00220000-0000-3230-0070-000000000002'),
(20.00, 2, '00220000-0000-3230-0070-000000000003'),
(10.00, 3, '00220000-0000-3230-0070-000000000004');

-- Käyttäjät (username, password_hash, app_role)
INSERT INTO users (username, password_hash, app_role) VALUES
('ADMIN', '$2a$10$7sjwudu9tBVMcLk0PgDtUO8IwgddtDOzsbgwFcowHGpDoZIVo3CSm', 'ADMIN'),
('USER', '$2a$10$FziK2VY3xkXFl2d5wggIn.0lM/jhxKM0lHLwJqpIc0CNCmVwLYLQO', 'USER');
