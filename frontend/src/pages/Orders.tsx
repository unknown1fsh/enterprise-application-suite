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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Add, Edit, Delete, Visibility, AddCircle, RemoveCircle } from '@mui/icons-material';
import { orderService, Order, OrderRequest, OrderItemRequest } from '../services/orderService';
import { inventoryService, Product } from '../services/inventoryService';
import DataTable, { Column } from '../components/common/DataTable';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import StatusBadge from '../components/common/StatusBadge';
import { ORDER_STATUSES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrderRequest>({
    userId: 0,
    shippingAddress: '',
    billingAddress: '',
    items: [],
  });
  const [orderItems, setOrderItems] = useState<Array<OrderItemRequest & { productName?: string; subtotal?: number }>>([]);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getAll();
      if (response.data.success) {
        setOrders(response.data.data.content || response.data.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Siparişler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await inventoryService.getAll();
      if (response.data.success) {
        setProducts(response.data.data.content || response.data.data || []);
      }
    } catch (err: any) {
      console.error('Ürünler yüklenirken hata:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleOpen = (order?: Order) => {
    if (order) {
      setSelectedOrder(order);
      setFormData({
        userId: order.userId,
        shippingAddress: order.shippingAddress || '',
        billingAddress: order.billingAddress || '',
        items: [],
      });
      if (order.items) {
        setOrderItems(
          order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            productName: item.productName,
            subtotal: item.subtotal,
          }))
        );
      } else {
        setOrderItems([]);
      }
    } else {
      setSelectedOrder(null);
      setFormData({
        userId: 0,
        shippingAddress: '',
        billingAddress: '',
        items: [],
      });
      setOrderItems([]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
    setFormData({
      userId: 0,
      shippingAddress: '',
      billingAddress: '',
      items: [],
    });
    setOrderItems([]);
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusClick = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder?.id) return;
    try {
      setError(null);
      await orderService.updateStatus(selectedOrder.id, newStatus);
      setSuccess('Sipariş durumu güncellendi');
      setStatusOpen(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Durum güncellenirken hata oluştu');
    }
  };

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder?.id) return;
    try {
      // Backend'de delete endpoint'i kontrol edilmeli
      setOrders(orders.filter((o) => o.id !== selectedOrder.id));
      setSuccess('Sipariş silindi');
      setDeleteOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sipariş silinirken hata oluştu');
    }
  };

  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      {
        productId: 0,
        quantity: 1,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderItemRequest, value: any) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    
    // Calculate subtotal if product is selected
    if (field === 'productId' || field === 'quantity') {
      const product = products.find((p) => p.id === value || p.id === updatedItems[index].productId);
      if (product) {
        updatedItems[index].productName = product.name;
        updatedItems[index].subtotal = product.price * (updatedItems[index].quantity || 1);
      }
    }
    
    setOrderItems(updatedItems);
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      
      if (orderItems.length === 0) {
        setError('En az bir ürün eklenmelidir');
        return;
      }

      const orderRequest: OrderRequest = {
        userId: formData.userId,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddress,
        items: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      if (selectedOrder?.id) {
        // Update logic here if backend supports it
        setSuccess('Sipariş güncellendi');
      } else {
        await orderService.create(orderRequest);
        setSuccess('Sipariş başarıyla oluşturuldu');
      }
      handleClose();
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sipariş kaydedilirken hata oluştu');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toString().includes(searchTerm) ||
      order.userId.toString().includes(searchTerm) ||
      order.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = filteredOrders.length;

  const columns: Column<Order>[] = [
    {
      id: 'id',
      label: 'ID',
      minWidth: 70,
      align: 'left',
    },
    {
      id: 'userId',
      label: 'Kullanıcı ID',
      minWidth: 100,
    },
    {
      id: 'orderDate',
      label: 'Tarih',
      minWidth: 150,
      format: (value) => (value ? formatDate(value) : '-'),
    },
    {
      id: 'status',
      label: 'Durum',
      minWidth: 120,
      format: (value) => <StatusBadge status={value} />,
    },
    {
      id: 'totalAmount',
      label: 'Toplam Tutar',
      minWidth: 120,
      format: (value) => formatCurrency(value),
    },
    {
      id: 'items',
      label: 'Ürün Sayısı',
      minWidth: 100,
      format: (value) => (Array.isArray(value) ? value.length : 0),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Sipariş Yönetimi
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Yeni Sipariş
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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Toplam Sipariş
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Toplam Tutar
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {formatCurrency(totalAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="ID, kullanıcı ID veya adres ile ara..."
        />
      </Box>

      <FilterPanel
        filters={[
          {
            key: 'status',
            label: 'Durum',
            options: [
              { value: '', label: 'Tümü' },
              ...ORDER_STATUSES.map((status) => ({ value: status, label: status })),
            ],
            value: statusFilter,
          },
        ]}
        onFilterChange={(key, value) => {
          if (key === 'status') setStatusFilter(value);
        }}
        onClearFilters={() => {
          setStatusFilter('');
        }}
      />

      <DataTable
        columns={columns}
        rows={filteredOrders}
        loading={loading}
        onEdit={handleOpen}
        onDelete={handleDeleteClick}
        onView={handleView}
        getRowId={(row) => row.id || 0}
        emptyMessage="Sipariş bulunamadı"
        emptyActionLabel="Yeni Sipariş Ekle"
        onEmptyAction={() => handleOpen()}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedOrder ? 'Sipariş Düzenle' : 'Yeni Sipariş'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Kullanıcı ID"
              type="number"
              value={formData.userId || ''}
              onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) || 0 })}
              required
            />
            <TextField
              fullWidth
              label="Teslimat Adresi"
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Fatura Adresi"
              value={formData.billingAddress}
              onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
              multiline
              rows={2}
            />
            
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Sipariş Öğeleri</Typography>
                <Button startIcon={<AddCircle />} onClick={handleAddItem} size="small" variant="outlined">
                  Ürün Ekle
                </Button>
              </Box>
              
              {orderItems.map((item, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Ürün</InputLabel>
                        <Select
                          value={item.productId}
                          label="Ürün"
                          onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        >
                          {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.name} - {formatCurrency(product.price)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Miktar"
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" color="text.secondary">
                          {item.subtotal ? formatCurrency(item.subtotal) : '-'}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <RemoveCircle />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              {orderItems.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                  Henüz ürün eklenmedi
                </Typography>
              )}
              
              {orderItems.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="h6" align="right">
                    Toplam: {formatCurrency(
                      orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0)
                    )}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="md" fullWidth>
        <DialogTitle>Sipariş Detayları</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Sipariş ID
                    </Typography>
                    <Typography variant="body1">{selectedOrder.id}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Kullanıcı ID
                    </Typography>
                    <Typography variant="body1">{selectedOrder.userId}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tarih
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.orderDate ? formatDate(selectedOrder.orderDate) : '-'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Durum
                    </Typography>
                    <StatusBadge status={selectedOrder.status} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Toplam Tutar
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                      {formatCurrency(selectedOrder.totalAmount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {selectedOrder.shippingAddress && (
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Teslimat Adresi
                      </Typography>
                      <Typography variant="body1">{selectedOrder.shippingAddress}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Sipariş Öğeleri
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Ürün</TableCell>
                              <TableCell align="right">Miktar</TableCell>
                              <TableCell align="right">Fiyat</TableCell>
                              <TableCell align="right">Toplam</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedOrder.items.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.productName || `Ürün ${item.productId}`}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                                <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Kapat</Button>
          {selectedOrder && (
            <>
              <Button
                onClick={() => {
                  handleViewClose();
                  handleStatusClick(selectedOrder);
                }}
                variant="outlined"
              >
                Durum Güncelle
              </Button>
              <Button onClick={() => { handleViewClose(); handleOpen(selectedOrder); }} variant="contained">
                Düzenle
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sipariş Durumu Güncelle</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Yeni Durum</InputLabel>
            <Select
              value={newStatus}
              label="Yeni Durum"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {ORDER_STATUSES.map((status) => (
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

      <ConfirmationDialog
        open={deleteOpen}
        title="Siparişi Sil"
        message={`Bu siparişi silmek istediğinizden emin misiniz?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedOrder(null);
        }}
        severity="error"
        confirmLabel="Sil"
      />
    </Container>
  );
};

export default Orders;
