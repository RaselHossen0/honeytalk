'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { useTabsStore } from '@/store/tabs';
import { ImageUpload } from '@/components/common/ImageUpload';
import type { BasicConfig, ApplicationBasicConfig, ThirdPartyAccountConfig, AlibabaCloudConfig, TencentLiveConfig } from '@/types/mobile-config';
import {
  fetchBasicConfig,
  updateBasicConfig,
  fetchApplicationBasicConfig,
  updateApplicationBasicConfig,
  fetchThirdPartyAccountConfig,
  updateThirdPartyAccountConfig,
  fetchAlibabaCloudConfig,
  updateAlibabaCloudConfig,
  fetchTencentLiveConfig,
  updateTencentLiveConfig,
  fetchAnchorWithdrawalConfig,
  updateAnchorWithdrawalConfig,
  fetchAppVersionConfig,
  updateAppVersionConfig,
  fetchPaidLiveConfig,
  updatePaidLiveConfig,
  fetchVideoModuleConfig,
  updateVideoModuleConfig,
  fetchFamilyConfig,
  updateFamilyConfig,
  fetchLiveSortingConfig,
  updateLiveSortingConfig,
  fetchShareSettingsConfig,
  updateShareSettingsConfig,
  fetchRobotSettingsConfig,
  updateRobotSettingsConfig,
  fetchInvitingDistributionConfig,
  updateInvitingDistributionConfig,
  fetchConsumerPriceConfig,
  updateConsumerPriceConfig,
  fetchDynamicModuleConfig,
  updateDynamicModuleConfig,
  fetchDownloadPageConfig,
  updateDownloadPageConfig,
  fetchRedEnvelopeConfig,
  updateRedEnvelopeConfig,
} from '@/services/mobile-config';
import { GenericSection } from './config-form';
import {
  ANCHOR_WITHDRAWAL_FIELDS,
  APP_VERSION_FIELDS,
  PAID_LIVE_FIELDS,
  VIDEO_MODULE_FIELDS,
  FAMILY_FIELDS,
  LIVE_SORTING_FIELDS,
  SHARE_SETTINGS_FIELDS,
  ROBOT_SETTINGS_FIELDS,
  INVITING_DISTRIBUTION_FIELDS,
  CONSUMER_PRICE_FIELDS,
  DYNAMIC_MODULE_FIELDS,
  DOWNLOAD_PAGE_FIELDS,
  RED_ENVELOPE_FIELDS,
} from './section-fields';

/** Sub-menu items for Mobile Configuration. */
const MOBILE_CONFIG_MENUS = [
  { id: 'system-basic', label: 'System Basic Configuration' },
  { id: 'application-basic', label: 'Application Basic Settings' },
  { id: 'third-party-account', label: 'Third party account configuration' },
  { id: 'alibaba-cloud', label: 'Alibaba Cloud Upload Configuration' },
  { id: 'tencent-live', label: 'Tencent Live Configuration' },
  { id: 'anchor-withdrawal', label: 'Anchor withdrawal settings' },
  { id: 'app-version', label: 'APP version management' },
  { id: 'paid-live', label: 'Paid Live Configuration' },
  { id: 'video-module', label: 'Video Module Settings' },
  { id: 'family-config', label: 'Family related configuration' },
  { id: 'live-sorting', label: 'Live streaming sorting weight' },
  { id: 'share-settings', label: 'Share related settings' },
  { id: 'robot-settings', label: 'Robot Settings' },
  { id: 'inviting-distribution', label: 'Inviting Distribution Settings' },
  { id: 'consumer-price', label: 'Consumer Price Configuration' },
  { id: 'dynamic-module', label: 'Dynamic Module Settings' },
  { id: 'download-page', label: 'Download Page Settings' },
  { id: 'red-envelope', label: 'Red envelope settings' },
] as const;

type ConfigField = {
  key: keyof BasicConfig;
  label: string;
  type: 'toggle_yes_no' | 'toggle_on_off' | 'toggle_off_on' | 'number' | 'number_hour' | 'text' | 'textarea' | 'image';
  notes: string;
  apiKey: string;
};

