import React from 'react';
import { IconButton as MuiIconButton, type IconButtonProps as MuiIconButtonProps } from '@mui/material';

export interface IconButtonProps extends MuiIconButtonProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
}

export const IconButton: React.FC<IconButtonProps> = ({
  size = 'medium',
  color = 'default',
  sx,
  children,
  ...props
}) => {
  return (
    <MuiIconButton
      size={size}
      color={color}
      sx={{
        borderRadius: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiIconButton>
  );
};

IconButton.displayName = 'IconButton';