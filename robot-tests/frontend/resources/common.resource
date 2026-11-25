*** Settings ***
Library    Browser

*** Variables ***
${BASE_URL}    http://localhost:5173

*** Keywords ***
Avaa sovellus
    New Browser    chromium    headless=False
    New Context
    New Page    ${BASE_URL}

Sulje selain
    Close Browser

Odota etusivun latautumista
    Wait For Elements State
    ...    text=Tapahtumat
    ...    visible
    ...    timeout=30s