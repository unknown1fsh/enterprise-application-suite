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
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { inventoryService, Product, ProductRequest } from '../services/inventoryService';
import DataTable, { Column } from '../components/common/DataTable';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import { formatCurrency } from '../utils/formatters';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductRequest>({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: '',
    sku: '',
    active: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inventoryService.getAll();
      if (response.data.success) {
        setProducts(response.data.data.content || response.data.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ürünler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stockQuantity: product.stockQuantity,
        category: product.category || '',
        sku: product.sku || '',
        active: product.active !== false,
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        category: '',
        sku: '',
        active: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      category: '',
      sku: '',
      active: true,
    });
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct?.id) return;
    try {
      await inventoryService.delete(selectedProduct.id);
      setSuccess('Ürün silindi');
      setDeleteOpen(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ürün silinirken hata oluştu');
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      
      if (!formData.name.trim()) {
        setError('Ürün adı gereklidir');
        return;
      }
      if (formData.price <= 0) {
        setError('Fiyat 0\'dan büyük olmalıdır');
        return;
      }
      if (formData.stockQuantity < 0) {
        setError('Stok miktarı negatif olamaz');
        return;
      }

      if (selectedProduct?.id) {
        await inventoryService.update(selectedProduct.id, formData);
        setSuccess('Ürün güncellendi');
      } else {
        await inventoryService.create(formData);
        setSuccess('Ürün başarıyla oluşturuldu');
      }
      handleClose();
      loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ürün kaydedilirken hata oluştu');
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = filteredProducts.length;
  const lowStockProducts = filteredProducts.filter((p) => p.stockQuantity < 10).length;
  const totalValue = filteredProducts.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);

  const columns: Column<Product>[] = [
    {
      id: 'id',
      label: 'ID',
      minWidth: 70,
      align: 'left',
    },
    {
      id: 'name',
      label: 'Ürün Adı',
      minWidth: 200,
    },
    {
      id: 'category',
      label: 'Kategori',
      minWidth: 120,
      format: (value) => (value ? <Chip label={value} size="small" /> : '-'),
    },
    {
      id: 'price',
      label: 'Fiyat',
      minWidth: 100,
      format: (value) => formatCurrency(value),
    },
    {
      id: 'stockQuantity',
      label: 'Stok',
      minWidth: 80,
      format: (value, row) => (
        <Chip
          label={value}
          size="small"
          color={value < 10 ? 'error' : value < 50 ? 'warning' : 'success'}
        />
      ),
    },
    {
      id: 'sku',
      label: 'SKU',
      minWidth: 120,
    },
    {
      id: 'active',
      label: 'Durum',
      minWidth: 100,
      format: (value) => (
        <Chip
          label={value !== false ? 'Aktif' : 'Pasif'}
          size="small"
          color={value !== false ? 'success' : 'default'}
        />
      ),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Ürün Yönetimi
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Yeni Ürün
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
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Toplam Ürün
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {totalProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Düşük Stok
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'warning.main' }}>
                {lowStockProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Toplam Değer
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {formatCurrency(totalValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Ürün adı, açıklama veya SKU ile ara..."
        />
      </Box>

      {categories.length > 0 && (
        <FilterPanel
          filters={[
            {
              key: 'category',
              label: 'Kategori',
              options: [
                { value: '', label: 'Tümü' },
                ...categories.map((cat) => ({ value: cat, label: cat })),
              ],
              value: categoryFilter,
            },
          ]}
          onFilterChange={(key, value) => {
            if (key === 'category') setCategoryFilter(value);
          }}
          onClearFilters={() => {
            setCategoryFilter('');
          }}
        />
      )}

      <DataTable
        columns={columns}
        rows={filteredProducts}
        loading={loading}
        onEdit={handleOpen}
        onDelete={handleDeleteClick}
        getRowId={(row) => row.id || 0}
        emptyMessage="Ürün bulunamadı"
        emptyActionLabel="Yeni Ürün Ekle"
        onEmptyAction={() => handleOpen()}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Ürün Adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              error={!formData.name.trim()}
              helperText={!formData.name.trim() ? 'Ürün adı gereklidir' : ''}
            />
            <TextField
              fullWidth
              label="Açıklama"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fiyat"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                  error={formData.price <= 0}
                  helperText={formData.price <= 0 ? 'Fiyat 0\'dan büyük olmalıdır' : ''}
                  InputProps={{
                    endAdornment: '₺',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stok Miktarı"
                  type="number"
                  value={formData.stockQuantity || ''}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                  required
                  error={formData.stockQuantity < 0}
                  helperText={formData.stockQuantity < 0 ? 'Stok miktarı negatif olamaz' : ''}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Kategori"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.name.trim() || formData.price <= 0}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteOpen}
        title="Ürünü Sil"
        message={`${selectedProduct?.name} ürününü silmek istediğinizden emin misiniz?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedProduct(null);
        }}
        severity="error"
        confirmLabel="Sil"
      />
    </Container>
  );
};

export default Products;
