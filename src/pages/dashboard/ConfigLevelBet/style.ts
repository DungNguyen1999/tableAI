import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const LevelBetWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 15,

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

export default LevelBetWrapper;