/** All 28 Basic Configuration fields in order. */
const BASIC_CONFIG_FIELDS: ConfigField[] = [
  { key: 'must_authentication', label: 'Authentication required for live streaming', type: 'toggle_yes_no', notes: 'Mandatory Authentication when Initiating Live Broadcast', apiKey: 'must_authentication' },
  { key: 'has_private_chat', label: 'Allow private messages', type: 'toggle_yes_no', notes: 'Whether to enable private messaging function, 1 for enable, 0 for disable', apiKey: 'has_private_chat' },
  { key: 'is_limit_time_start', label: 'Start time of the live broadcast', type: 'number_hour', notes: 'Start time allowed for live streaming', apiKey: 'is_limit_time_start' },
  { key: 'is_limit_time_end', label: 'End time of live broadcast', type: 'number_hour', notes: 'Allowable end time for live streaming, if the end time is less than the start time', apiKey: 'is_limit_time_end' },
  { key: 'is_change_name', label: 'Pay to change nickname', type: 'toggle_on_off', notes: 'Change nickname payment switch, users can change nickname for free once', apiKey: 'is_change_name' },
  { key: 'daily_online_task', label: 'Daily Online Task Switch', type: 'toggle_on_off', notes: '', apiKey: 'mission_switch' },
  { key: 'program_title', label: 'Program title name', type: 'text', notes: 'Program title name', apiKey: 'program_title' },
  { key: 'app_name', label: 'App name', type: 'text', notes: 'App name', apiKey: 'app_name' },
  { key: 'short_name', label: 'Software Name', type: 'text', notes: '', apiKey: 'short_name' },
  { key: 'diamonds_name', label: 'Diamond Name', type: 'text', notes: 'Name', apiKey: 'diamonds_name' },
  { key: 'account_name', label: 'Account Name', type: 'text', notes: 'Name of member center account', apiKey: 'account_name' },
  { key: 'ticket_name', label: 'Earnings Unit Name', type: 'text', notes: 'Name', apiKey: 'ticket_name' },
  { key: 'diamonds_rate', label: 'Recharge ratio', type: 'number', notes: 'Conversion rate between recharge amount and diamonds, for example: recharge 1 $, can', apiKey: 'diamonds_rate' },
  { key: 'exchange_rate', label: 'Exchange rate', type: 'number', notes: 'The exchange ratio between income and diamonds, such as how many gold coins can earn 1 diamond, does not require custom exchange. This value should be written as 0', apiKey: 'exchange_rate' },
  { key: 'join_room_limit', label: 'Maximum number of people entering the room', type: 'number', notes: '(Number of People) When the number of people in the room reaches the limit, you cannot enter the room', apiKey: 'join_room_limit' },
  { key: 'join_room_remind_limit', label: 'Maximum reminder for entering the room', type: 'number', notes: '(Number) When the room reaches its maximum capacity, do not remind to enter the room', apiKey: 'join_room_remind_limit' },
  { key: 'login_send_score', label: 'Daily login bonus', type: 'number', notes: 'Points (given for the first login of the day)', apiKey: 'login_send_score' },
  { key: 'register_gift_diamonds', label: 'Diamond gift upon registration', type: 'number', notes: 'Opening will increase the number of diamonds for registered users', apiKey: 'register_gift_diamonds' },
  { key: 'rank_cache_time', label: 'Ranking list cache update time', type: 'number', notes: 'Unit: seconds', apiKey: 'rank_cache_time' },
  { key: 'sign_in_is_ip', label: 'Whether to enable IP restriction for backend login', type: 'toggle_yes_no', notes: 'Whether to enable IP restriction for backend login', apiKey: 'sign_in_is_ip' },
  { key: 'account_ip', label: 'Background login IP', type: 'textarea', notes: 'IP addresses allowed to log in to the backstage, one IP per line', apiKey: 'account_ip' },
  { key: 'app_logo', label: 'System LOGO', type: 'image', notes: 'Upload rule: Uploaded images can only be JPG/PNG', apiKey: 'app_logo' },
  { key: 'live_page_size', label: 'Monitoring interface pagination', type: 'number', notes: '(Number) Number of pages in the monitoring interface, default is 10, maximum', apiKey: 'live_page_size' },
  { key: 'init_version', label: 'Mobile configuration version number', type: 'text', notes: 'Mobile configuration version number format (yyyymmddn', apiKey: 'init_version' },
  { key: 'feedback_customer_service_avatar', label: 'Feedback system avatar', type: 'image', notes: 'Upload rule: Uploaded images can only be JPG/PNG', apiKey: 'feedback_customer_service_avatar' },
  { key: 'proxy_recharge_switch', label: 'Seller Coin Function Switch', type: 'toggle_off_on', notes: '', apiKey: 'proxy_recharge_switch' },
  { key: 'Limit_number_registered_devices', label: 'Number of registrations for the same device', type: 'number', notes: '', apiKey: 'Limit_number_registered_devices' },
  { key: 'Limit_number_registered_IP', label: 'Number of registrations for the same IP address', type: 'number', notes: '', apiKey: 'Limit_number_registered_IP' },
];

type AppConfigField = {
  key: keyof ApplicationBasicConfig;
  label: string;
  type: 'toggle_yes_no' | 'toggle_close_open' | 'number' | 'text' | 'textarea' | 'image' | 'select';
  notes: string;
  apiKey: string;
  options?: { value: number | string; label: string }[];
};

