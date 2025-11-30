import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Button,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any, row?: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  getRowId: (row: T) => number | string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  loading = false,
  onEdit,
  onDelete,
  onView,
  getRowId,
  emptyMessage = 'Veri bulunamadı',
  emptyActionLabel,
  onEmptyAction,
}: DataTableProps<T>) {
  const getCellValue = (row: T, column: Column<T>): React.ReactNode => {
    const value = (row as any)[column.id];
    
    if (column.format) {
      return column.format(value, row);
    }
    
    return value ?? '-';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (rows.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
        {emptyActionLabel && onEmptyAction && (
          <Button variant="contained" onClick={onEmptyAction} sx={{ mt: 2 }}>
            {emptyActionLabel}
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={String(column.id)}
                align={column.align || 'left'}
                style={{ minWidth: column.minWidth }}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  bgcolor: 'background.paper',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                }}
              >
                {column.label}
              </TableCell>
            ))}
            {(onEdit || onDelete || onView) && (
              <TableCell
                align="right"
                style={{ minWidth: 120 }}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  bgcolor: 'background.paper',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                }}
              >
                İşlemler
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const rowId = getRowId(row);
            return (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={rowId}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'scale(1.01)',
                  },
                  '&:nth-of-type(even)': {
                    bgcolor: 'action.selected',
                  },
                }}
              >
                {columns.map((column) => {
                  return (
                    <TableCell
                      key={String(column.id)}
                      align={column.align || 'left'}
                      sx={{
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {getCellValue(row, column)}
                    </TableCell>
                  );
                })}
                {(onEdit || onDelete || onView) && (
                  <TableCell
                    align="right"
                    sx={{
                      py: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box display="flex" gap={0.5} justifyContent="flex-end">
                      {onView && (
                        <Tooltip title="Görüntüle">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onView(row)}
                            sx={{
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="Düzenle">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(row)}
                            sx={{
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Sil">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(row)}
                            sx={{
                              '&:hover': {
                                bgcolor: 'error.main',
                                color: 'error.contrastText',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
