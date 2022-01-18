import { fonts } from './fonts';
import { colors } from './colors';

const composedTheme = {
  fonts,
  commons: {
    button: {
      sizes: {
        large: {
          width: '100%',
          padding: '12px 18px',
          lineHeight: '20px',
          iconWidth: '20px',
        },
        small: {
          padding: '4px 20px',
        },
        medium: {
          width: '60%',
          padding: '12px 18px',
          lineHeight: '20px',
          iconWidth: '20px',
        },
      },
      primary: {
        borderRadius: '4px',
        backgroundPressed: 'linear-gradient(to right, #A93B36, #E52820)',
        background: '#E52820',
        color: '#FFFFFF'
      }
    }
  },
  colors: {
    ...colors,
  },
};

export default composedTheme;
