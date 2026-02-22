'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Link,
  Typography,
  Button,
} from '@mui/material';
import {
  Add,
  Person,
  HowToReg,
  AccountBalanceWallet,
  EmojiPeople,
  ChevronRight,
} from '@mui/icons-material';
const KPI_ITEMS = [
  { label: 'Anchor pending review', value: 7, path: '/dashboard/reviews/anchors', icon: <Person /> },
  { label: 'Family pending review', value: 8, path: '/dashboard/reviews/family', icon: <HowToReg /> },
  { label: 'Anchor withdrawal review', value: 2, path: '/dashboard/reviews/withdrawal', icon: <AccountBalanceWallet /> },
  { label: 'Invitation withdrawal review', value: 1, path: '/dashboard/reviews/invitation', icon: <EmojiPeople /> },
];

const QUICK_LINKS = [
  { label: 'Recharge agent login backend address', url: 'https://mapi.bogolive.net/h5/agent_login' },
  { label: 'Agency Management Background', url: 'https://agency.bogolive.net' },
];

function KpiCard({
  label,
  value,
  path,
  icon,
  onNavigate,
}: {
  label: string;
  value: number;
  path: string;
  icon: React.ReactNode;
  onNavigate: (path: string) => void;
}) {
  return (
    <Card
      onClick={() => onNavigate(path)}
      sx={{
        borderRadius: 2,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        transition: 'all 0.2s',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {value}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: 'text.secondary' }}>
          <ChevronRight />
        </IconButton>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [quickEntries, setQuickEntries] = useState<string[]>(['Settings', 'Users']);

  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} lg={8}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mb: 2 }}>
              Quick entrance
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              size="small"
              sx={{ borderStyle: 'dashed' }}
            >
              Add Quick Entry
            </Button>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {quickEntries.map((entry) => (
                <Chip key={entry} label={entry} variant="filled" color="primary" size="small" />
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              borderRadius: 2,
              mb: 3,
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                HT
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  admin
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: 1
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {KPI_ITEMS.map((item) => (
              <KpiCard key={item.label} {...item} onNavigate={(p) => router.push(p)} />
            ))}
          </Box>

          <Box sx={{ mt: 3 }}>
            {QUICK_LINKS.map(({ label, url }) => (
              <Card
                key={url}
                sx={{
                  borderRadius: 2,
                  mb: 1.5,
                  bgcolor: 'grey.100',
                  '&:hover': { bgcolor: 'grey.200' },
                }}
              >
                <CardContent sx={{ py: 1.5 }}>
                  <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="text.primary"
                    sx={{ fontSize: 14 }}
                  >
                    {label}
                  </Link>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {url}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
