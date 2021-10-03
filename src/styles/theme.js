// import { createMuiTheme } from '@mui/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = StyledEngineProvider({
// const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});
export default theme;