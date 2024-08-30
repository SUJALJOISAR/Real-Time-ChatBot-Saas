import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
// import { MantineProvider } from '@mantine/core';
// import '@mantine/core/styles.css';
import {Toaster} from 'react-hot-toast';
import "./index.css"; //because whatever we write last will affect the styling most
import axios from 'axios';


axios.defaults.baseURL = "http://127.0.0.1:5000/api/v1";
axios.defaults.withCredentials = true;//will allow to set the cookies from the backend and exchanging the cookies with backend


const muiTheme = createTheme({
  typography: {
    fontFamily: "Roboto Slab, Serif",
    allVariants: { color: "white" },
  },
});

// const mantineTheme = {
//   // Customize Mantine theme here
//   colorScheme: 'dark',
// };

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      {/* <MantineProvider> */}
        <ThemeProvider theme={muiTheme}>
          <Toaster position="top-right"/>
          <App />
        </ThemeProvider>
      {/* </MantineProvider> */}
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
