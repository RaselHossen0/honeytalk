import type { GenericField } from './config-form';

export const ANCHOR_WITHDRAWAL_FIELDS: GenericField[] = [
  { key: 'refund_explain', label: 'Withdrawal instructions', type: 'textarea', notes: 'Anchor withdrawal instructions Background modification', apiKey: 'refund_explain' },
  { key: 'month_carry_max', label: 'Monthly withdrawal end time', type: 'number', notes: 'Unit: day, monthly withdrawal end time (e.g. fill in 10)', apiKey: 'month_carry_max' },
  { key: 'month_carry_min', label: 'Start time of monthly withdrawal', type: 'number', notes: 'Unit: day, monthly withdrawal start time such as: 5', apiKey: 'month_carry_min' },
  { key: 'month_carry_one', label: 'Withdraw once a month', type: 'toggle_yes_no', notes: '1: Only allow one withdrawal per month; 0: No', apiKey: 'month_carry_one' },
  { key: 'day_cash_max', label: 'Maximum withdrawal amount', type: 'number', notes: '($) Maximum withdrawal limit per day', apiKey: 'day_cash_max' },
  { key: 'ticket_catty_min', label: 'Minimum withdrawal amount', type: 'number', notes: '($) The minimum withdrawal amount per day', apiKey: 'ticket_catty_min' },
  { key: 'ticket_catty_ratio', label: 'Withdrawal Ratio', type: 'number', notes: '(e.g. 100 income * 0.01 = 1 $)', apiKey: 'ticket_catty_ratio' },
  { key: 'is_refund', label: 'Enable withdrawal', type: 'toggle_yes_no', notes: 'Enable withdrawal switch 0: No 1: Yes', apiKey: 'is_refund' },
];

export const APP_VERSION_FIELDS: GenericField[] = [
  { key: 'forced_upgrade_tips', label: 'Forced upgrade', type: 'text', notes: 'Reminder to enable forced upgrade', apiKey: 'forced_upgrade_tips' },
  { key: 'forced_upgrade', label: 'Mandatory Client Update Switch', type: 'toggle_yes_no', notes: 'Enable mandatory upgrade, cannot enter live room without upgrading 0: No; 1: Yes', apiKey: 'forced_upgrade' },
];

export const PAID_LIVE_FIELDS: GenericField[] = [
  { key: 'live_pay_scene_max', label: 'Maximum charge for pay-per-view by scene', type: 'number', notes: '(Diamond) Pay-per-view live streaming, the host fills in the highest charge, 0', apiKey: 'live_pay_scene_max' },
  { key: 'live_pay_scene_min', label: 'Minimum charge for pay-per-view', type: 'number', notes: '(Diamond) Pay-per-view live streaming, broadcasters fill in the lowest charge by default', apiKey: 'live_pay_scene_min' },
  { key: 'live_pay_max', label: 'Maximum Charge for Timed Payment', type: 'number', notes: '(Diamond) Pay-per-view live streaming, the host fills in the highest charge, 0', apiKey: 'live_pay_max' },
  { key: 'live_pay_min', label: 'Lowest charge for on-time payment', type: 'number', notes: '(Diamond) Pay-per-view live streaming, broadcasters fill in the lowest charge by default', apiKey: 'live_pay_min' },
  { key: 'ticket_to_rate', label: 'Diamond to income ratio', type: 'number', notes: 'The ratio of diamonds received by paid live broadcasters to tickets (imprint)', apiKey: 'ticket_to_rate' },
  { key: 'uesddiamonds_to_score', label: 'Diamond to points ratio', type: 'number', notes: 'Conversion ratio of diamonds received by paying viewers in (points) to points', apiKey: 'uesddiamonds_to_score' },
  { key: 'live_pay_rule', label: 'Minimum requirement for promotion in minutes', type: 'number', notes: '(Minutes) Number of minutes before the upgrade button appears, enter an integer', apiKey: 'live_pay_rule' },
  { key: 'live_pay_fee', label: 'Fee deduction setting for file transfer', type: 'number', notes: '(Diamond) Cumulative cost for upgrading, enter an integer', apiKey: 'live_pay_fee' },
  { key: 'live_count_down', label: 'Countdown time', type: 'number', notes: '(seconds) The time it takes for the host to switch to the charging mode before starting the countdown.', apiKey: 'live_count_down' },
  { key: 'live_pay_num', label: 'Minimum number of people to start payment', type: 'number', notes: 'Minimum number of people (including machines) allowed to switch to paid mode', apiKey: 'live_pay_num' },
  { key: 'countdown', label: 'Preview countdown', type: 'number', notes: '(Seconds) Countdown for preview of paid live room, default is 10', apiKey: 'countdown' },
  { key: 'is_only_play_video', label: 'Whether to preview the screen', type: 'toggle_yes_no', notes: 'Whether to preview the paid live broadcast room 1: Yes 0: No', apiKey: 'is_only_play_video' },
];