/** Application Basic Settings fields (44 fields) */
const APPLICATION_BASIC_FIELDS: AppConfigField[] = [
  { key: 'default_nickname', label: 'Default nickname after successful registration', type: 'text', notes: 'Default nickname is "布谷+ID"', apiKey: 'default_nickname' },
  { key: 'view_page_size', label: 'Number of audience lists', type: 'number', notes: 'Number of viewers returned in the live room audience list', apiKey: 'view_page_size' },
  { key: 'is_classify', label: 'Require Forced Category Selection', type: 'toggle_yes_no', notes: 'Do you need to select a category when creating a live stream?', apiKey: 'is_classify' },
  { key: 'is_no_light', label: 'Whether to disable likes', type: 'toggle_yes_no', notes: 'Is the like function on the live page closed?', apiKey: 'is_no_light' },
  { key: 'private_letter_lv', label: 'Private message level restriction', type: 'number', notes: 'Can only send private messages when level >= current set level', apiKey: 'private_letter_lv' },
  { key: 'live_level_lv', label: 'Open live streaming level restrictions', type: 'number', notes: 'Live streaming can only be started when the level is greater than or equal to the current set level', apiKey: 'live_level_lv' },
  {
    key: 'live_streaming_activation_conditions',
    label: 'Enable live streaming conditions',
    type: 'select',
    notes: '',
    apiKey: 'live_streaming_activation_conditions',
    options: [
      { value: 0, label: 'Unrestricted' },
      { value: 1, label: 'meet the level requirements' },
      { value: 2, label: 'join the family' },
      { value: 3, label: 'level restrictions or join the family' },
    ],
  },
  {
    key: 'voice_streaming_activation_conditions',
    label: 'Enable voice room conditions',
    type: 'select',
    notes: '',
    apiKey: 'voice_streaming_activation_conditions',
    options: [
      { value: 0, label: 'Unrestricted' },
      { value: 1, label: 'meet the level requirements' },
      { value: 2, label: 'join the family' },
      { value: 3, label: 'level restrictions or join the family' },
    ],
  },
  { key: 'psd_room_level_restriction', label: 'Password room level restriction', type: 'number', notes: 'A password room can only be created when the level is greater than or equal to the current set level', apiKey: 'psd_room_level_restriction' },
  { key: 'is_prop_notify', label: 'Server-wide flying screen announcement for giving big gifts', type: 'toggle_yes_no', notes: 'Whether to make a server-wide announcement when giving a big gift: 0 for no, 1 for yes', apiKey: 'is_prop_notify' },
  { key: 'show_follow_msg_lv', label: 'Required level to display follow prompt', type: 'number', notes: 'Only display the follow button when the membership level is greater than or equal to the currently set level.', apiKey: 'show_follow_msg_lv' },
  { key: 'show_follow_msg', label: 'Whether to display follow prompt message', type: 'toggle_yes_no', notes: 'Whether to send user follow prompt messages to the live room, 0 for no', apiKey: 'show_follow_msg' },
  { key: 'send_msg_lv', label: 'Restriction on speaking level', type: 'number', notes: 'Only when the membership level >= the currently set level can it be sent', apiKey: 'send_msg_lv' },
  { key: 'is_show_identify_number', label: 'Require Identity Verification', type: 'toggle_yes_no', notes: 'Whether ID card number is required for authentication: 0 for no, 1 for yes', apiKey: 'is_show_identify_number' },
  {
    key: 'search_change',
    label: 'APP Search Type',
    type: 'select',
    notes: 'Set APP search type 0 for exact, 1 for fuzzy',
    apiKey: 'search_change',
    options: [
      { value: 0, label: 'Exact Search' },
      { value: 1, label: 'Fuzzy Search' },
    ],
  },
  { key: 'open_room_hide', label: 'Enable Room Hiding', type: 'toggle_yes_no', notes: 'Whether the module switch is turned on to hide rooms: 1 for on, 0 for off', apiKey: 'open_room_hide' },
  { key: 'has_dirty_words', label: 'Enable Dirty Word Filtering', type: 'toggle_yes_no', notes: 'Enable dirty word filtering (0 for no, 1 for yes)', apiKey: 'has_dirty_words' },
  { key: 'onlinetime_to_experience', label: 'Conversion ratio of online duration to points', type: 'number', notes: 'Duration of Online Participation in Membership Level Upgrade Calculation (in seconds)', apiKey: 'onlinetime_to_experience' },
  { key: 'has_lianmai_lv', label: 'Anchor Allow Connection Level', type: 'number', notes: 'The member level must be greater than or equal to the current set level in order to appear connected', apiKey: 'has_lianmai_lv' },
  { key: 'name_limit', label: 'Enable nickname restriction', type: 'toggle_yes_no', notes: 'Enable sensitive word restriction and filtering', apiKey: 'name_limit' },
  { key: 'attestation_time', label: 'Certification review time', type: 'number', notes: 'Time to reapply after failed review (in seconds)', apiKey: 'attestation_time' },
  { key: 'speak_level', label: 'Speaking Level', type: 'number', notes: 'How many levels are required to speak', apiKey: 'speak_level' },
  { key: 'follow_max', label: 'Maximum number of followers', type: 'number', notes: 'The number of users followed is less than or equal to this value', apiKey: 'follow_max' },
  { key: 'jr_user_level', label: 'Flash of golden light prompt', type: 'number', notes: 'User level is greater than or equal to this value, notify when a user joins the room', apiKey: 'jr_user_level' },
  { key: 'monitor_overtime', label: 'Heartbeat Timeout Time', type: 'number', notes: 'Unit: seconds; recommended to set between 30 seconds and 90 seconds', apiKey: 'monitor_overtime' },
  { key: 'iap_recharge', label: 'Apple Recharge', type: 'toggle_yes_no', notes: 'Apple payment price is the same as regular recharge price 0:No', apiKey: 'iap_recharge' },
  { key: 'is_pk', label: 'Whether to enable PK function', type: 'toggle_yes_no', notes: 'Is PK enabled?', apiKey: 'is_pk' },
  { key: 'kicking_time', label: 'Kick Out Room Time (seconds)', type: 'number', notes: '', apiKey: 'kicking_time' },
  { key: 'mysterious_picture', label: 'Noble Mysterious Person Image', type: 'image', notes: 'Upload rule: Uploaded images can only be JPG/PNG. Mysterious image', apiKey: 'mysterious_picture' },
  { key: 'wish_limit', label: 'Maximum limit for wish list quantity', type: 'number', notes: 'Maximum limit for wish list quantity', apiKey: 'wish_limit' },
  { key: 'dirty_words_list', label: 'Dirty word library', type: 'text', notes: 'Separate multiple dirty words with commas', apiKey: 'dirty_words_list' },
  { key: 'default_avatar', label: 'Default avatar for successful registration', type: 'image', notes: 'Upload rule: Uploaded images can only be JPG/PNG. Default avatar for successful user registration', apiKey: 'default_avatar' },
  { key: 'identify_hold_example', label: 'Example picture of holding ID card', type: 'image', notes: 'Upload rule: Uploaded images can only be JPG/PNG. Example picture of holding ID card', apiKey: 'identify_hold_example' },
  { key: 'consumer_price_Icon', label: 'Virtual currency icon for consumption', type: 'image', notes: 'Upload rule: Uploaded images can only be JPG/PNG. Virtual currency icon for consumption', apiKey: 'consumer_price_Icon' },
  { key: 'is_test_verification_code', label: 'Whether the test verification code is enabled', type: 'toggle_yes_no', notes: 'Whether the test verification code is enabled', apiKey: 'is_test_verification_code' },
  { key: 'test_verification_code', label: 'Test verification code', type: 'text', notes: 'Test verification code', apiKey: 'test_verification_code' },
  { key: 'recharge_background_instructions', label: 'Recharge background instructions', type: 'textarea', notes: '', apiKey: 'recharge_background_instructions' },
  {
    key: 'recharge_background_level',
    label: 'Recharge backend level',
    type: 'select',
    notes: 'For example: Selecting level two will only display level one and level two recharge background',
    apiKey: 'recharge_background_level',
    options: [
      { value: 1, label: 'Level 1' },
      { value: 2, label: 'Level 2' },
      { value: 3, label: 'Level 3' },
      { value: 4, label: 'Level 4' },
      { value: 5, label: 'Level 5' },
    ],
  },
  { key: 'game_screen_restrictions', label: 'Game float screen restrictions', type: 'number', notes: 'Game reward reaches a certain amount Float screen (single time)', apiKey: 'game_screen_restrictions' },
  {
    key: 'effective_duration_voice_computing',
    label: 'Effective live streaming calculation method',
    type: 'select',
    notes: '',
    apiKey: 'effective_duration_voice_computing',
    options: [
      { value: 0, label: 'Only video' },
      { value: 1, label: 'video+voice' },
    ],
  },
  { key: 'effective_days', label: 'Effective days (* hour=1 day)', type: 'number', notes: '', apiKey: 'effective_days' },
  {
    key: 'popular_live_types',
    label: 'Home Popular Live Streaming Types',
    type: 'select',
    notes: '',
    apiKey: 'popular_live_types',
    options: [
      { value: 0, label: 'Video+voice' },
      { value: 1, label: 'video room only' },
    ],
  },
  { key: 'voice_level_lv', label: 'Voice level restrictions', type: 'number', notes: 'The room can only be opened when the level is greater than or equal to the current set level', apiKey: 'voice_level_lv' },
  {
    key: 'give_yourself_gift_switch',
    label: 'Give yourself a gift switch',
    type: 'toggle_close_open',
    notes: '',
    apiKey: 'give_yourself_gift_switch',
  },
];

