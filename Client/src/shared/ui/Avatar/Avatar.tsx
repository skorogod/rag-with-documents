import React from 'react';
import { Avatar as MuiAvatar, type AvatarProps as MuiAvatarProps } from '@mui/material';

export interface AvatarProps extends MuiAvatarProps {
  size?: 'small' | 'medium' | 'large';
  src?: string;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'medium',
  src,
  alt,
  sx,
  children,
  ...props
}) => {
  const sizeMap = {
    small: 32,
    medium: 40,
    large: 56,
  };

  return (
    <MuiAvatar
      src={src}
      alt={alt}
      sx={{
        width: sizeMap[size],
        height: sizeMap[size],
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiAvatar>
  );
};

Avatar.displayName = 'Avatar';