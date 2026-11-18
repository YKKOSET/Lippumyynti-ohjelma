# Robot Framework

## Asennus

Asenna tarvittavat kirjastot VS Coden terminaalissa:

```bash
py -m pip install robotframework
py -m pip install robotframework-requests
```

VS Coden lisäosa: **RobotCode – Robot Framework Support**.

## Testien suorittaminen

Käynnistä ensin projekti.

Avaa terminaali projektin juurikansiossa.

**Kaikki testit:**

```bash
py -m robot robot-tests/
```

**Backend-testit:**

```bash
py -m robot robot-tests/backend/
```

**Frontend-testit:**

```bash
py -m robot robot-tests/frontend/
```

Frontend-testien suorittamista varten asenna lisäksi:

```bash
py -m pip install robotframework-browser
py -m Browser.entry init
```

## Testitulokset

Testien suorittamisen jälkeen muodostuvat:

- `report.html` – testiraportti
- `log.html` – testiloki
- `output.xml` – testitulokset