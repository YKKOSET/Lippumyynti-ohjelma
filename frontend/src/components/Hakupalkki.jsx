import { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { api } from './LippuTietokanta';

const HAKU_PITUUS = 36;

export default function Hakupalkki({ onLoytyi }) {
  const [arvo, setArvo] = useState('');
  const [lataa, setLataa] = useState(false);
  const [virhe, setVirhe] = useState('');
  const [onnistui, setOnnistui] = useState(false);

  useEffect(() => {
    if (arvo.length < HAKU_PITUUS) {
      setVirhe('');
      setOnnistui(false);
      setLataa(false);
      onLoytyi(null);
      return;
    }

    const controller = new AbortController();

    async function haeLippu() {
      setLataa(true);
      setVirhe('');
      setOnnistui(false);
      try {
        const data = await api.haeLippu(arvo, controller.signal);

        if (!data) {
          setVirhe('Lippua ei löytynyt');
          onLoytyi(null);
          return;
        }

        onLoytyi(data);
        setOnnistui(true);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Haun virhe:', err);
        setVirhe('Haku epäonnistui');
        onLoytyi(null);
      } finally {
        if (!controller.signal.aborted) setLataa(false);
      }
    }

    haeLippu();

    return () => controller.abort();
  }, [arvo]);

  return (
    <TextField
      size="small"
      label="Sarjanumero"
      placeholder={`Kirjoita ${HAKU_PITUUS} merkkiä pitkä sarjanumero`}
      value={arvo}
      onChange={(e) => setArvo(e.target.value.trim())}
      error={Boolean(virhe)}
      color={onnistui ? 'success' : 'primary'}
      focused={onnistui || undefined}
      helperText={virhe || (onnistui ? 'Lippu löytyi!' : ' ')}
      sx={{ ml: 3, mt: 2, width: 500 }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {lataa ? (
                <CircularProgress size={18} />
              ) : (
                arvo && (
                  <IconButton size="small" onClick={() => setArvo('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )
              )}
            </InputAdornment>
          ),
        },
      }}
    />
  );
}