'use client';

import { Box, Typography } from '@mui/material';

export default function AnchorReviewsPage() {
  return (
    <Box>
      <Typography variant="h5">Anchor Pending Review</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Review queue for anchor applications.
      </Typography>
    </Box>
  );
}
