*** Settings ***
Resource    resources/common.resource

Test Setup       Avaa sovellus
Test Teardown    Sulje selain

*** Test Cases ***

Etusivu avautuu onnistuneesti
    Odota etusivun latautumista

    ${url}=    Get Url
    Should Be Equal    ${url}    ${BASE_URL}/

Tapahtumien otsikko näkyy
    Odota etusivun latautumista

    Wait For Elements State
    ...    text=Tapahtumat
    ...    visible

Tapahtumakortteja näytetään
    Odota etusivun latautumista

    ${maara}=    Get Element Count
    ...    text=Näytä lisää

    Should Be True    ${maara} > 0

Hakukenttä löytyy
    Odota etusivun latautumista

    Get Element States
    ...    role=textbox[name="Hae tapahtumaa nimellä"]
    ...    contains
    ...    visible

Tuntemattoman tapahtuman haku näyttää ilmoituksen
    Odota etusivun latautumista

    Fill Text
    ...    role=textbox[name="Hae tapahtumaa nimellä"]
    ...    tuntematontapahtumatralalaa

    Wait For Elements State
    ...    text=Ei tapahtumia.
    ...    visible

Tapahtuman hakeminen näyttää oikean tuloksen
    Odota etusivun latautumista

    Click    
    ...    role=textbox[name*="Hae tapahtumaa nimellä"i]
    Fill Text    
    ...    role=textbox[name*="Hae tapahtumaa nimellä"i]    
    ...    aave

    Wait For Elements State
    ...    text=Teatterin aave
    ...    visible
    ...    timeout=10s

    ${maara}=    Get Element Count
    ...    text=Teatterin aave

    Should Be Equal As Integers    ${maara}    1

Kahden tapahtuman haku
    Odota etusivun latautumista

    Click    
    ...    role=textbox[name*="Hae tapahtumaa nimellä"i]
    Fill Text    
    ...    role=textbox[name*="Hae tapahtumaa nimellä"i]    
    ...    aa

    Wait For Elements State
    ...    text=Teatterin aave
    ...    visible
    ...    timeout=10s

    Wait For Elements State
    ...    text=Vantaan kirjamessut
    ...    visible
    ...    timeout=10s

    ${aave}=    Get Element Count
    ...    text=Teatterin aave

    ${messut}=    Get Element Count
    ...    text=Vantaan kirjamessut

    Should Be Equal As Integers    ${aave}    1
    Should Be Equal As Integers    ${messut}    1


Tapahtuman haku, myy lippu ja siirry myyntiin
    Odota etusivun latautumista
    
    Click    
    ...    role=textbox[name*="Hae tapahtumaa nimellä"i]
    Fill Text    
    ...    role=textbox[name*="Hae tapahtumaa nimellä"i]    
    ...    aave
    Click
    ...    text=Näytä lisää
    Click
    ...    button.MuiButton-contained:has-text("Myy lippuja")
    # Tarkistetaan siirtyminen myynti-sivulle
    ${url}=    Get Url
    Should Contain    ${url}    /myynti
    # Tarkistetaan myyntisivun otsikko
    Wait For Elements State
    ...    text=Myy liput
    ...    visible
    ...    timeout=10s
    # Odotetaan, että tapahtuman pudotusvalikko ilmestyy
    Wait For Elements State
    ...    role=combobox[name="Tapahtuma"]
    ...    visible
    ...    timeout=10s
    # Odotetaan, että React päivittää pudotusvalikkoon oikean tapahtuman
    Wait Until Keyword Succeeds    10s    200ms    Tarkista valittu tapahtuma
    

# 23.11.2026 13:00 nämä testit menevät läpi






*** Keywords ***

Tarkista valittu tapahtuma

    ${valittu}=    Get Text
    ...    role=combobox[name="Tapahtuma"]

    Should Be Equal    ${valittu}    Teatterin Aave

