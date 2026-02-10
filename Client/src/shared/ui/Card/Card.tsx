import React from 'react';
import { Paper, type PaperProps } from '@mui/material';

export interface CardProps extends PaperProps {
  variant?: 'elevation' | 'outlined';
  elevation?: number;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevation',
  elevation = 1,
  padding = 2,
  sx,
  children,
  ...props
}) => {
  return (
    <Paper
      variant={variant}
      elevation={elevation}
      sx={{
        borderRadius: 2,
        p: padding,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

Card.displayName = 'Card';