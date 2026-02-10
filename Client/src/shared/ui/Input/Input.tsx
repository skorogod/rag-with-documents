import React from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  variant = 'outlined',
  error,
  helperText,
  sx,
  ...props
}) => {
  return (
    <TextField
      variant={variant}
      error={error}
      helperText={helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx,
      }}
      {...props}
    />
  );
};

Input.displayName = 'Input';