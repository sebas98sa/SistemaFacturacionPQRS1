// frontend/src/theme/theme.js
import { createTheme } from '@mui/material/styles';
import { blue, grey, red } from '@mui/material/colors'; // Importa colores de Material-UI

// Define tu tema personalizado
const theme = createTheme({
    palette: {
        primary: {
            main: blue[600], // Un tono de azul para el color principal (ej. botones, app bar)
        },
        secondary: {
            main: grey[800], // Un tono de gris oscuro para elementos secundarios (ej. sidebar)
        },
        error: {
            main: red[500], // Color para mensajes de error
        },
        background: {
            default: grey[100], // Fondo claro para la aplicación
            paper: '#FFFFFF', // Fondo para tarjetas, formularios
        },
    },
    typography: {
        fontFamily: [
            'Roboto', // Fuente predeterminada de Material Design
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
            color: grey[900],
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            color: grey[800],
        },
        // Puedes definir más estilos de tipografía aquí
    },
    components: {
        // Personalizaciones globales para componentes MUI
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Bordes más redondeados para botones
                    textTransform: 'none', // Evita que el texto de los botones sea todo mayúsculas
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiPaper: { // Para Card, Dialog, etc.
            styleOverrides: {
                root: {
                    borderRadius: 12, // Bordes redondeados para tarjetas y paneles
                },
            },
        },
    },
    shape: {
        borderRadius: 8, // Radio de borde predeterminado para muchos componentes
    },
});

export default theme;
