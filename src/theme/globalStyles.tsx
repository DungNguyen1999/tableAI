// @mui
import { GlobalStyles as MUIGlobalStyles } from '@mui/material';

// ----------------------------------------------------------------------

export default function GlobalStyles() {
  const inputGlobalStyles = (
    <MUIGlobalStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        '#__next': {
          width: '100%',
          height: 'auto',
        },
        'h1, h2, h3, h4, h5, h6, p, br, ul, ol, li, tr, th, td': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        'ul, ol, li': {
          listStyle: 'none',
        },
        a: {
          textDecoration: 'none',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
      }}
    />
  );

  return inputGlobalStyles;
}
