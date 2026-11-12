*** Settings ***
Library    RequestsLibrary

*** Variables ***
${BASE_URL}    http://localhost:8080

*** Test Cases ***
Tapahtumien haku onnistuu
    ${response}=    GET    ${BASE_URL}/api/tapahtumat
    Should Be Equal As Integers    ${response.status_code}    200