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
  Payment as PaymentIcon,
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
import { userService } from '../services/userService';
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
        { name: 'Payment', service: paymentService, icon: <PaymentIcon />, color: '#ed6c02' },
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
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistem genel bakış ve istatistikler
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<TrendingUp />}
          onClick={loadDashboardData}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
          }}
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
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`,
                border: `1px solid ${stat.color}20`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}80 100%)`,
                },
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0px 12px 40px ${stat.color}40`,
                  borderColor: `${stat.color}40`,
                },
              }}
              onClick={() => navigate(stat.path)}
              className="fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: '2rem',
                        background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    {stat.change && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500,
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 'action.hover',
                        }}
                      >
                        {stat.change}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      bgcolor: `${stat.color}20`,
                      borderRadius: 3,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'rotate(10deg) scale(1.1)',
                        bgcolor: `${stat.color}30`,
                      },
                    }}
                  >
                    <Box sx={{ color: stat.color, fontSize: '2rem' }}>{stat.icon}</Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Service Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Servis Durumları
              </Typography>
              <Grid container spacing={2}>
                {services.map((service) => (
                  <Grid size={{ xs: 6 }} key={service.name}>
                    <Paper
                      sx={{
                        p: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 3,
                        background: service.status === 'up'
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                        border: `1px solid ${service.status === 'up' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0px 8px 20px ${service.status === 'up' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          color: service.color,
                          mb: 1.5,
                          fontSize: '2.5rem',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                          },
                        }}
                      >
                        {service.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        {service.name}
                      </Typography>
                      {service.status === 'up' ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="Çalışıyor"
                          color="success"
                          size="small"
                          sx={{
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<ErrorIcon />}
                          label="Çalışmıyor"
                          color="error"
                          size="small"
                          sx={{
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(251, 146, 60, 0.05) 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Hızlı İşlemler
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/products')}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}
                  >
                    Yeni Ürün
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/orders')}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}
                  >
                    Yeni Sipariş
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PaymentIcon />}
                    onClick={() => navigate('/payments')}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      },
                    }}
                  >
                    Ödemeleri Görüntüle
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<People />}
                    onClick={() => navigate('/users')}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      },
                    }}
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Son Siparişler
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/orders')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Tümünü Gör
                </Button>
              </Box>
              <Divider sx={{ mb: 2, borderColor: 'divider' }} />
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
                          borderRadius: 2,
                          mb: 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            transform: 'translateX(4px)',
                          },
                        }}
                        onClick={() => navigate('/orders')}
                      >
                        <ListItemIcon>
                          <ShoppingCart
                            sx={{
                              color: 'primary.main',
                              fontSize: '1.75rem',
                            }}
                          />
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.03) 0%, rgba(251, 146, 60, 0.03) 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Son Ödemeler
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/payments')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Tümünü Gör
                </Button>
              </Box>
              <Divider sx={{ mb: 2, borderColor: 'divider' }} />
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
                          borderRadius: 2,
                          mb: 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            transform: 'translateX(4px)',
                          },
                        }}
                        onClick={() => navigate('/payments')}
                      >
                        <ListItemIcon>
                          <PaymentIcon
                            sx={{
                              color: 'primary.main',
                              fontSize: '1.75rem',
                            }}
                          />
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
