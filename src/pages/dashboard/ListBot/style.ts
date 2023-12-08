import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ListBotWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 15,

  '.navbar': {
    display: 'flex',
    alignItems: 'center',
    gap: 50,

    input: {
      width: '100%',
      border: 'none',
      outline: 'none',
      borderRadius: '5px',
      padding: '16px 10px',
    },
  },

  '.nav-size': {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    p: {
      width: 'max-content',
    },
  },

  th: {
    fontSize: 20,
    textAlign: 'center',
  },

  td: {
    fontSize: 18,
    textAlign: 'center',
  },

  button: {
    fontSize: 20,
    padding: '15px 40px',
  },
}));

export default ListBotWrapper;