type ThirdPartyField = {
  key: keyof ThirdPartyAccountConfig;
  label: string;
  type: 'toggle_yes_no' | 'toggle_close_open' | 'text' | 'textarea';
  notes: string;
  apiKey: string;
  rows?: number;
};

/** Third party account configuration fields (15 fields) */
const THIRD_PARTY_ACCOUNT_FIELDS: ThirdPartyField[] = [
  { key: 'google_login', label: 'Google Login', type: 'toggle_close_open', notes: 'Note that you need to configure the firebase related parameters', apiKey: 'google_login' },
  { key: 'facebook_login', label: 'Support Facebook login', type: 'toggle_yes_no', notes: 'Whether to support Facebook login', apiKey: 'facebook_login' },
  { key: 'has_mobile_login', label: 'Support mobile phone login', type: 'toggle_yes_no', notes: '0:No;1:Yes', apiKey: 'has_mobile_login' },
  { key: 'agora_app_id', label: 'Agora App ID', type: 'text', notes: 'Agora App ID', apiKey: 'agora_app_id' },
  { key: 'agora_app_certificate', label: 'Agora AppCertificate', type: 'text', notes: 'Agora AppCertificate', apiKey: 'agora_app_certificate' },
  { key: 'agora_customer_id', label: 'agora appId', type: 'text', notes: 'agora Console obtains customer ID', apiKey: 'agora_customer_id' },
  { key: 'agora_customer_key', label: 'agora key', type: 'text', notes: 'agora key', apiKey: 'agora_customer_key' },
  { key: 'facebook_app_id', label: 'Facebook AppID', type: 'text', notes: 'facebook appid', apiKey: 'facebook_app_id' },
  { key: 'facebook_app_secret', label: 'facebook appSecret', type: 'text', notes: 'facebook appSecret', apiKey: 'facebook_app_secret' },
  { key: 'google_client_id', label: 'google Client id (Android)', type: 'text', notes: 'google Client ID(Android)', apiKey: 'google_client_id' },
  { key: 'google_ios_client_id', label: 'google Client id (iOS)', type: 'text', notes: 'google Client ID(Ios)', apiKey: 'google_ios_client_id' },
  { key: 'game_public_key', label: 'Three party game public key', type: 'textarea', notes: '', apiKey: 'game_public_key', rows: 12 },
  { key: 'game_private_key', label: 'Three party game private key', type: 'textarea', notes: '', apiKey: 'game_private_key', rows: 16 },
  { key: 'google_redirect_url', label: 'PC front-end callback address', type: 'text', notes: '', apiKey: 'google_redirect_url' },
  { key: 'ipinfo_token', label: 'Ipinfo token', type: 'text', notes: '', apiKey: 'ipinfo_token' },
];

type AlibabaCloudField = {
  key: keyof AlibabaCloudConfig;
  label: string;
  type: 'toggle_yes_no' | 'text';
  notes: string;
  apiKey: string;
};

/** Alibaba Cloud Upload Configuration fields (8 fields) */
const ALIBABA_CLOUD_FIELDS: AlibabaCloudField[] = [
  { key: 'open_sts', label: 'Enable STS', type: 'toggle_yes_no', notes: 'Upload the image directly to OSS without transferring; htt', apiKey: 'open_sts' },
  { key: 'sts_access_key_id', label: 'STS_AccessKeyID', type: 'text', notes: 'Aliyun STS, AccessKeyID', apiKey: 'sts_access_key_id' },
  { key: 'sts_access_key_secret', label: 'STS_AccessKeySecret', type: 'text', notes: 'Aliyun STS, AccessKeySecret', apiKey: 'sts_access_key_secret' },
  { key: 'sts_access_key_role_arn', label: 'STS_RoleArn', type: 'text', notes: 'Open STS, RoleArn', apiKey: 'sts_access_key_role_arn' },
  { key: 'oss_bucket_name', label: 'oss_bucket_name', type: 'text', notes: "Alibaba Cloud's bucket", apiKey: 'oss_bucket_name' },
  { key: 'oss_region', label: 'oss_region', type: 'text', notes: 'Alibaba Cloud region', apiKey: 'oss_region' },
  { key: 'oss_domain', label: 'oss_domain', type: 'text', notes: 'Alibaba Cloud upload domain name', apiKey: 'oss_domain' },
  { key: 'aly_accelerate_domain_name', label: 'Custom APK domain name', type: 'text', notes: '', apiKey: 'aly_accelerate_domain_name' },
];

type TencentLiveField = {
  key: keyof TencentLiveConfig;
  label: string;
  type: 'toggle_yes_no' | 'text' | 'number';
  notes: string;
  apiKey: string;
};

