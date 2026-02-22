/**
 * Shared layout constants for consistent spacing and sizing across the admin panel.
 */

export const LAYOUT = {
  /** Sidebar/drawer width in pixels */
  SIDEBAR_WIDTH: 280,
  /** Minimum sidebar width when collapsed (optional future use) */
  SIDEBAR_COLLAPSED_WIDTH: 72,
  /** App header height */
  HEADER_HEIGHT: { xs: 56, sm: 60, md: 64 },
  /** Main content max width */
  CONTENT_MAX_WIDTH: 1600,
  /** Transition duration in ms */
  TRANSITION_DURATION: 200,
} as const;

export const Z_INDEX = {
  SIDEBAR: 1100,
  HEADER: 1200,
  FLOATING_ACTION: 1000,
} as const;
