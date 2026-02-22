/**
 * Mobile Configuration types.
 * Field names match Front Desk Identification for easy API integration.
 */

/** Basic configuration - all fields in one section */
export interface BasicConfig {
  must_authentication: 0 | 1;
  has_private_chat: 0 | 1;
  is_limit_time_start: number;
  is_limit_time_end: number;
  is_change_name: 0 | 1;
  daily_online_task: 0 | 1;
  program_title: string;
  app_name: string;
  short_name: string;
  diamonds_name: string;
  account_name: string;
  ticket_name: string;
  diamonds_rate: number;
  exchange_rate: number;
  join_room_limit: number;
  join_room_remind_limit: number;
  login_send_score: number;
  register_gift_diamonds: number;
  rank_cache_time: number;
  sign_in_is_ip: 0 | 1;
  account_ip: string;
  app_logo: string;
  live_page_size: number;
  init_version: string;
  feedback_customer_service_avatar: string;
  proxy_recharge_switch: 0 | 1;
  Limit_number_registered_devices: number;
  Limit_number_registered_IP: number;
}

/** Application Basic Settings - extended config */
export interface ApplicationBasicConfig {
  default_nickname: string;
  view_page_size: number;
  is_classify: 0 | 1;
  is_no_light: 0 | 1;
  private_letter_lv: number;
  live_level_lv: number;
  live_streaming_activation_conditions: number;
  voice_streaming_activation_conditions: number;
  psd_room_level_restriction: number;
  is_prop_notify: 0 | 1;
  show_follow_msg_lv: number;
  show_follow_msg: 0 | 1;
  send_msg_lv: number;
  is_show_identify_number: 0 | 1;
  search_change: 0 | 1;
  open_room_hide: 0 | 1;
  has_dirty_words: 0 | 1;
  onlinetime_to_experience: number;
  has_lianmai_lv: number;
  name_limit: 0 | 1;
  attestation_time: number;
  speak_level: number;
  follow_max: number;
  jr_user_level: number;
  monitor_overtime: number;
  iap_recharge: 0 | 1;
  is_pk: 0 | 1;
  kicking_time: number;
  mysterious_picture: string;
  wish_limit: number;
  dirty_words_list: string;
  default_avatar: string;
  identify_hold_example: string;
  consumer_price_Icon: string;
  is_test_verification_code: 0 | 1;
  test_verification_code: string;
  recharge_background_instructions: string;
  recharge_background_level: number;
  game_screen_restrictions: number;
  effective_duration_voice_computing: number;
  effective_days: number;
  popular_live_types: number;
  voice_level_lv: number;
  give_yourself_gift_switch: 0 | 1;
}

/** Third party account configuration */
export interface ThirdPartyAccountConfig {
  google_login: 0 | 1;
  facebook_login: 0 | 1;
  has_mobile_login: 0 | 1;
  agora_app_id: string;
  agora_app_certificate: string;
  agora_customer_id: string;
  agora_customer_key: string;
  facebook_app_id: string;
  facebook_app_secret: string;
  google_client_id: string;
  google_ios_client_id: string;
  game_public_key: string;
  game_private_key: string;
  google_redirect_url: string;
  ipinfo_token: string;
}

/** Alibaba Cloud Upload Configuration */
export interface AlibabaCloudConfig {
  open_sts: 0 | 1;
  sts_access_key_id: string;
  sts_access_key_secret: string;
  sts_access_key_role_arn: string;
  oss_bucket_name: string;
  oss_region: string;
  oss_domain: string;
  aly_accelerate_domain_name: string;
}

/** Tencent Live Configuration */
export interface TencentLiveConfig {
  tim_sdkappid: string;
  tencent_sha_key: string;
  tim_identifier: string;
  vodset_app_id: string;
  qcloud_bizid: string;
  tpush_domain: string;
  tpull_domain: string;
  qcloud_secret_id: string;
  qcloud_secret_key: string;
  qcloud_auth_key: string;
  qcloud_pull_security_key: string;
  qcloud_security_key: string;
  open_usersig_cache: 0 | 1;
  tim_account_type: number;
  im_yun_url: string;
}

