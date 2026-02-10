import React from 'react';
import { Chip as MuiChip, type ChipProps as MuiChipProps } from '@mui/material';

export interface ChipProps extends MuiChipProps {
  variant?: 'filled' | 'outlined';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  size?: 'small' | 'medium';
  onDelete?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  variant = 'filled',
  color = 'default',
  size = 'medium',
  onDelete,
  sx,
  ...props
}) => {
  return (
    <MuiChip
      variant={variant}
      color={color}
      size={size}
      onDelete={onDelete}
      sx={{
        borderRadius: 1,
        ...sx,
      }}
      {...props}
    />
  );
};

Chip.displayName = 'Chip';