/** Tencent Live Configuration fields (15 fields) */
const TENCENT_LIVE_FIELDS: TencentLiveField[] = [
  { key: 'tim_sdkappid', label: 'SdkAppId', type: 'text', notes: 'Tencent Cloud Communication SdkAppId', apiKey: 'tim_sdkappid' },
  { key: 'tencent_sha_key', label: 'Instant messaging key', type: 'text', notes: '', apiKey: 'tencent_sha_key' },
  { key: 'tim_identifier', label: 'Account administrator', type: 'text', notes: 'Tencent Cloud IM account administrator', apiKey: 'tim_identifier' },
  { key: 'vodset_app_id', label: 'Tencent Cloud Live App ID', type: 'text', notes: 'Tencent Cloud Live APP_ID', apiKey: 'vodset_app_id' },
  { key: 'qcloud_bizid', label: 'Tencent bizid', type: 'text', notes: 'Tencent Cloud Live bizid', apiKey: 'qcloud_bizid' },
  { key: 'tpush_domain', label: 'Tencent Cloud live streaming push address', type: 'text', notes: "Add push in domain management under Tencent Cloud Console's Cloud Live product", apiKey: 'tpush_domain' },
  { key: 'tpull_domain', label: 'Tencent Cloud live streaming pull address', type: 'text', notes: "Add pull in domain management under Tencent Cloud Console's Cloud Live product", apiKey: 'tpull_domain' },
  { key: 'qcloud_secret_id', label: 'Cloud API Account SecretId', type: 'text', notes: 'Tencent [Cloud API Account SecretId]', apiKey: 'qcloud_secret_id' },
  { key: 'qcloud_secret_key', label: 'Cloud API SecretKey', type: 'text', notes: 'Tencent [Cloud API SecretKey]', apiKey: 'qcloud_secret_key' },
  { key: 'qcloud_auth_key', label: 'API authentication key', type: 'text', notes: 'Tencent Cloud Live Management API Authentication Key', apiKey: 'qcloud_auth_key' },
  { key: 'qcloud_pull_security_key', label: 'Pull stream anti-theft key', type: 'text', notes: 'Tencent Cloud live management pull stream anti-theft key', apiKey: 'qcloud_pull_security_key' },
  { key: 'qcloud_security_key', label: 'Push stream anti-theft key', type: 'text', notes: 'Tencent Cloud Live Management Push Anti-Theft Key', apiKey: 'qcloud_security_key' },
  { key: 'open_usersig_cache', label: 'Force update usersig', type: 'toggle_yes_no', notes: 'Enable forced update of usersig cache, 0 to disable', apiKey: 'open_usersig_cache' },
  { key: 'tim_account_type', label: 'accountType', type: 'number', notes: 'Tencent Cloud Communications account type', apiKey: 'tim_account_type' },
  { key: 'im_yun_url', label: 'IM exclusive domain name', type: 'text', notes: 'IM exclusive domain name', apiKey: 'im_yun_url' },
];

