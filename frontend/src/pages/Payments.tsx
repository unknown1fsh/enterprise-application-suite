import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { paymentService, Payment, PaymentRequest } from '../services/paymentService';
import DataTable, { Column } from '../components/common/DataTable';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import StatusBadge from '../components/common/StatusBadge';
import { PAYMENT_STATUSES, PAYMENT_METHODS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentRequest>({
    orderId: 0,
    userId: 0,
    amount: 0,
    paymentMethod: 'CREDIT_CARD',
  });
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.getAll();
      if (response.data.success) {
        setPayments(response.data.data.content || response.data.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ödemeler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setSelectedPayment(null);
    setFormData({
      orderId: 0,
      userId: 0,
      amount: 0,
      paymentMethod: 'CREDIT_CARD',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPayment(null);
    setFormData({
      orderId: 0,
      userId: 0,
      amount: 0,
      paymentMethod: 'CREDIT_CARD',
    });
  };

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedPayment(null);
  };

  const handleStatusClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status);
    setStatusOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedPayment?.id) return;
    try {
      setError(null);
      await paymentService.updateStatus(selectedPayment.id, newStatus);
      setSuccess('Ödeme durumu güncellendi');
      setStatusOpen(false);
      setSelectedPayment(null);
      loadPayments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Durum güncellenirken hata oluştu');
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      
      if (formData.orderId <= 0) {
        setError('Sipariş ID gereklidir');
        return;
      }
      if (formData.userId <= 0) {
        setError('Kullanıcı ID gereklidir');
        return;
      }
      if (formData.amount <= 0) {
        setError('Tutar 0\'dan büyük olmalıdır');
        return;
      }

      await paymentService.process(formData);
      setSuccess('Ödeme başarıyla işlendi');
      handleClose();
      loadPayments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ödeme işlenirken hata oluştu');
    }
  };

  const getPaymentMethodLabel = (method: string): string => {
    const methodLabels: { [key: string]: string } = {
      CREDIT_CARD: 'Kredi Kartı',
      DEBIT_CARD: 'Banka Kartı',
      PAYPAL: 'PayPal',
      BANK_TRANSFER: 'Banka Havalesi',
      CASH_ON_DELIVERY: 'Kapıda Ödeme',
    };
    return methodLabels[method] || method;
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id?.toString().includes(searchTerm) ||
      payment.orderId.toString().includes(searchTerm) ||
      payment.userId.toString().includes(searchTerm) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    const matchesMethod = !methodFilter || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const completedPayments = filteredPayments.filter((p) => p.status === 'COMPLETED').length;
  const totalPayments = filteredPayments.length;
  const completedAmount = filteredPayments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  const columns: Column<Payment>[] = [
    {
      id: 'id',
      label: 'ID',
      minWidth: 70,
      align: 'left',
    },
    {
      id: 'orderId',
      label: 'Sipariş ID',
      minWidth: 100,
    },
    {
      id: 'userId',
      label: 'Kullanıcı ID',
      minWidth: 100,
    },
    {
      id: 'amount',
      label: 'Tutar',
      minWidth: 120,
      format: (value: number | string | undefined) => formatCurrency(value),
    },
    {
      id: 'paymentMethod',
      label: 'Ödeme Yöntemi',
      minWidth: 150,
      format: (value: string) => getPaymentMethodLabel(value),
    },
    {
      id: 'status',
      label: 'Durum',
      minWidth: 120,
      format: (value: string) => <StatusBadge status={value} />,
    },
    {
      id: 'transactionDate',
      label: 'Tarih',
      minWidth: 150,
      format: (value: string | Date | undefined) => (value ? formatDate(value) : '-'),
    },
  ];

  return (
    <Container maxWidth="xl" className="fade-in">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Ödeme Yönetimi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ödemeleri görüntüleyin ve yönetin
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Yeni Ödeme İşle
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
              border: '1px solid',
              borderColor: 'primary.main',
              borderWidth: 2,
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                Toplam Ödeme
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {totalPayments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid',
              borderColor: 'success.main',
              borderWidth: 2,
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                Başarılı Ödeme
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'success.main',
                }}
              >
                {completedPayments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
              border: '1px solid',
              borderColor: 'primary.main',
              borderWidth: 2,
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                Toplam Tutar
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {formatCurrency(totalAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid',
              borderColor: 'success.main',
              borderWidth: 2,
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                Başarılı Tutar
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'success.main',
                }}
              >
                {formatCurrency(completedAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="ID, sipariş ID, kullanıcı ID veya işlem ID ile ara..."
        />
      </Box>

      <FilterPanel
        filters={[
          {
            key: 'status',
            label: 'Durum',
            options: [
              { value: '', label: 'Tümü' },
              ...PAYMENT_STATUSES.map((status: string) => ({ value: status, label: status })),
            ],
            value: statusFilter,
          },
          {
            key: 'method',
            label: 'Ödeme Yöntemi',
            options: [
              { value: '', label: 'Tümü' },
              ...PAYMENT_METHODS.map((method: string) => ({
                value: method,
                label: getPaymentMethodLabel(method),
              })),
            ],
            value: methodFilter,
          },
        ]}
        onFilterChange={(key: string, value: string) => {
          if (key === 'status') setStatusFilter(value);
          if (key === 'method') setMethodFilter(value);
        }}
        onClearFilters={() => {
          setStatusFilter('');
          setMethodFilter('');
        }}
      />

      <DataTable
        columns={columns}
        rows={filteredPayments}
        loading={loading}
        onView={handleView}
        getRowId={(row: Payment) => row.id || 0}
        emptyMessage="Ödeme bulunamadı"
        emptyActionLabel="Yeni Ödeme İşle"
        onEmptyAction={handleOpen}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Ödeme İşle</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Sipariş ID"
              type="number"
              value={formData.orderId || ''}
              onChange={(e) =>
                setFormData({ ...formData, orderId: parseInt(e.target.value) || 0 })
              }
              required
              error={formData.orderId <= 0}
              helperText={formData.orderId <= 0 ? 'Sipariş ID gereklidir' : ''}
            />
            <TextField
              fullWidth
              label="Kullanıcı ID"
              type="number"
              value={formData.userId || ''}
              onChange={(e) =>
                setFormData({ ...formData, userId: parseInt(e.target.value) || 0 })
              }
              required
              error={formData.userId <= 0}
              helperText={formData.userId <= 0 ? 'Kullanıcı ID gereklidir' : ''}
            />
            <TextField
              fullWidth
              label="Tutar"
              type="number"
              value={formData.amount || ''}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
              }
              required
              error={formData.amount <= 0}
              helperText={formData.amount <= 0 ? 'Tutar 0\'dan büyük olmalıdır' : ''}
              InputProps={{
                endAdornment: '₺',
              }}
            />
            <FormControl fullWidth required>
              <InputLabel>Ödeme Yöntemi</InputLabel>
              <Select
                value={formData.paymentMethod}
                label="Ödeme Yöntemi"
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                {PAYMENT_METHODS.map((method) => (
                  <MenuItem key={method} value={method}>
                    {getPaymentMethodLabel(method)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              formData.orderId <= 0 || formData.userId <= 0 || formData.amount <= 0
            }
          >
            İşle
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="md" fullWidth>
        <DialogTitle>Ödeme Detayları</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Ödeme ID
                    </Typography>
                    <Typography variant="body1">{selectedPayment.id}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Sipariş ID
                    </Typography>
                    <Typography variant="body1">{selectedPayment.orderId}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Kullanıcı ID
                    </Typography>
                    <Typography variant="body1">{selectedPayment.userId}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Durum
                    </Typography>
                    <StatusBadge status={selectedPayment.status} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tutar
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                      {formatCurrency(selectedPayment.amount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Ödeme Yöntemi
                    </Typography>
                    <Typography variant="body1">
                      {getPaymentMethodLabel(selectedPayment.paymentMethod)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tarih
                    </Typography>
                    <Typography variant="body1">
                      {selectedPayment.transactionDate
                        ? formatDate(selectedPayment.transactionDate)
                        : '-'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {selectedPayment.transactionId && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        İşlem ID
                      </Typography>
                      <Typography variant="body1">{selectedPayment.transactionId}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {selectedPayment.paymentGatewayResponse && (
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Ödeme Gateway Yanıtı
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedPayment.paymentGatewayResponse}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Kapat</Button>
          {selectedPayment && (
            <Button
              onClick={() => {
                handleViewClose();
                handleStatusClick(selectedPayment);
              }}
              variant="outlined"
            >
              Durum Güncelle
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ödeme Durumu Güncelle</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Yeni Durum</InputLabel>
            <Select
              value={newStatus}
              label="Yeni Durum"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {PAYMENT_STATUSES.map((status: string) => (
                <MenuItem key={status} value={status}>
                  <StatusBadge status={status} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusOpen(false)}>İptal</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Payments;