export const VIDEO_MODULE_FIELDS: GenericField[] = [
  { key: 'svideo_must_authentication', label: 'Authentication is required to publish short videos', type: 'toggle_yes_no', notes: 'Is it mandatory to verify when publishing short videos?', apiKey: 'svideo_must_authentication' },
  { key: 'short_video_is_need_audit', label: 'Does short video need to be reviewed and published?', type: 'toggle_yes_no', notes: '', apiKey: 'short_video_is_need_audit' },
  { key: 'sts_video_limit', label: 'Define Short Video Time (seconds)', type: 'number', notes: 'Maximum seconds allowed for uploading short videos', apiKey: 'sts_video_limit' },
];

export const FAMILY_FIELDS: GenericField[] = [
  { key: 'profit_ratio', label: 'Family Earnings Ratio', type: 'number', notes: "Percentage of family's share of anchor's earnings (e.g. fill in 10% if applicable)", apiKey: 'profit_ratio' },
  { key: 'lucky_profit_ratio', label: 'Family Lucky Gift Revenue Ratio', type: 'number', notes: 'The proportion of lucky gift income received by the family from the anchor (if 10%, fill in 10)', apiKey: 'lucky_profit_ratio' },
  { key: 'videotime_to_experience', label: 'Conversion ratio of live broadcast duration to family points', type: 'number', notes: 'Participate in family level upgrade calculation during live broadcast duration (in seconds)', apiKey: 'videotime_to_experience' },
  { key: 'contribution_to_experience', label: 'Family income and family point conversion ratio', type: 'number', notes: 'Family income participation in family level upgrade calculation (seconds)', apiKey: 'contribution_to_experience' },
];

export const LIVE_SORTING_FIELDS: GenericField[] = [
  { key: 'top_weight', label: 'Top Weight Value', type: 'number', notes: 'The weight added when setting a video as top (Unit: hundred million)', apiKey: 'top_weight' },
  { key: 'video_like_weight', label: 'Member Like Weight', type: 'number', notes: 'Like, each user only records once', apiKey: 'video_like_weight' },
  { key: 'num_weight', label: 'Viewer count weight', type: 'number', notes: 'Viewer count weight', apiKey: 'num_weight' },
  { key: 'sort_weight', label: 'Sorting weight', type: 'number', notes: 'Sorting weight', apiKey: 'sort_weight' },
  { key: 'ticke_weight', label: 'Weight of Holding Voting Tickets', type: 'number', notes: 'Weight of Holding Voting Tickets', apiKey: 'ticke_weight' },
  { key: 'level_weight', label: 'Level weight', type: 'number', notes: 'Level weight', apiKey: 'level_weight' },
  { key: 'video_ticket_weight', label: "Current video's earning weight", type: 'number', notes: "Current video's ticket acquisition weight", apiKey: 'video_ticket_weight' },
  { key: 'video_focus_weight', label: 'Number of followers in the room', type: 'number', notes: 'Number of followers in the room', apiKey: 'video_focus_weight' },
  { key: 'video_share_weight', label: 'Weight of Room Share Count', type: 'number', notes: 'Weight of Room Share Count', apiKey: 'video_share_weight' },
  { key: 'focus_weight', label: 'Current weight of the number of followers', type: 'number', notes: 'Current weight of the number of followers', apiKey: 'focus_weight' },
];

export const SHARE_SETTINGS_FIELDS: GenericField[] = [
  { key: 'share_address', label: 'Share download page URL', type: 'text', notes: 'Share download page URL', apiKey: 'share_address' },
  { key: 'share_title', label: 'Share title', type: 'text', notes: 'Share title', apiKey: 'share_title' },
  { key: 'share_content', label: 'Share content settings', type: 'text', notes: 'Share text settings', apiKey: 'share_content' },
];

