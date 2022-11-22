import React from 'react';
import {
  withStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { withTheme } from '@emotion/react';

export const BootstrapButton = withStyles({
    root: {
      textTransform: 'none',
      color: '#ffffff',
      padding: '6px 12px',
      lineHeight: 1.5,
      background: 'linear-gradient(45deg, rgb(82, 150, 94) 30%, rgb(113, 201, 128) 90%)',
      boxShadow: '0 3px 5px 0 rgba(0, 0, 0, 0.16)',
      cursor: 'pointer',
      fontFamily: 'Segoe UI',
      borderRadius: '10px',
      '&:hover': {
        background: 'linear-gradient(45deg, rgb(103, 185, 118) 30%, rgb(182, 233, 135) 90%)',
      },
      '&:active': {
        boxShadow: 'none',
        background: 'linear-gradient(45deg, rgb(82, 150, 94) 30%, rgb(182, 233, 135) 90%)',
      }
    },
  })(Button);
  


