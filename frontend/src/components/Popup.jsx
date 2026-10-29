import Snackbar from '@mui/material/Snackbar';

function Popup({ showPopUp, setShowPopUp }) {
    return (
        <Snackbar
            open={showPopUp}
            autoHideDuration={2000}
            onClose={() => setShowPopUp(false)}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            message="Tiedot tallennettu!"
            slotProps={{
                content: {
                    sx: {
                        backgroundColor: 'success.main',
                        color: 'success.contrastText',
                        justifyContent: 'center',
                        textAlign: 'center',
                    },
                },
            }}
        />
    )
}

export default Popup;