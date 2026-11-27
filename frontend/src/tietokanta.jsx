/* import axios from 'axios';

let url = 'http://localhost:8080/api';
const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

export const addTapahtuma = async (tapahtuma) => {
    try {
        const response = await axios.post(url + '/tapahtumat', tapahtuma, {
                headers: {
                    'Content-Type': 'application/json'},
                auth: {
                    username: username,
                    password: password
                }
            }
        );
        return response;
    } catch (error) {
        return {
            status: error.response?.status || error.code,
            message: 'Lisäys ei onnistunut: ' + error.message
        };
    }
};

 */
