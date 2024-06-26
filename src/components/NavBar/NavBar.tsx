import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import React from "react";
import "./NavBar.css"
import { useNavigate } from "react-router-dom";

const pages = [{ label: 'Ajouter un événement', link: '/addEvent' }, { label: 'Liste des événement', link: '/' }, { label: 'Mes événements', link: '/myEvents '}];
const settings = [{ label: 'Déconnexion' }];

interface NavBarProps {
  isConnected: Boolean
  setIsConnected: (value: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({ isConnected = false, setIsConnected }) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    setIsConnected(false)
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
      });
      console.log(response)
      if (response.ok) {
          localStorage.removeItem("userId")
          localStorage.removeItem("expirationDate")
          setIsConnected(false)
          navigate("/login");
      }
    } catch (error) {
        console.error(error);
    }
  }

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="a" href="/"sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700,letterSpacing: '.0.5rem', color: 'inherit', textDecoration: 'none', }} >
            EventManager
          </Typography>
          {isConnected ?
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
              </IconButton>

              <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left',}} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left',}} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'none' }, }}>
                {pages.map((page) => (
                  <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                    <Typography component="a" href={page.link} textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            : <></>
          }
          <Typography variant="h5" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.0.5rem', color: 'inherit', textDecoration: 'none', }}>
            EventManager
          </Typography>
          {isConnected ?
          <>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button component="a" href={page.link} key={page.label} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton color="inherit" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                {settings.map((setting) => (
                  <MenuItem key={setting.label} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={handleLogout}>{setting.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </>
            : 
            <></>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;