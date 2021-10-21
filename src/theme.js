import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
  },
});

export const dark = createTheme({
  palette: {
    mode: 'dark'
  },
});

export default theme;