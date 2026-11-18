import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';

import Hakupalkki from './Hakupalkki';
import TicketSales from './TicketSales';
import Etusivu from './Etusivu';
import Tarkistus from './Tarkistus';

// OSOITE: vaihda omaksi (tapahtumat samasta osoitteesta kuin Tapahtumakortin tiedot)
const API_BASE = 'https://lippumyynti-ohjelma.onrender.com/api';

const URLS = {
  tapahtumat: `${API_BASE}/tapahtumat`,
  liput: `${API_BASE}/liput`,
};

// Basic-tunnistautuminen (poista, jos API ei vaadi sitä)
const username = import.meta.env.VITE_LIPPU_USER;
const password = import.meta.env.VITE_LIPPU_PASSWORD;

// Hakee osoitteen ja palauttaa aina taulukon
const haeJson = async (url, signal) => {
  const res = await fetch(url, {
    signal,
    headers: { Authorization: 'Basic ' + btoa(`${username}:${password}`) },
  });
  if (!res.ok) throw new Error(`Haku epäonnistui (${url}): ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};


function Menuvalikko() {

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);

  // Lipunmyynnin tiedot
  const [tapahtumat, setTapahtumat] = useState([]);
  const [liput, setLiput] = useState([]);
  const [lataa, setLataa] = useState(false);
  const [virhe, setVirhe] = useState('');

  // Haetaan tapahtumat ja liput, kun "Myy lippuja" -näkymä avataan
  useEffect(() => {
    if (value !== 2) return;

    const ac = new AbortController();

    const haeKaikki = async () => {
      setLataa(true);
      setVirhe('');
      try {
        const [t, l] = await Promise.all([
          haeJson(URLS.tapahtumat, ac.signal),
          haeJson(URLS.liput, ac.signal),
        ]);
        setTapahtumat(t);
        setLiput(l);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Tietojen haku epäonnistui:', err);
        setVirhe('Tietojen haku epäonnistui');
      } finally {
        if (!ac.signal.aborted) setLataa(false);
      }
    };

    haeKaikki();
    return () => ac.abort();
  }, [value]);

  //menu auki:
  const menuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  }

  //menu kiinni:
  const menuClose = () => {
    setAnchorEl(null);
  }

  //vaihda näkymä:
  const handleChange = (val) => {
    setValue(val);
    menuClose();
  }

  const menu =
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => menuClose()}>

      <MenuItem onClick={() => handleChange(0)}>
        <ListItemText primary='Etusivu' />
      </MenuItem>

      <MenuItem onClick={() => handleChange(1)}>
        <ListItemText primary='Tarkistus' />
      </MenuItem>

      <MenuItem onClick={() => handleChange(2)}>
        <ListItemText primary='Myy lippuja' />
      </MenuItem>

    </Menu>;


  return (
    <>
      <Box sx={{ top: 0, left: 0, display: 'flex', alignItems: 'center', p: 1 }}>
        <IconButton onClick={(e) => menuOpen(e)}>
          <MenuIcon />
        </IconButton>
        {menu}
        <Typography>TicketGuru</Typography>
      </Box>
      <Box>
        {value === 0 && <Etusivu />}
        {value === 1 && <Tarkistus />}
        {value === 2 && (
          <TicketSales
            tapahtumat={tapahtumat}
            liput={liput}
            lataa={lataa}
            virhe={virhe}
          />
        )}

      </Box>

    </>
  );

}

export default Menuvalikko;