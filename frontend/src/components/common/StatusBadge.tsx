import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusBadgeProps {
  status: string;
  size?: ChipProps['size'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const getStatusConfig = (status: string) => {
    const statusUpper = status.toUpperCase();
    
    // Order statuses
    if (statusUpper === 'PENDING') {
      return { label: 'Beklemede', color: 'warning' as const };
    }
    if (statusUpper === 'CONFIRMED') {
      return { label: 'Onaylandı', color: 'info' as const };
    }
    if (statusUpper === 'PROCESSING') {
      return { label: 'İşleniyor', color: 'primary' as const };
    }
    if (statusUpper === 'SHIPPED') {
      return { label: 'Kargoda', color: 'info' as const };
    }
    if (statusUpper === 'DELIVERED') {
      return { label: 'Teslim Edildi', color: 'success' as const };
    }
    if (statusUpper === 'CANCELLED') {
      return { label: 'İptal Edildi', color: 'error' as const };
    }
    if (statusUpper === 'REFUNDED') {
      return { label: 'İade Edildi', color: 'default' as const };
    }
    
    // Payment statuses
    if (statusUpper === 'COMPLETED') {
      return { label: 'Tamamlandı', color: 'success' as const };
    }
    if (statusUpper === 'FAILED') {
      return { label: 'Başarısız', color: 'error' as const };
    }
    // REFUNDED and CANCELLED for payments handled above in order statuses section
    // But we need to ensure they work for payments too - they're already handled
    
    // Default
    return { label: status, color: 'default' as const };
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant="outlined"
      sx={{
        fontWeight: 600,
        borderRadius: 2,
        borderWidth: 2,
        '&:hover': {
          transform: 'scale(1.05)',
        },
        transition: 'all 0.2s ease',
      }}
    />
  );
};

export default StatusBadge;
