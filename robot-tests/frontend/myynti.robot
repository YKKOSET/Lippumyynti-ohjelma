*** Settings ***
Resource    resources/common.resource

Test Setup       Avaa sovellus
Test Teardown    Sulje selain

*** Test Cases ***

Myyntisivu avautuu onnistuneesti
    Go To    ${BASE_URL}/myynti

    Wait For Elements State
    ...    text=Myy liput
    ...    visible
    ...    timeout=15s

    ${url}=    Get Url
    Should Contain    ${url}    /myynti

Myyntisivun otsikko näkyy
    Avaa myyntisivu

    Wait For Elements State
    ...    text=Myy liput
    ...    visible

Tapahtuman pudotusvalikko löytyy
    Avaa myyntisivu

    Wait For Elements State
    ...    role=combobox[name="Tapahtuma"]
    ...    visible
    ...    timeout=10s

Esityskerran pudotusvalikko löytyy
    Avaa myyntisivu

    Wait For Elements State
    ...    role=combobox[name="Esityskerta"]
    ...    visible
    ...    timeout=10s

Tapahtuman pudotusvalikko avautuu
    Avaa myyntisivu

    Click
    ...    role=combobox[name="Tapahtuma"]

    Wait For Elements State
    ...    role=option[name="Kaikki tapahtumat"]
    ...    visible
    ...    timeout=10s

Myyntilista näkyy
    Avaa myyntisivu

    Wait For Elements State
    ...    text=Myyntilista
    ...    visible
    ...    timeout=10s

Poista valinnat painike näkyy
    Avaa myyntisivu

    Wait For Elements State
    ...    role=button[name="Poista valinnat"]
    ...    visible

Ostohistoria painike näkyy
    Avaa myyntisivu

    Wait For Elements State
    ...    role=button[name="Osto historia"]
    ...    visible

Teatteri Aave eläkeläislippu näkyy
    Avaa myyntisivu

    # Avataan tapahtuman pudotusvalikko
    Click
    ...    role=combobox[name="Tapahtuma"]

    # Valitaan Teatterin Aave
    Wait For Elements State
    ...    role=option[name="Teatterin Aave"]
    ...    visible
    ...    timeout=10s

    Click
    ...    role=option[name="Teatterin Aave"]

    # Tarkistetaan, että vähintään yksi eläkeläislippu löytyy
    Wait Until Keyword Succeeds    20s    500ms    Tarkista elakelaisliput


Keikkakeitaan esityskerta löytyy pudotusvalikosta
    Avaa myyntisivu

    # Avataan tapahtuman pudotusvalikko
    Click
    ...    role=combobox[name="Tapahtuma"]

    # Valitaan Keikkakeidas
    Wait For Elements State
    ...    role=option[name="Keikkakeidas"]
    ...    visible
    ...    timeout=10s

    Click
    ...    role=option[name="Keikkakeidas"]

    # Avataan esityskertojen pudotusvalikko
    Wait For Elements State
    ...    role=combobox[name="Esityskerta"]
    ...    visible
    ...    timeout=10s

    Click
    ...    role=combobox[name="Esityskerta"]

    # Tarkistetaan, että haluttu esityskerta löytyy listalta
    Wait For Elements State
    ...    role=option[name*="su 1.10. klo 13.00"]
    ...    visible
    ...    timeout=15s


Teatterin Aave lipun lisääminen ja poistaminen myyntilistalta
    Avaa myyntisivu

    # Valitaan tapahtumaksi Teatterin Aave
    Click
    ...    role=combobox[name="Tapahtuma"]

    Wait For Elements State
    ...    role=option[name="Teatterin Aave"]
    ...    visible
    ...    timeout=10s

    Click
    ...    role=option[name="Teatterin Aave"]

    # Odotetaan, että liput latautuvat
    Wait Until Keyword Succeeds    20s    500ms    Tarkista elakelaisliput

    # Tarkistetaan, että vähintään yksi lippu löytyy
    ${maara}=    Get Element Count
    ...    text=Sarjanumero
    Should Be True    ${maara} >= 1

    # Klikataan ensimmäisen lipun Myy lippu -painiketta
    Click
    ...    role=button[name="Myy lippu"] >> nth=0

    # Tarkistetaan, että lippu siirtyi myyntilistalle
    Wait For Elements State
    ...    text=Myyntilista (1)
    ...    visible
    ...    timeout=10s

    # Suorita maksu -painikkeen tulee ilmestyä
    Wait For Elements State
    ...    role=button[name*="Suorita maksu"]
    ...    visible
    ...    timeout=10s

    # Poistetaan lippu myyntilistalta
    Click
    ...    role=button[name="Poista"] >> nth=0

    # Tarkistetaan, että myyntilista on jälleen tyhjä
    Wait For Elements State
    ...    text=Myyntilista (0)
    ...    visible
    ...    timeout=10s

    # Tarkistetaan, ettei Suorita maksu -painike ole enää käytettävissä
    Get Attribute
    ...    role=button[name*="Suorita maksu"]
    ...    disabled


# Testit menivät läpi 19.11.2026 klo 21:50



*** Keywords ***

Avaa myyntisivu
    Go To    ${BASE_URL}/myynti

    Wait For Elements State
    ...    text=Myy liput
    ...    visible
    ...    timeout=15s

Tarkista elakelaisliput
    ${maara}=    Get Element Count
    ...    text=Eläkeläinen
    Should Be True    ${maara} >= 1