import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ListItemIcon from '@mui/material/ListItemIcon';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CheckIcon from '@mui/icons-material/Check';

import '@fontsource/redaction';

// OSOITE: vaihda omaksi (tapahtumat samasta osoitteesta kuin Tapahtumakortin tiedot)
const API_BASE = 'http://localhost:8080/api';

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
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  // Lipunmyynnin tiedot
  const [tapahtumat, setTapahtumat] = useState([]);
  const [liput, setLiput] = useState([]);
  const [lataa, setLataa] = useState(false);
  const [virhe, setVirhe] = useState('');

  // Navigoinnin mukana tullut tapahtuma
    const navigoituTapahtuma = location.state?.tapahtuma ?? null;

  // Haetaan tapahtumat ja liput, kun "Myy lippuja" -näkymä avataan
  useEffect(() => {
    if (location.pathname !== '/myynti') return;

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
  }, [location.pathname]);

  //menu auki:
  const menuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  }

  //menu kiinni:
  const menuClose = () => {
    setAnchorEl(null);
  }


  const menu =
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={menuClose}>

      <MenuItem onClick={menuClose} component={Link} to='/'>
        <ListItemIcon><HomeIcon/></ListItemIcon>
        <ListItemText primary='Etusivu' />
      </MenuItem>

      <MenuItem onClick={menuClose} component={Link} to='/tarkistus'>
        <ListItemIcon><CheckIcon/></ListItemIcon>
        <ListItemText primary='Tarkistus' />
      </MenuItem>

      <MenuItem onClick={menuClose} component={Link} to='/myynti'>
        <ListItemIcon><PointOfSaleIcon/></ListItemIcon>
        <ListItemText primary='Myynti' />
      </MenuItem>

    </Menu>;


  return (
    <>
      <Box sx={{
        top: 0, left: 0, display: 'flex', alignItems: 'center', p: 1, bgcolor: 'secondary.main', color: 'secondary.contrastText'
      }}>
        <IconButton onClick={menuOpen} sx={{ color: 'inherit' }}>
          <MenuIcon />
        </IconButton>

        {menu}

        <Typography sx={{ fontFamily: '"Redaction", serif'}}>TicketGuru</Typography>
      </Box>

      <Box>
        <Outlet context={{ tapahtumat, liput, lataa, virhe, navigoituTapahtuma }} />
      </Box>
    </>
  );
}

export default Menuvalikko;