function BasicConfigSection({
  config,
  onChange,
  onSave,
  saving,
  saved,
}: {
  config: BasicConfig;
  onChange: (key: keyof BasicConfig, value: number | string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {BASIC_CONFIG_FIELDS.map((field) => (
            <Box
              key={field.key}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { sm: 'flex-start' },
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-of-type': { borderBottom: 0, pb: 0 },
              }}
            >
              <Box sx={{ flex: { sm: '0 0 220px' }, minWidth: 0 }}>
                <Typography variant="body1" fontWeight={500}>
                  {field.label}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {(field.type === 'toggle_yes_no' || field.type === 'toggle_on_off' || field.type === 'toggle_off_on') && (
                  <ToggleButtonGroup
                    value={config[field.key] as 0 | 1}
                    exclusive
                    onChange={(_, v) => v != null && onChange(field.key, v)}
                    size="small"
                    color="primary"
                    sx={{
                      '& .MuiToggleButton-root': {
                        px: 2,
                        py: 1,
                        textTransform: 'none',
                        '&.Mui-selected': { fontWeight: 600 },
                      },
                    }}
                  >
                    <ToggleButton value={0}>
                      {field.type === 'toggle_yes_no' ? 'No' : field.type === 'toggle_off_on' ? 'Turn off' : 'Off'}
                    </ToggleButton>
                    <ToggleButton value={1}>
                      {field.type === 'toggle_yes_no' ? 'Yes' : field.type === 'toggle_off_on' ? 'Turn on' : 'On'}
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
                {field.type === 'number_hour' && (
                  <TextField
                    type="number"
                    value={config[field.key]}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10) || 0;
                      onChange(field.key, Math.min(23, Math.max(0, v)));
                    }}
                    inputProps={{ min: 0, max: 23 }}
                    size="small"
                    sx={{ width: { xs: '100%', sm: 120 } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption" color="text.secondary">
                            (0-23)
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                {field.type === 'number' && (
                  <TextField
                    type="number"
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, parseInt(e.target.value, 10) || 0)}
                    size="small"
                    sx={{ width: { xs: '100%', sm: 140 } }}
                  />
                )}
                {field.type === 'text' && (
                  <TextField
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ maxWidth: 320 }}
                  />
                )}
                {field.type === 'textarea' && (
                  <TextField
                    multiline
                    rows={4}
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    size="small"
                    fullWidth
                    placeholder="One IP per line"
                  />
                )}
                {field.type === 'image' && (
                  <ImageUpload
                    value={String(config[field.key] ?? '')}
                    onChange={(url) => onChange(field.key, url)}
                    helperText={field.notes ? `Notes: ${field.notes}` : undefined}
                  />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {field.notes ? `Notes: ${field.notes} ` : ''}(Front Desk Identification: {field.apiKey})
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" onClick={onSave} disabled={saving} sx={{ minWidth: 120 }}>
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function ApplicationBasicConfigSection({
  config,
  onChange,
  onSave,
  saving,
  saved,
}: {
  config: ApplicationBasicConfig;
  onChange: (key: keyof ApplicationBasicConfig, value: number | string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {APPLICATION_BASIC_FIELDS.map((field) => (
            <Box
              key={field.key}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { sm: 'flex-start' },
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-of-type': { borderBottom: 0, pb: 0 },
              }}
            >
              <Box sx={{ flex: { sm: '0 0 260px' }, minWidth: 0 }}>
                <Typography variant="body1" fontWeight={500}>
                  {field.label}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {(field.type === 'toggle_yes_no' || field.type === 'toggle_close_open') && (
                  <ToggleButtonGroup
                    value={config[field.key] as 0 | 1}
                    exclusive
                    onChange={(_, v) => v != null && onChange(field.key, v)}
                    size="small"
                    color="primary"
                    sx={{
                      '& .MuiToggleButton-root': {
                        px: 2,
                        py: 1,
                        textTransform: 'none',
                        '&.Mui-selected': { fontWeight: 600 },
                      },
                    }}
                  >
                    <ToggleButton value={0}>
                      {field.type === 'toggle_close_open' ? 'Close' : 'No'}
                    </ToggleButton>
                    <ToggleButton value={1}>
                      {field.type === 'toggle_close_open' ? 'Open' : 'Yes'}
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
                {field.type === 'select' && field.options && (
                  <FormControl size="small" sx={{ minWidth: 280 }}>
                    <Select
                      value={config[field.key]}
                      onChange={(e) => onChange(field.key, e.target.value as number | string)}
                      displayEmpty
                      renderValue={(v) => field.options!.find((o) => o.value === v)?.label ?? ''}
                    >
                      {field.options.map((opt) => (
                        <MenuItem key={String(opt.value)} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {field.type === 'number' && (
                  <TextField
                    type="number"
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, parseInt(e.target.value, 10) || 0)}
                    size="small"
                    sx={{ width: { xs: '100%', sm: 140 } }}
                  />
                )}
                {field.type === 'text' && (
                  <TextField
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ maxWidth: 400 }}
                  />
                )}
                {field.type === 'textarea' && (
                  <TextField
                    multiline
                    rows={4}
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    size="small"
                    fullWidth
                  />
                )}
                {field.type === 'image' && (
                  <ImageUpload
                    value={String(config[field.key] ?? '')}
                    onChange={(url) => onChange(field.key, url)}
                    helperText={field.notes ? `Notes: ${field.notes}` : undefined}
                  />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {field.notes ? `Notes: ${field.notes} ` : ''}(Front Desk Identification: {field.apiKey})
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" onClick={onSave} disabled={saving} sx={{ minWidth: 120 }}>
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function ThirdPartyAccountConfigSection({
  config,
  onChange,
  onSave,
  saving,
  saved,
}: {
  config: ThirdPartyAccountConfig;
  onChange: (key: keyof ThirdPartyAccountConfig, value: number | string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {THIRD_PARTY_ACCOUNT_FIELDS.map((field) => (
            <Box
              key={field.key}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { sm: 'flex-start' },
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-of-type': { borderBottom: 0, pb: 0 },
              }}
            >
              <Box sx={{ flex: { sm: '0 0 260px' }, minWidth: 0 }}>
                <Typography variant="body1" fontWeight={500}>
                  {field.label}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {(field.type === 'toggle_yes_no' || field.type === 'toggle_close_open') && (
                  <ToggleButtonGroup
                    value={config[field.key] as 0 | 1}
                    exclusive
                    onChange={(_, v) => v != null && onChange(field.key, v)}
                    size="small"
                    color="primary"
                    sx={{
                      '& .MuiToggleButton-root': {
                        px: 2,
                        py: 1,
                        textTransform: 'none',
                        '&.Mui-selected': { fontWeight: 600 },
                      },
                    }}
                  >
                    <ToggleButton value={0}>
                      {field.type === 'toggle_close_open' ? 'Close' : 'No'}
                    </ToggleButton>
                    <ToggleButton value={1}>
                      {field.type === 'toggle_close_open' ? 'Open' : 'Yes'}
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
                {field.type === 'text' && (
                  <TextField
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ maxWidth: 500 }}
                  />
                )}
                {field.type === 'textarea' && (
                  <TextField
                    multiline
                    rows={field.rows ?? 4}
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                  />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {field.notes ? `Notes: ${field.notes} ` : ''}(Front Desk Identification: {field.apiKey})
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" onClick={onSave} disabled={saving} sx={{ minWidth: 120 }}>
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function AlibabaCloudConfigSection({
  config,
  onChange,
  onSave,
  saving,
  saved,
}: {
  config: AlibabaCloudConfig;
  onChange: (key: keyof AlibabaCloudConfig, value: number | string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ALIBABA_CLOUD_FIELDS.map((field) => (
            <Box
              key={field.key}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { sm: 'flex-start' },
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-of-type': { borderBottom: 0, pb: 0 },
              }}
            >
              <Box sx={{ flex: { sm: '0 0 260px' }, minWidth: 0 }}>
                <Typography variant="body1" fontWeight={500}>
                  {field.label}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {field.type === 'toggle_yes_no' && (
                  <ToggleButtonGroup
                    value={config[field.key] as 0 | 1}
                    exclusive
                    onChange={(_, v) => v != null && onChange(field.key, v)}
                    size="small"
                    color="primary"
                    sx={{
                      '& .MuiToggleButton-root': {
                        px: 2,
                        py: 1,
                        textTransform: 'none',
                        '&.Mui-selected': { fontWeight: 600 },
                      },
                    }}
                  >
                    <ToggleButton value={0}>No</ToggleButton>
                    <ToggleButton value={1}>Yes</ToggleButton>
                  </ToggleButtonGroup>
                )}
                {field.type === 'text' && (
                  <TextField
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ maxWidth: 500 }}
                  />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {field.notes ? `Notes: ${field.notes} ` : ''}(Front Desk Identification: {field.apiKey})
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" onClick={onSave} disabled={saving} sx={{ minWidth: 120 }}>
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function TencentLiveConfigSection({
  config,
  onChange,
  onSave,
  saving,
  saved,
}: {
  config: TencentLiveConfig;
  onChange: (key: keyof TencentLiveConfig, value: number | string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {TENCENT_LIVE_FIELDS.map((field) => (
            <Box
              key={field.key}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { sm: 'flex-start' },
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-of-type': { borderBottom: 0, pb: 0 },
              }}
            >
              <Box sx={{ flex: { sm: '0 0 320px' }, minWidth: 0 }}>
                <Typography variant="body1" fontWeight={500}>
                  {field.label}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {field.type === 'toggle_yes_no' && (
                  <ToggleButtonGroup
                    value={config[field.key] as 0 | 1}
                    exclusive
                    onChange={(_, v) => v != null && onChange(field.key, v)}
                    size="small"
                    color="primary"
                    sx={{
                      '& .MuiToggleButton-root': {
                        px: 2,
                        py: 1,
                        textTransform: 'none',
                        '&.Mui-selected': { fontWeight: 600 },
                      },
                    }}
                  >
                    <ToggleButton value={0}>No</ToggleButton>
                    <ToggleButton value={1}>Yes</ToggleButton>
                  </ToggleButtonGroup>
                )}
                {field.type === 'text' && (
                  <TextField
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ maxWidth: 500 }}
                  />
                )}
                {field.type === 'number' && (
                  <TextField
                    type="number"
                    value={config[field.key]}
                    onChange={(e) => onChange(field.key, parseInt(e.target.value, 10) || 0)}
                    size="small"
                    sx={{ width: { xs: '100%', sm: 140 } }}
                  />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {field.notes ? `Notes: ${field.notes} ` : ''}(Front Desk Identification: {field.apiKey})
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" onClick={onSave} disabled={saving} sx={{ minWidth: 120 }}>
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function PlaceholderSection({ label }: { label: string }) {
  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {label} — content will be added
        </Typography>
      </CardContent>
    </Card>
  );
}

function MobileConfigPageContent() {
  const searchParams = useSearchParams();
  const addTab = useTabsStore((s) => s.addTab);
  const sectionParam = searchParams.get('section') || 'system-basic';
  const validSection = MOBILE_CONFIG_MENUS.some((m) => m.id === sectionParam)
    ? sectionParam
    : 'system-basic';
  const [activeSection, setActiveSection] = useState(validSection);

  const [config, setConfig] = useState<BasicConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [appConfig, setAppConfig] = useState<ApplicationBasicConfig | null>(null);
  const [appLoading, setAppLoading] = useState(false);
  const [appSaving, setAppSaving] = useState(false);
  const [appSaved, setAppSaved] = useState(false);

  const [thirdPartyConfig, setThirdPartyConfig] = useState<ThirdPartyAccountConfig | null>(null);
  const [thirdPartyLoading, setThirdPartyLoading] = useState(false);
  const [thirdPartySaving, setThirdPartySaving] = useState(false);
  const [thirdPartySaved, setThirdPartySaved] = useState(false);

  const [alibabaCloudConfig, setAlibabaCloudConfig] = useState<AlibabaCloudConfig | null>(null);
  const [alibabaCloudLoading, setAlibabaCloudLoading] = useState(false);
  const [alibabaCloudSaving, setAlibabaCloudSaving] = useState(false);
  const [alibabaCloudSaved, setAlibabaCloudSaved] = useState(false);

  const [tencentLiveConfig, setTencentLiveConfig] = useState<TencentLiveConfig | null>(null);
  const [tencentLiveLoading, setTencentLiveLoading] = useState(false);
  const [tencentLiveSaving, setTencentLiveSaving] = useState(false);
  const [tencentLiveSaved, setTencentLiveSaved] = useState(false);

  useEffect(() => {
    setActiveSection(validSection);
  }, [validSection]);

  useEffect(() => {
    if (activeSection === 'system-basic') {
      setLoading(true);
      fetchBasicConfig()
        .then(setConfig)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'application-basic') {
      setAppLoading(true);
      fetchApplicationBasicConfig()
        .then(setAppConfig)
        .finally(() => setAppLoading(false));
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'third-party-account') {
      setThirdPartyLoading(true);
      fetchThirdPartyAccountConfig()
        .then(setThirdPartyConfig)
        .finally(() => setThirdPartyLoading(false));
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'alibaba-cloud') {
      setAlibabaCloudLoading(true);
      fetchAlibabaCloudConfig()
        .then(setAlibabaCloudConfig)
        .finally(() => setAlibabaCloudLoading(false));
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'tencent-live') {
      setTencentLiveLoading(true);
      fetchTencentLiveConfig()
        .then(setTencentLiveConfig)
        .finally(() => setTencentLiveLoading(false));
    }
  }, [activeSection]);

  useEffect(() => {
    addTab({
      id: '/dashboard/system/mobile-config',
      label: 'Mobile Configuration',
      path: '/dashboard/system/mobile-config',
      breadcrumbs: ['Home', 'System Management', 'Mobile Configuration'],
    });
  }, [addTab]);

  const handleChange = (key: keyof BasicConfig, value: number | string) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  };

  const handleAppChange = (key: keyof ApplicationBasicConfig, value: number | string) => {
    setAppConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
    setAppSaved(false);
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateBasicConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleAppSave = async () => {
    if (!appConfig) return;
    setAppSaving(true);
    setAppSaved(false);
    try {
      await updateApplicationBasicConfig(appConfig);
      setAppSaved(true);
      setTimeout(() => setAppSaved(false), 2000);
    } finally {
      setAppSaving(false);
    }
  };

  const handleThirdPartyChange = (key: keyof ThirdPartyAccountConfig, value: number | string) => {
    setThirdPartyConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
    setThirdPartySaved(false);
  };

  const handleThirdPartySave = async () => {
    if (!thirdPartyConfig) return;
    setThirdPartySaving(true);
    setThirdPartySaved(false);
    try {
      await updateThirdPartyAccountConfig(thirdPartyConfig);
      setThirdPartySaved(true);
      setTimeout(() => setThirdPartySaved(false), 2000);
    } finally {
      setThirdPartySaving(false);
    }
  };

  const handleAlibabaCloudChange = (key: keyof AlibabaCloudConfig, value: number | string) => {
    setAlibabaCloudConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
    setAlibabaCloudSaved(false);
  };

  const handleAlibabaCloudSave = async () => {
    if (!alibabaCloudConfig) return;
    setAlibabaCloudSaving(true);
    setAlibabaCloudSaved(false);
    try {
      await updateAlibabaCloudConfig(alibabaCloudConfig);
      setAlibabaCloudSaved(true);
      setTimeout(() => setAlibabaCloudSaved(false), 2000);
    } finally {
      setAlibabaCloudSaving(false);
    }
  };

  const handleTencentLiveChange = (key: keyof TencentLiveConfig, value: number | string) => {
    setTencentLiveConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
    setTencentLiveSaved(false);
  };

  const handleTencentLiveSave = async () => {
    if (!tencentLiveConfig) return;
    setTencentLiveSaving(true);
    setTencentLiveSaved(false);
    try {
      await updateTencentLiveConfig(tencentLiveConfig);
      setTencentLiveSaved(true);
      setTimeout(() => setTencentLiveSaved(false), 2000);
    } finally {
      setTencentLiveSaving(false);
    }
  };

  const handleMenuClick = (id: string) => {
    setActiveSection(id);
    const url = new URL(window.location.href);
    url.searchParams.set('section', id);
    window.history.replaceState({}, '', url.pathname + '?' + url.searchParams.toString());
  };

  const currentMenu = MOBILE_CONFIG_MENUS.find((m) => m.id === activeSection);

  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, py: 2 }}>
      {/* Left sub-menu */}
      <Paper
        variant="outlined"
        sx={{
          width: { md: 240 },
          flexShrink: 0,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <List disablePadding dense>
          {MOBILE_CONFIG_MENUS.map((item) => (
            <ListItemButton
              key={item.id}
              selected={activeSection === item.id}
              onClick={() => handleMenuClick(item.id)}
              sx={{
                py: 1.25,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* Right content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          {currentMenu?.label ?? 'Mobile Configuration'}
        </Typography>

        {activeSection === 'system-basic' && (
          <>
            {loading || !config ? (
              <Typography color="text.secondary">Loading...</Typography>
            ) : (
              <BasicConfigSection
                config={config}
                onChange={handleChange}
                onSave={handleSave}
                saving={saving}
                saved={saved}
              />
            )}
          </>
        )}

        {activeSection === 'application-basic' && (
          <>
            {appLoading || !appConfig ? (
              <Typography color="text.secondary">Loading...</Typography>
            ) : (
              <ApplicationBasicConfigSection
                config={appConfig}
                onChange={handleAppChange}
                onSave={handleAppSave}
                saving={appSaving}
                saved={appSaved}
              />
            )}
          </>
        )}

        {activeSection === 'third-party-account' && (
          <>
            {thirdPartyLoading || !thirdPartyConfig ? (
              <Typography color="text.secondary">Loading...</Typography>
            ) : (
              <ThirdPartyAccountConfigSection
                config={thirdPartyConfig}
                onChange={handleThirdPartyChange}
                onSave={handleThirdPartySave}
                saving={thirdPartySaving}
                saved={thirdPartySaved}
              />
            )}
          </>
        )}

        {activeSection === 'alibaba-cloud' && (
          <>
            {alibabaCloudLoading || !alibabaCloudConfig ? (
              <Typography color="text.secondary">Loading...</Typography>
            ) : (
              <AlibabaCloudConfigSection
                config={alibabaCloudConfig}
                onChange={handleAlibabaCloudChange}
                onSave={handleAlibabaCloudSave}
                saving={alibabaCloudSaving}
                saved={alibabaCloudSaved}
              />
            )}
          </>
        )}

        {activeSection === 'tencent-live' && (
          <>
            {tencentLiveLoading || !tencentLiveConfig ? (
              <Typography color="text.secondary">Loading...</Typography>
            ) : (
              <TencentLiveConfigSection
                config={tencentLiveConfig}
                onChange={handleTencentLiveChange}
                onSave={handleTencentLiveSave}
                saving={tencentLiveSaving}
                saved={tencentLiveSaved}
              />
            )}
          </>
        )}

        {activeSection === 'anchor-withdrawal' && (
          <GenericSection fetchFn={fetchAnchorWithdrawalConfig} updateFn={updateAnchorWithdrawalConfig} fields={ANCHOR_WITHDRAWAL_FIELDS} />
        )}
        {activeSection === 'app-version' && (
          <GenericSection fetchFn={fetchAppVersionConfig} updateFn={updateAppVersionConfig} fields={APP_VERSION_FIELDS} />
        )}
        {activeSection === 'paid-live' && (
          <GenericSection fetchFn={fetchPaidLiveConfig} updateFn={updatePaidLiveConfig} fields={PAID_LIVE_FIELDS} />
        )}
        {activeSection === 'video-module' && (
          <GenericSection fetchFn={fetchVideoModuleConfig} updateFn={updateVideoModuleConfig} fields={VIDEO_MODULE_FIELDS} />
        )}
        {activeSection === 'family-config' && (
          <GenericSection fetchFn={fetchFamilyConfig} updateFn={updateFamilyConfig} fields={FAMILY_FIELDS} />
        )}
        {activeSection === 'live-sorting' && (
          <GenericSection fetchFn={fetchLiveSortingConfig} updateFn={updateLiveSortingConfig} fields={LIVE_SORTING_FIELDS} />
        )}
        {activeSection === 'share-settings' && (
          <GenericSection fetchFn={fetchShareSettingsConfig} updateFn={updateShareSettingsConfig} fields={SHARE_SETTINGS_FIELDS} />
        )}
        {activeSection === 'robot-settings' && (
          <GenericSection fetchFn={fetchRobotSettingsConfig} updateFn={updateRobotSettingsConfig} fields={ROBOT_SETTINGS_FIELDS} />
        )}
        {activeSection === 'inviting-distribution' && (
          <GenericSection fetchFn={fetchInvitingDistributionConfig} updateFn={updateInvitingDistributionConfig} fields={INVITING_DISTRIBUTION_FIELDS} />
        )}
        {activeSection === 'consumer-price' && (
          <GenericSection fetchFn={fetchConsumerPriceConfig} updateFn={updateConsumerPriceConfig} fields={CONSUMER_PRICE_FIELDS} />
        )}
        {activeSection === 'dynamic-module' && (
          <GenericSection fetchFn={fetchDynamicModuleConfig} updateFn={updateDynamicModuleConfig} fields={DYNAMIC_MODULE_FIELDS} />
        )}
        {activeSection === 'download-page' && (
          <GenericSection fetchFn={fetchDownloadPageConfig} updateFn={updateDownloadPageConfig} fields={DOWNLOAD_PAGE_FIELDS} />
        )}
        {activeSection === 'red-envelope' && (
          <GenericSection fetchFn={fetchRedEnvelopeConfig} updateFn={updateRedEnvelopeConfig} fields={RED_ENVELOPE_FIELDS} />
        )}
        {![
          'system-basic', 'application-basic', 'third-party-account', 'alibaba-cloud', 'tencent-live',
          'anchor-withdrawal', 'app-version', 'paid-live', 'video-module', 'family-config', 'live-sorting',
          'share-settings', 'robot-settings', 'inviting-distribution', 'consumer-price', 'dynamic-module',
          'download-page', 'red-envelope',
        ].includes(activeSection) && (
          <PlaceholderSection label={currentMenu?.label ?? 'Section'} />
        )}
      </Box>
    </Box>
  );
}

export default function MobileConfigPage() {
  return (
    <Suspense fallback={<Box sx={{ py: 4 }}><Typography color="text.secondary">Loading...</Typography></Box>}>
      <MobileConfigPageContent />
    </Suspense>
  );
}
