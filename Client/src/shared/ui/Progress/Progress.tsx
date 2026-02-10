import React from 'react';
import { CircularProgress, LinearProgress, Box } from '@mui/material';

export interface ProgressProps {
  variant?: 'circular' | 'linear';
  size?: number;
  thickness?: number;
  value?: number;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
}

export const Progress: React.FC<ProgressProps> = ({
  variant = 'circular',
  size = 40,
  thickness = 3.6,
  value,
  color = 'primary',
}) => {
  if (variant === 'circular') {
    return (
      <CircularProgress
        size={size}
        thickness={thickness}
        value={value}
        color={color}
      />
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        variant={value !== undefined ? 'determinate' : 'indeterminate'}
        value={value}
        color={color}
        sx={{
          height: thickness,
          borderRadius: thickness / 2,
        }}
      />
    </Box>
  );
};

Progress.displayName = 'Progress';