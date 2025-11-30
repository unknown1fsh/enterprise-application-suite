import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import {
  Inventory2,
  ShoppingCart,
  Payment,
  People,
  CheckCircle,
  Error as ErrorIcon,
  TrendingUp,
  AttachMoney,
  Add,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';
import { orderService, Order } from '../services/orderService';
import { paymentService, Payment } from '../services/paymentService';
import { userService, User } from '../services/userService';
import { formatCurrency, formatDate } from '../utils/formatters';
import StatusBadge from './common/StatusBadge';

interface ServiceStatus {
  name: string;
  status: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
  path: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check services
      const serviceChecks = [
        { name: 'Inventory', service: inventoryService, icon: <Inventory2 />, color: '#1976d2' },
        { name: 'Order', service: orderService, icon: <ShoppingCart />, color: '#2e7d32' },
        { name: 'Payment', service: paymentService, icon: <Payment />, color: '#ed6c02' },
        { name: 'User', service: userService, icon: <People />, color: '#9c27b0' },
      ];

      const serviceStatuses = await Promise.all(
        serviceChecks.map(async ({ name, service, icon, color }) => {
          try {
            await service.health();
            return { name, status: 'up' as const, icon, color };
          } catch {
            return { name, status: 'down' as const, icon, color };
          }
        })
      );
      setServices(serviceStatuses);

      // Load statistics
      const [productsRes, ordersRes, paymentsRes, usersRes] = await Promise.allSettled([
        inventoryService.getAll(),
        orderService.getAll(),
        paymentService.getAll(),
        userService.getAll(),
      ]);

      const products = productsRes.status === 'fulfilled' 
        ? (productsRes.value.data.data?.content || productsRes.value.data.data || [])
        : [];
      const orders = ordersRes.status === 'fulfilled'
        ? (ordersRes.value.data.data?.content || ordersRes.value.data.data || [])
        : [];
      const payments = paymentsRes.status === 'fulfilled'
        ? (paymentsRes.value.data.data?.content || paymentsRes.value.data.data || [])
        : [];
      const users = usersRes.status === 'fulfilled'
        ? (usersRes.value.data.data?.content || usersRes.value.data.data || [])
        : [];

      const totalRevenue = payments
        .filter((p: Payment) => p.status === 'COMPLETED')
        .reduce((sum: number, p: Payment) => sum + p.amount, 0);

      const pendingOrders = orders.filter((o: Order) => o.status === 'PENDING').length;

      setStats([
        {
          title: 'Toplam Ürün',
          value: products.length,
          icon: <Inventory2 />,
          color: '#1976d2',
          path: '/products',
        },
        {
          title: 'Toplam Sipariş',
          value: orders.length,
          icon: <ShoppingCart />,
          color: '#2e7d32',
          change: `${pendingOrders} bekleyen`,
          path: '/orders',
        },
        {
          title: 'Toplam Gelir',
          value: formatCurrency(totalRevenue),
          icon: <AttachMoney />,
          color: '#ed6c02',
          path: '/payments',
        },
        {
          title: 'Toplam Kullanıcı',
          value: users.length,
          icon: <People />,
          color: '#9c27b0',
          path: '/users',
        },
      ]);

      // Recent orders (last 5)
      const sortedOrders = [...orders]
        .sort((a: Order, b: Order) => {
          const dateA = a.orderDate ? new Date(a.orderDate).getTime() : 0;
          const dateB = b.orderDate ? new Date(b.orderDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5);
      setRecentOrders(sortedOrders);

      // Recent payments (last 5)
      const sortedPayments = [...payments]
        .sort((a: Payment, b: Payment) => {
          const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
          const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5);
      setRecentPayments(sortedPayments);
    } catch (err: any) {
      setError('Dashboard verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<TrendingUp />}
          onClick={loadDashboardData}
        >
          Yenile
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(stat.path)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    {stat.change && (
                      <Typography variant="caption" color="text.secondary">
                        {stat.change}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      bgcolor: `${stat.color}15`,
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Service Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Servis Durumları
              </Typography>
              <Grid container spacing={2}>
                {services.map((service) => (
                  <Grid item xs={6} key={service.name}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        bgcolor: service.status === 'up' ? 'success.light' : 'error.light',
                      }}
                    >
                      <Box sx={{ color: service.color, mb: 1 }}>{service.icon}</Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {service.name}
                      </Typography>
                      {service.status === 'up' ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="Çalışıyor"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<ErrorIcon />}
                          label="Çalışmıyor"
                          color="error"
                          size="small"
                        />
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Hızlı İşlemler
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/products')}
                    sx={{ py: 1.5 }}
                  >
                    Yeni Ürün
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/orders')}
                    sx={{ py: 1.5 }}
                  >
                    Yeni Sipariş
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Payment />}
                    onClick={() => navigate('/payments')}
                    sx={{ py: 1.5 }}
                  >
                    Ödemeleri Görüntüle
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<People />}
                    onClick={() => navigate('/users')}
                    sx={{ py: 1.5 }}
                  >
                    Kullanıcıları Görüntüle
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Son Siparişler
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/orders')}
                >
                  Tümünü Gör
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {recentOrders.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  Henüz sipariş bulunmuyor
                </Typography>
              ) : (
                <List>
                  {recentOrders.map((order, index) => (
                    <React.Fragment key={order.id || index}>
                      <ListItem
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => navigate('/orders')}
                      >
                        <ListItemIcon>
                          <ShoppingCart color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Sipariş #${order.id}`}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {order.orderDate ? formatDate(order.orderDate) : '-'}
                              </Typography>
                              <Box display="flex" gap={1} mt={0.5}>
                                <StatusBadge status={order.status} size="small" />
                                <Typography variant="caption" color="text.secondary">
                                  {formatCurrency(order.totalAmount)}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentOrders.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Payments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Son Ödemeler
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/payments')}
                >
                  Tümünü Gör
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {recentPayments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  Henüz ödeme bulunmuyor
                </Typography>
              ) : (
                <List>
                  {recentPayments.map((payment, index) => (
                    <React.Fragment key={payment.id || index}>
                      <ListItem
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => navigate('/payments')}
                      >
                        <ListItemIcon>
                          <Payment color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Ödeme #${payment.id}`}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {payment.transactionDate ? formatDate(payment.transactionDate) : '-'}
                              </Typography>
                              <Box display="flex" gap={1} mt={0.5}>
                                <StatusBadge status={payment.status} size="small" />
                                <Typography variant="caption" color="text.secondary">
                                  {formatCurrency(payment.amount)}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentPayments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
