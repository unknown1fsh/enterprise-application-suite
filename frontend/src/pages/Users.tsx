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
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { userService, User, UserRequest } from '../services/userService';
import DataTable, { Column } from '../components/common/DataTable';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import { USER_ROLES } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserRequest>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    active: true,
  });
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAll();
      if (response.data.success) {
        setUsers(response.data.data.content || response.data.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || 'USER',
        active: user.active !== false,
      });
      setChangePassword(false);
    } else {
      setSelectedUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'USER',
        active: true,
      });
      setChangePassword(true);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'USER',
      active: true,
    });
    setChangePassword(false);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser?.id) return;
    try {
      await userService.delete(selectedUser.id);
      setSuccess('Kullanıcı silindi');
      setDeleteOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kullanıcı silinirken hata oluştu');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      
      if (!formData.username.trim()) {
        setError('Kullanıcı adı gereklidir');
        return;
      }
      if (formData.username.length < 3 || formData.username.length > 50) {
        setError('Kullanıcı adı 3-50 karakter arasında olmalıdır');
        return;
      }
      if (!formData.email.trim()) {
        setError('Email gereklidir');
        return;
      }
      if (!validateEmail(formData.email)) {
        setError('Geçerli bir email adresi giriniz');
        return;
      }
      if (!selectedUser && (!formData.password || formData.password.length < 6)) {
        setError('Şifre en az 6 karakter olmalıdır');
        return;
      }
      if (selectedUser && changePassword && formData.password && formData.password.length < 6) {
        setError('Şifre en az 6 karakter olmalıdır');
        return;
      }

      const userRequest: UserRequest = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        role: formData.role || 'USER',
        active: formData.active,
      };

      if (!selectedUser) {
        // Create - password required
        userRequest.password = formData.password;
        await userService.register(userRequest);
        setSuccess('Kullanıcı başarıyla oluşturuldu');
      } else {
        // Update - password optional
        if (changePassword && formData.password) {
          userRequest.password = formData.password;
        }
        await userService.update(selectedUser.id!, userRequest);
        setSuccess('Kullanıcı güncellendi');
      }
      handleClose();
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kullanıcı kaydedilirken hata oluştu');
    }
  };

  const getRoleLabel = (role: string | undefined): string => {
    const roleLabels: { [key: string]: string } = {
      USER: 'Kullanıcı',
      ADMIN: 'Yönetici',
      MODERATOR: 'Moderatör',
    };
    return roleLabels[role || 'USER'] || role || 'Kullanıcı';
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesActive =
      activeFilter === '' ||
      (activeFilter === 'active' && user.active !== false) ||
      (activeFilter === 'inactive' && user.active === false);
    return matchesSearch && matchesRole && matchesActive;
  });

  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter((u) => u.active !== false).length;
  const adminUsers = filteredUsers.filter((u) => u.role === 'ADMIN').length;
  const moderatorUsers = filteredUsers.filter((u) => u.role === 'MODERATOR').length;

  const columns: Column<User>[] = [
    {
      id: 'id',
      label: 'ID',
      minWidth: 70,
      align: 'left',
    },
    {
      id: 'username',
      label: 'Kullanıcı Adı',
      minWidth: 150,
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 200,
    },
    {
      id: 'firstName',
      label: 'Ad Soyad',
      minWidth: 150,
      format: (value: string | undefined, row?: User) => {
        const fullName = [row?.firstName, row?.lastName].filter(Boolean).join(' ');
        return fullName || '-';
      },
    },
    {
      id: 'role',
      label: 'Rol',
      minWidth: 120,
      format: (value: string | undefined) => (
        <Chip
          label={getRoleLabel(value)}
          size="small"
          color={value === 'ADMIN' ? 'error' : value === 'MODERATOR' ? 'warning' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      id: 'active',
      label: 'Durum',
      minWidth: 100,
      format: (value: boolean | undefined) => (
        <Chip
          label={value !== false ? 'Aktif' : 'Pasif'}
          size="small"
          color={value !== false ? 'success' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      id: 'lastLogin',
      label: 'Son Giriş',
      minWidth: 150,
      format: (value: string | undefined) => (value ? formatDate(value) : '-'),
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
            Kullanıcı Yönetimi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kullanıcıları görüntüleyin, düzenleyin ve yönetin
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Yeni Kullanıcı
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
                Toplam Kullanıcı
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
                {totalUsers}
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
                Aktif Kullanıcı
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'success.main',
                }}
              >
                {activeUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: '1px solid',
              borderColor: 'error.main',
              borderWidth: 2,
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                Yönetici
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'error.main',
                }}
              >
                {adminUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
              border: '1px solid',
              borderColor: 'warning.main',
              borderWidth: 2,
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                Moderatör
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'warning.main',
                }}
              >
                {moderatorUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Kullanıcı adı, email, ad veya soyad ile ara..."
        />
      </Box>

      <FilterPanel
        filters={[
          {
            key: 'role',
            label: 'Rol',
            options: [
              { value: '', label: 'Tümü' },
              ...USER_ROLES.map((role: string) => ({
                value: role,
                label: getRoleLabel(role),
              })),
            ],
            value: roleFilter,
          },
          {
            key: 'active',
            label: 'Durum',
            options: [
              { value: '', label: 'Tümü' },
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Pasif' },
            ],
            value: activeFilter,
          },
        ]}
        onFilterChange={(key: string, value: string) => {
          if (key === 'role') setRoleFilter(value);
          if (key === 'active') setActiveFilter(value);
        }}
        onClearFilters={() => {
          setRoleFilter('');
          setActiveFilter('');
        }}
      />

      <DataTable
        columns={columns}
        rows={filteredUsers}
        loading={loading}
        onEdit={handleOpen}
        onDelete={handleDeleteClick}
        onView={handleView}
        getRowId={(row: User) => row.id || 0}
        emptyMessage="Kullanıcı bulunamadı"
        emptyActionLabel="Yeni Kullanıcı Ekle"
        onEmptyAction={() => handleOpen()}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Kullanıcı Adı"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  error={!formData.username.trim() || formData.username.length < 3 || formData.username.length > 50}
                  helperText={
                    !formData.username.trim()
                      ? 'Kullanıcı adı gereklidir'
                      : formData.username.length < 3 || formData.username.length > 50
                      ? 'Kullanıcı adı 3-50 karakter arasında olmalıdır'
                      : ''
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  error={!formData.email.trim() || !validateEmail(formData.email)}
                  helperText={
                    !formData.email.trim()
                      ? 'Email gereklidir'
                      : !validateEmail(formData.email)
                      ? 'Geçerli bir email adresi giriniz'
                      : ''
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Ad"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Soyad"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={formData.role || 'USER'}
                    label="Rol"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    {USER_ROLES.map((role) => (
                      <MenuItem key={role} value={role}>
                        {getRoleLabel(role)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active !== false}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                  }
                  label="Aktif"
                />
              </Grid>
            </Grid>
            {selectedUser && (
              <FormControlLabel
                control={
                  <Switch
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                  />
                }
                label="Şifreyi Değiştir"
              />
            )}
            {(changePassword || !selectedUser) && (
              <TextField
                fullWidth
                label="Şifre"
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!selectedUser}
                error={Boolean(
                  (!selectedUser && (!formData.password || formData.password.length < 6)) ||
                  (selectedUser && changePassword && formData.password && formData.password.length < 6)
                )}
                helperText={
                  (!selectedUser && (!formData.password || formData.password.length < 6)) ||
                  (selectedUser && changePassword && formData.password && formData.password.length < 6)
                    ? 'Şifre en az 6 karakter olmalıdır'
                    : ''
                }
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={Boolean(
              !formData.username.trim() ||
              formData.username.length < 3 ||
              formData.username.length > 50 ||
              !formData.email.trim() ||
              !validateEmail(formData.email) ||
              (!selectedUser && (!formData.password || formData.password.length < 6)) ||
              (selectedUser && changePassword && formData.password && formData.password.length < 6)
            )}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="md" fullWidth>
        <DialogTitle>Kullanıcı Detayları</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Kullanıcı ID
                    </Typography>
                    <Typography variant="body1">{selectedUser.id}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Kullanıcı Adı
                    </Typography>
                    <Typography variant="body1">{selectedUser.username}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Email
                    </Typography>
                    <Typography variant="body1">{selectedUser.email}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Ad Soyad
                    </Typography>
                    <Typography variant="body1">
                      {[selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(' ') || '-'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Rol
                    </Typography>
                    <Chip
                      label={getRoleLabel(selectedUser.role)}
                      size="small"
                      color={selectedUser.role === 'ADMIN' ? 'error' : selectedUser.role === 'MODERATOR' ? 'warning' : 'default'}
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Durum
                    </Typography>
                    <Chip
                      label={selectedUser.active !== false ? 'Aktif' : 'Pasif'}
                      size="small"
                      color={selectedUser.active !== false ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              </Grid>
              {selectedUser.lastLogin && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Son Giriş
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedUser.lastLogin)}
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
          {selectedUser && (
            <Button onClick={() => { handleViewClose(); handleOpen(selectedUser); }} variant="contained">
              Düzenle
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteOpen}
        title="Kullanıcıyı Sil"
        message={`${selectedUser?.username} kullanıcısını silmek istediğinizden emin misiniz?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedUser(null);
        }}
        severity="error"
        confirmLabel="Sil"
      />
    </Container>
  );
};

export default Users;
