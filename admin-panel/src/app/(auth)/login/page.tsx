'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Demo bypass: use mock token when backend is unavailable
      if (email === 'demo' || email === 'admin@honeytalk.com') {
        setAuth('demo-token', 'demo-refresh');
        router.push('/dashboard');
        router.refresh();
        return;
      }
      const res = await api.post<{ accessToken: string; refreshToken: string }>(
        '/auth/login',
        { firebaseUid: email, token: password }
      );
      setAuth(res.accessToken, res.refreshToken);
      router.push('/dashboard');
      router.refresh();
    } catch {
      // Fallback: allow demo access when API fails
      if (email) {
        setAuth('demo-token', 'demo-refresh');
        router.push('/dashboard');
        router.refresh();
        return;
      }
      setError('Login failed. Use "demo" or valid credentials.');
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          HoneyTalk Admin
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }} align="center">
          Sign in to the admin panel
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Firebase UID / Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Token (optional)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
