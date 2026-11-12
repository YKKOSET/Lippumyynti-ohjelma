import { useState } from 'react';

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


function Menuvalikko() {

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);

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
        {value === 2 && <TicketSales />}

      </Box>

    </>
  );

}

export default Menuvalikko;