export const ROBOT_SETTINGS_FIELDS: GenericField[] = [
  { key: 'robot_num', label: 'Number of Robots', type: 'number', notes: 'When creating a live broadcast, randomly add the number of robots', apiKey: 'robot_num' },
  { key: 'virtual_number', label: 'Virtual quantity', type: 'number', notes: 'Number of virtual members brought by one real member', apiKey: 'virtual_number' },
  { key: 'game_robot_switch', label: 'Third-party game robot switch', type: 'toggle_yes_no', notes: 'After opening, there are robots in the game to bet', apiKey: 'game_robot_switch' },
];

export const INVITING_DISTRIBUTION_FIELDS: GenericField[] = [
  { key: 'invite_rewards_recharge', label: 'Recharge Reward (Diamond) (%)', type: 'number', notes: 'Invitation recharge reward (diamond) (%)', apiKey: 'invite_rewards_recharge' },
];

export const CONSUMER_PRICE_FIELDS: GenericField[] = [
  { key: 'barrage_coin', label: 'Bullet screen consumption price', type: 'number', notes: 'Bullet screen consumption price', apiKey: 'barrage_coin' },
  { key: 'change_name', label: 'Charge value for changing nickname', type: 'number', notes: 'Change nickname fee value, users can change nickname once for free', apiKey: 'change_name' },
];

export const DYNAMIC_MODULE_FIELDS: GenericField[] = [
  { key: 'is_dynamic_certification', label: 'Is dynamic publishing authenticated', type: 'toggle_yes_no', notes: '0: No; 1: Yes', apiKey: 'is_dynamic_certification' },
  { key: 'dynamic_dirty_word', label: 'Dynamic dirty word library (separated by commas)', type: 'text', notes: 'Dynamic dirty word library (separated by commas)', apiKey: 'dynamic_dirty_word' },
  { key: 'dynaic_video_length', label: 'Maximum video duration', type: 'number', notes: 'Maximum video duration', apiKey: 'dynaic_video_length' },
  { key: 'dynaic_txt_length', label: 'Maximum Number of Texts', type: 'number', notes: 'Maximum Number of Texts', apiKey: 'dynaic_txt_length' },
  { key: 'dynaic_img_length', label: 'Maximum number of uploaded images', type: 'number', notes: 'Maximum number of uploaded images', apiKey: 'dynaic_img_length' },
];

export const DOWNLOAD_PAGE_FIELDS: GenericField[] = [
  { key: 'download_log', label: 'Download logo', type: 'image', notes: 'Upload rule: Uploaded images can only be JPG/PNG. Download page log image', apiKey: 'download_log' },
  { key: 'download_app_title', label: 'Download APP Title', type: 'text', notes: 'Download APP Title', apiKey: 'download_app_title' },
  { key: 'download_app_introduce', label: 'Download APP Introduction', type: 'text', notes: 'Download APP Introduction', apiKey: 'download_app_introduce' },
  { key: 'download_bg', label: 'Download PC background image', type: 'image', notes: 'Upload rule: Uploaded images can only be JPG/PNG. Download Background Image', apiKey: 'download_bg' },
  { key: 'download_app_bg', label: 'Download APP background image', type: 'image', notes: 'Upload rule: Uploaded images can only be JPG/PNG. Download APP background image', apiKey: 'download_app_bg' },
];

export const RED_ENVELOPE_FIELDS: GenericField[] = [
  { key: 'red_handling_fee', label: 'Red envelope handling fee (%)', type: 'number', notes: 'For example, if 10% is set to 10, sending 100 requires deducting 10 diamonds, but actually sending 90 diamonds', apiKey: 'red_handling_fee' },
  { key: 'red_envelope_switch', label: 'Send red envelope switch', type: 'toggle_off_on', notes: '', apiKey: 'red_envelope_switch' },
  { key: 'red_max_number', label: 'maximum number', type: 'number', notes: '', apiKey: 'red_max_number' },
  { key: 'red_min_number', label: 'Minimum Quantity', type: 'number', notes: '', apiKey: 'red_min_number' },
  { key: 'red_max_people', label: 'Maximum number of people', type: 'number', notes: '', apiKey: 'red_max_people' },
  { key: 'red_min_people', label: 'Minimum number of people', type: 'number', notes: '', apiKey: 'red_min_people' },
];
