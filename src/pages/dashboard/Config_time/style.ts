import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ConfigTimeWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',

  '.attribute-content': {
    display: 'flex',
  },
}));
