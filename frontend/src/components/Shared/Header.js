// frontend/src/components/Shared/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Importaciones de MUI
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout'; // Icono de logout

// Importa tu logo si lo tienes, o usa el predeterminado
import logo from '../../logo.svg';

function Header({ title }) {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail');

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {userEmail && (
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            Bienvenido, {userEmail}!
                        </Typography>
                    )}
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Cerrar Sesión
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
