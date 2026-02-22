'use client';

import { Box, Typography } from '@mui/material';

export default function TransactionsPage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Transactions
      </Typography>
      <Typography color="text.secondary">
        Coin and payment transaction history.
      </Typography>
    </Box>
  );
}
