// frontend/src/components/Dashboard/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
// Importaciones de MUI
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
// Iconos de Material-UI (ejemplos)
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import FeedbackIcon from '@mui/icons-material/Feedback';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';

const drawerWidth = 240; // Ancho del sidebar

function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: 'secondary.main', color: 'white' },
            }}
        >
            <Toolbar /> {/* Espacio para el AppBar */}
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/dashboard">
                            <ListItemIcon sx={{ color: 'white' }}><DashboardIcon /></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/clientes">
                            <ListItemIcon sx={{ color: 'white' }}><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Gestión de Clientes" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/facturas">
                            <ListItemIcon sx={{ color: 'white' }}><ReceiptIcon /></ListItemIcon>
                            <ListItemText primary="Gestión de Facturas" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/productos">
                            <ListItemIcon sx={{ color: 'white' }}><InventoryIcon /></ListItemIcon>
                            <ListItemText primary="Gestión de Productos" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/pqrs">
                            <ListItemIcon sx={{ color: 'white' }}><FeedbackIcon /></ListItemIcon>
                            <ListItemText primary="PQRS" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/metodospago">
                            <ListItemIcon sx={{ color: 'white' }}><PaymentIcon /></ListItemIcon>
                            <ListItemText primary="Métodos de Pago" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/configuracion">
                            <ListItemIcon sx={{ color: 'white' }}><SettingsIcon /></ListItemIcon>
                            <ListItemText primary="Configuración de Sistema" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/usuarios">
                            <ListItemIcon sx={{ color: 'white' }}><GroupIcon /></ListItemIcon>
                            <ListItemText primary="Gestión de Usuarios y Roles" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}

export default Sidebar;
