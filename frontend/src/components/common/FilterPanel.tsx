import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Button, Paper } from '@mui/material';
import { Clear } from '@mui/icons-material';

export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
}

interface FilterPanelProps {
  filters: Filter[];
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = filters.some((filter) => filter.value !== '');

  return (
    <Paper
      sx={{
        p: 2.5,
        mb: 2,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box display="flex" gap={2} alignItems="flex-end" flexWrap="wrap">
        {filters.map((filter) => (
          <FormControl
            key={filter.key}
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              },
            }}
          >
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={filter.value}
              label={filter.label}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
            >
              {filter.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
        {hasActiveFilters && (
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={onClearFilters}
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Filtreleri Temizle
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default FilterPanel;
