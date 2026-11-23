*** Settings ***
Resource    resources/common.resource

Test Setup       Avaa sovellus
Test Teardown    Sulje selain

*** Variables ***
${LIPUN_SARJANUMERO}    00220000-0000-3230-0070-000000000003


*** Test Cases ***

Tarkistussivu avautuu onnistuneesti
    Go To    ${BASE_URL}/tarkistus

    Wait For Elements State
    ...    text=Hae lippu sarjanumerolla:
    ...    visible
    ...    timeout=15s

    ${url}=    Get Url
    Should Contain    ${url}    /tarkistus


Sarjanumeron hakukenttä löytyy
    Avaa tarkistussivu

    Wait For Elements State
    ...    role=textbox[name="Sarjanumero"]
    ...    visible
    ...    timeout=10s


Lipun haku onnistuu
    Avaa tarkistussivu

    Fill Text
    ...    role=textbox[name="Sarjanumero"]
    ...    ${LIPUN_SARJANUMERO}

    Wait For Elements State
    ...    text=Lippu löytyi!
    ...    visible
    ...    timeout=30s

Lipun haku väärin muotoilulla sarjanumerolla ei onnistu
    Avaa tarkistussivu

    Fill Text
    ...    role=textbox[name="Sarjanumero"]
    ...    a12frg65zds65fxg1c6xv586095dfgaedr465ujhyt

    Wait For Elements State
    ...    text=Haku epäonnistui
    ...    visible
    ...    timeout=30s

Lipun haku väärällä sarjanumerolla ei onnistu
    Avaa tarkistussivu

    Fill Text
    ...    role=textbox[name="Sarjanumero"]
    ...    00220000-0000-3230-1170-000000000088

    Wait For Elements State
    ...    text=Lippua ei löytynyt
    ...    visible
    ...    timeout=30s


Lipun tiedot näkyvät haun jälkeen
    Avaa tarkistussivu

    Fill Text
    ...    role=textbox[name="Sarjanumero"]
    ...    ${LIPUN_SARJANUMERO}

    Wait For Elements State
    ...    text=Lippu löytyi!
    ...    visible
    ...    timeout=30s

    Wait For Elements State
    ...    role=textbox[name="Sarjanumero"]
    ...    visible

    Wait For Elements State
    ...    text=Normaalihintainen
    ...    visible
    ...    timeout=10s


Lipun tilavalinnan painike löytyy
    Avaa tarkistussivu

    Fill Text
    ...    role=textbox[name="Sarjanumero"]
    ...    ${LIPUN_SARJANUMERO}

    Wait For Elements State
    ...    text=Lippu löytyi!
    ...    visible
    ...    timeout=30s

    Wait For Elements State
    ...    role=switch
    ...    visible
    ...    timeout=10s

Lipun tilan vaihtaminen ja palauttaminen
    Avaa tarkistussivu

    # Haetaan lippu sarjanumerolla
    Fill Text
    ...    role=textbox[name="Sarjanumero"]
    ...    ${LIPUN_SARJANUMERO}

    # Odotetaan, että lippu löytyy
    Wait For Elements State
    ...    text=Lippu löytyi!
    ...    visible
    ...    timeout=30s

    # Odotetaan, että kytkin löytyy
    Wait For Elements State
    ...    role=switch
    ...    visible
    ...    timeout=10s

    # Varmistetaan alkuperäinen tila: käyttämätön
     ${alkutila}=    Get Property
    ...    role=switch
    ...    checked

    Should Be Equal    ${alkutila}    ${False}

    # Vaihdetaan lippu käytetyksi
    Click
    ...    role=switch

    # Odotetaan ilmoituksen kertovan tallennuksen onnistuneen
    Wait For Elements State
    ...    text=Tiedot tallennettu
    ...    visible
    ...    timeout=15s

    # Odotetaan tilan muuttuvan
    ${teksti}=    Evaluate JavaScript
    ...    ${None}
    ...    () => window.getComputedStyle(document.querySelector('.MuiSwitch-track'), '::before').content

    Should Be Equal    ${teksti}    "KÄYTETTY"

    # Tarkistetaan, että kytkin on päällä
    ${tila}=    Get Property
    ...    role=switch
    ...    checked

    Should Be Equal    ${tila}    ${True}

    # Vaihdetaan takaisin käyttämättömäksi
    Click
    ...    role=switch

    # Odotetaan ilmoituksen kertovan tallennuksen onnistuneen
    Wait For Elements State
    ...    text=Tiedot tallennettu
    ...    visible
    ...    timeout=15s

    # Tarkistetaan palautunut tila
    ${teksti}=    Evaluate JavaScript
    ...    ${None}
    ...    () => window.getComputedStyle(document.querySelector('.MuiSwitch-track'), '::after').content

    Should Be Equal    ${teksti}    "KÄYTTÄMÄTÖN"

    # Tarkistetaan, että kytkin on pois päältä
    ${lopputila}=    Get Property
    ...    role=switch
    ...    checked

    Should Be Equal    ${lopputila}    ${False}


# 19.11.2026 klo 23.15 testit menevät läpi



*** Keywords ***

Avaa tarkistussivu
    Go To    ${BASE_URL}/tarkistus

    Wait For Elements State
    ...    text=Hae lippu sarjanumerolla:
    ...    visible
    ...    timeout=15s