/** Anchor withdrawal settings */
export interface AnchorWithdrawalConfig {
  refund_explain: string;
  month_carry_max: number;
  month_carry_min: number;
  month_carry_one: 0 | 1;
  day_cash_max: number;
  ticket_catty_min: number;
  ticket_catty_ratio: number;
  is_refund: 0 | 1;
}

/** APP version management */
export interface AppVersionConfig {
  forced_upgrade_tips: string;
  forced_upgrade: 0 | 1;
}

/** Paid Live Configuration */
export interface PaidLiveConfig {
  live_pay_scene_max: number;
  live_pay_scene_min: number;
  live_pay_max: number;
  live_pay_min: number;
  ticket_to_rate: number;
  uesddiamonds_to_score: number;
  live_pay_rule: number;
  live_pay_fee: number;
  live_count_down: number;
  live_pay_num: number;
  countdown: number;
  is_only_play_video: 0 | 1;
}

/** Video Module Settings */
export interface VideoModuleConfig {
  svideo_must_authentication: 0 | 1;
  short_video_is_need_audit: 0 | 1;
  sts_video_limit: number;
}

/** Family related configuration */
export interface FamilyConfig {
  profit_ratio: number;
  lucky_profit_ratio: number;
  videotime_to_experience: number;
  contribution_to_experience: number;
}

/** Live streaming sorting weight */
export interface LiveSortingConfig {
  top_weight: number;
  video_like_weight: number;
  num_weight: number;
  sort_weight: number;
  ticke_weight: number;
  level_weight: number;
  video_ticket_weight: number;
  video_focus_weight: number;
  video_share_weight: number;
  focus_weight: number;
}

/** Share related settings */
export interface ShareSettingsConfig {
  share_address: string;
  share_title: string;
  share_content: string;
}

/** Robot Settings */
export interface RobotSettingsConfig {
  robot_num: number;
  virtual_number: number;
  game_robot_switch: 0 | 1;
}

/** Inviting Distribution Settings */
export interface InvitingDistributionConfig {
  invite_rewards_recharge: number;
}

/** Consumer Price Configuration */
export interface ConsumerPriceConfig {
  barrage_coin: number;
  change_name: number;
}

/** Dynamic Module Settings */
export interface DynamicModuleConfig {
  is_dynamic_certification: 0 | 1;
  dynamic_dirty_word: string;
  dynaic_video_length: number;
  dynaic_txt_length: number;
  dynaic_img_length: number;
}

/** Download Page Settings */
export interface DownloadPageConfig {
  download_log: string;
  download_app_title: string;
  download_app_introduce: string;
  download_bg: string;
  download_app_bg: string;
}

/** Red envelope settings */
export interface RedEnvelopeConfig {
  red_handling_fee: number;
  red_envelope_switch: 0 | 1;
  red_max_number: number;
  red_min_number: number;
  red_max_people: number;
  red_min_people: number;
}

export const DEFAULT_BASIC_CONFIG: BasicConfig = {
  must_authentication: 0,
  has_private_chat: 1,
  is_limit_time_start: 20,
  is_limit_time_end: 20,
  is_change_name: 1,
  daily_online_task: 1,
  program_title: 'Bogo Live',
  app_name: 'Bogo Live',
  short_name: 'Bogo Live',
  diamonds_name: 'Diamond',
  account_name: 'Bogo ID',
  ticket_name: 'Coin',
  diamonds_rate: 15,
  exchange_rate: 16,
  join_room_limit: 0,
  join_room_remind_limit: 99999999,
  login_send_score: 5,
  register_gift_diamonds: 0,
  rank_cache_time: 30,
  sign_in_is_ip: 0,
  account_ip: '',
  app_logo: '',
  live_page_size: 20,
  init_version: '2021022469',
  feedback_customer_service_avatar: '',
  proxy_recharge_switch: 1,
  Limit_number_registered_devices: 5,
  Limit_number_registered_IP: 10,
};

