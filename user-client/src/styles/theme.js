import { createTheme } from '@mui/material/styles';

const theme = createTheme({
   typography: {
      fontFamily: 'Helvetica',
   },
   palette: {
      primary: {
         main: '#2196F3',
         contrastText: '#ffffff' 
      },
      secondary: {
         main: '#f0f3f979',
      },
   },
});

export default theme;