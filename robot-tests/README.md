# Robot Framework

## Asennus

Asenna tarvittavat kirjastot VS Coden terminaalissa:

```bash
py -m pip install robotframework
py -m pip install robotframework-requests
```

Frontend-testien suorittamista varten asenna lisäksi:

```bash
py -m pip install robotframework-browser
py -m Browser.entry init
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

**Yksittäinen testitiedosto:**

```bash
py -m robot robot-tests/frontend/myynti.robot
```

**Yksittäinen testi:**

```bash
python -m robot --test "Keikkakeitaan esityskerta löytyy pudotusvalikosta" robot-tests/frontend/myynti.robot 
```

## Testitulokset

Testien suorittamisen jälkeen muodostuvat:

- `report.html` – testiraportti
- `log.html` – testiloki
- `output.xml` – testitulokset