export const DEFAULT_APPLICATION_BASIC_CONFIG: ApplicationBasicConfig = {
  default_nickname: 'Bogo',
  view_page_size: 99999,
  is_classify: 0,
  is_no_light: 0,
  private_letter_lv: 0,
  live_level_lv: 0,
  live_streaming_activation_conditions: 0,
  voice_streaming_activation_conditions: 0,
  psd_room_level_restriction: 0,
  is_prop_notify: 1,
  show_follow_msg_lv: 1,
  show_follow_msg: 0,
  send_msg_lv: 1,
  is_show_identify_number: 0,
  search_change: 0,
  open_room_hide: 0,
  has_dirty_words: 0,
  onlinetime_to_experience: 0,
  has_lianmai_lv: 0,
  name_limit: 0,
  attestation_time: 0,
  speak_level: 0,
  follow_max: 999999,
  jr_user_level: 0,
  monitor_overtime: 60,
  iap_recharge: 0,
  is_pk: 1,
  kicking_time: 1000,
  mysterious_picture: '',
  wish_limit: 100,
  dirty_words_list: 'Wechat,WhatsApp',
  default_avatar: '',
  identify_hold_example: '',
  consumer_price_Icon: '',
  is_test_verification_code: 0,
  test_verification_code: '888888',
  recharge_background_instructions: 'Please check the recharge information before confirming the recharge. If the recharge is wrong, the platform will not be responsible for it, please handle it yourself.',
  recharge_background_level: 3,
  game_screen_restrictions: 0,
  effective_duration_voice_computing: 0,
  effective_days: 1,
  popular_live_types: 0,
  voice_level_lv: 0,
  give_yourself_gift_switch: 1,
};

export const DEFAULT_THIRD_PARTY_ACCOUNT_CONFIG: ThirdPartyAccountConfig = {
  google_login: 0,
  facebook_login: 0,
  has_mobile_login: 1,
  agora_app_id: 'a4ba997fc9de44bc8568b5d96720e63f',
  agora_app_certificate: '785f48a2cedf43fcab23256fef84c38b',
  agora_customer_id: '',
  agora_customer_key: '',
  facebook_app_id: '',
  facebook_app_secret: '',
  google_client_id: '335932658874-ts7ffc0trf8fu9ddfc4jcq88akvjea9k.apps.googleusercontent.com',
  google_ios_client_id: '335932658874-42q87rr96h0ur1v1ngc9bi875q17kgsr.apps.googleusercontent.com',
  game_public_key: '',
  game_private_key: '',
  google_redirect_url: 'http://localhost:8080',
  ipinfo_token: 'd916165bb91549',
};

export const DEFAULT_ALIBABA_CLOUD_CONFIG: AlibabaCloudConfig = {
  open_sts: 0,
  sts_access_key_id: '', // Set via env or config - never commit real keys
  sts_access_key_secret: '', // Set via env or config - never commit real keys
  sts_access_key_role_arn: 'acs:ram::1501445862739826:role/bogoliveintldemo',
  oss_bucket_name: 'bogolivesp',
  oss_region: 'ap-southeast-1',
  oss_domain: 'https://bogolivesp.oss-ap-southeast-1.aliyuncs.com',
  aly_accelerate_domain_name: '',
};

export const DEFAULT_TENCENT_LIVE_CONFIG: TencentLiveConfig = {
  tim_sdkappid: '1721000468',
  tencent_sha_key: '16fe13a0afed147bd972d5e151a75fcbf452f73e656341693f8f21d8c4070be8',
  tim_identifier: 'administrator',
  vodset_app_id: '',
  qcloud_bizid: '165954',
  tpush_domain: '165954.livepush.myqcloud.com',
  tpull_domain: 'globallivepull.bogodev.com',
  qcloud_secret_id: '',
  qcloud_secret_key: '',
  qcloud_auth_key: '',
  qcloud_pull_security_key: '87ebfaf7ddededf680ec4466fd79262d',
  qcloud_security_key: '89ef33f73c49c2a2da98be404a34551b',
  open_usersig_cache: 0,
  tim_account_type: 0,
  im_yun_url: 'Singapore',
};

