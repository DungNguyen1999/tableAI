import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ConfigTimeWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 15,

  th: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },

  td: {
    fontSize: 18,
    textAlign: 'center',
    padding: '16px 40px',
  },

  input: {
    border: 'none',
    outline: 'none',
    borderRadius: '5px',
    padding: '10px',
  },

  button: {
    fontSize: 20,
    padding: '15px 40px',
  }
}));

export default ConfigTimeWrapper;
