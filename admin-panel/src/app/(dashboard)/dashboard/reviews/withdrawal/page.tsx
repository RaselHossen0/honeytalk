'use client';

import { Box, Typography } from '@mui/material';

export default function WithdrawalReviewsPage() {
  return (
    <Box>
      <Typography variant="h5">Anchor Withdrawal Review</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Review queue for withdrawal requests.
      </Typography>
    </Box>
  );
}
