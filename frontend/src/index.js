import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'; // Si sigues usando Bootstrap CSS

// Importaciones de MUI para el tema
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Para un reinicio CSS consistente
import theme from './theme/theme'; // Importa tu tema

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* Envuelve la aplicación con ThemeProvider y CssBaseline */}
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Proporciona un reinicio CSS elegante y consistente */}
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

reportWebVitals(); // Asegúrate de que esta línea esté solo una vez al final