export const DEFAULT_ANCHOR_WITHDRAWAL_CONFIG: AnchorWithdrawalConfig = {
  refund_explain: '',
  month_carry_max: 0,
  month_carry_min: 10,
  month_carry_one: 0,
  day_cash_max: 10000,
  ticket_catty_min: 100,
  ticket_catty_ratio: 0.06,
  is_refund: 1,
};

export const DEFAULT_APP_VERSION_CONFIG: AppVersionConfig = {
  forced_upgrade_tips: 'Please go to settings to check for the latest version upgrade',
  forced_upgrade: 0,
};

export const DEFAULT_PAID_LIVE_CONFIG: PaidLiveConfig = {
  live_pay_scene_max: 99999,
  live_pay_scene_min: 1,
  live_pay_max: 99999,
  live_pay_min: 1,
  ticket_to_rate: 1,
  uesddiamonds_to_score: 1,
  live_pay_rule: 1,
  live_pay_fee: 2,
  live_count_down: 30,
  live_pay_num: 0,
  countdown: 10,
  is_only_play_video: 0,
};

export const DEFAULT_VIDEO_MODULE_CONFIG: VideoModuleConfig = {
  svideo_must_authentication: 0,
  short_video_is_need_audit: 0,
  sts_video_limit: 60,
};

export const DEFAULT_FAMILY_CONFIG: FamilyConfig = {
  profit_ratio: 15,
  lucky_profit_ratio: 50,
  videotime_to_experience: 0,
  contribution_to_experience: 0,
};

export const DEFAULT_LIVE_SORTING_CONFIG: LiveSortingConfig = {
  top_weight: 1,
  video_like_weight: 1,
  num_weight: 1,
  sort_weight: 100,
  ticke_weight: 10,
  level_weight: 1,
  video_ticket_weight: 80,
  video_focus_weight: 20,
  video_share_weight: 20,
  focus_weight: 10,
};

export const DEFAULT_SHARE_SETTINGS_CONFIG: ShareSettingsConfig = {
  share_address: 'https://mapi.bogolive.net/h5/download',
  share_title: 'BogoLive',
  share_content: 'BogoLive',
};

export const DEFAULT_ROBOT_SETTINGS_CONFIG: RobotSettingsConfig = {
  robot_num: 5,
  virtual_number: 4,
  game_robot_switch: 0,
};

export const DEFAULT_INVITING_DISTRIBUTION_CONFIG: InvitingDistributionConfig = {
  invite_rewards_recharge: 3,
};

export const DEFAULT_CONSUMER_PRICE_CONFIG: ConsumerPriceConfig = {
  barrage_coin: 1000,
  change_name: 100,
};

export const DEFAULT_DYNAMIC_MODULE_CONFIG: DynamicModuleConfig = {
  is_dynamic_certification: 0,
  dynamic_dirty_word: '',
  dynaic_video_length: 60,
  dynaic_txt_length: 0,
  dynaic_img_length: 0,
};

export const DEFAULT_DOWNLOAD_PAGE_CONFIG: DownloadPageConfig = {
  download_log: '',
  download_app_title: 'BogoLive',
  download_app_introduce: 'BogoLive Download',
  download_bg: '',
  download_app_bg: '',
};

export const DEFAULT_RED_ENVELOPE_CONFIG: RedEnvelopeConfig = {
  red_handling_fee: 10,
  red_envelope_switch: 1,
  red_max_number: 0,
  red_min_number: 0,
  red_max_people: 10,
  red_min_people: 2,
};
