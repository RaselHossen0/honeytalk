/**
 * Mobile Configuration API service.
 * Replace demo implementation with actual API calls when backend is ready.
 */

import type {
  BasicConfig,
  ApplicationBasicConfig,
  ThirdPartyAccountConfig,
  AlibabaCloudConfig,
  TencentLiveConfig,
  AnchorWithdrawalConfig,
  AppVersionConfig,
  PaidLiveConfig,
  VideoModuleConfig,
  FamilyConfig,
  LiveSortingConfig,
  ShareSettingsConfig,
  RobotSettingsConfig,
  InvitingDistributionConfig,
  ConsumerPriceConfig,
  DynamicModuleConfig,
  DownloadPageConfig,
  RedEnvelopeConfig,
} from '@/types/mobile-config';
import {
  DEFAULT_BASIC_CONFIG,
  DEFAULT_APPLICATION_BASIC_CONFIG,
  DEFAULT_THIRD_PARTY_ACCOUNT_CONFIG,
  DEFAULT_ALIBABA_CLOUD_CONFIG,
  DEFAULT_TENCENT_LIVE_CONFIG,
  DEFAULT_ANCHOR_WITHDRAWAL_CONFIG,
  DEFAULT_APP_VERSION_CONFIG,
  DEFAULT_PAID_LIVE_CONFIG,
  DEFAULT_VIDEO_MODULE_CONFIG,
  DEFAULT_FAMILY_CONFIG,
  DEFAULT_LIVE_SORTING_CONFIG,
  DEFAULT_SHARE_SETTINGS_CONFIG,
  DEFAULT_ROBOT_SETTINGS_CONFIG,
  DEFAULT_INVITING_DISTRIBUTION_CONFIG,
  DEFAULT_CONSUMER_PRICE_CONFIG,
  DEFAULT_DYNAMIC_MODULE_CONFIG,
  DEFAULT_DOWNLOAD_PAGE_CONFIG,
  DEFAULT_RED_ENVELOPE_CONFIG,
} from '@/types/mobile-config';

const ENDPOINT = '/system/mobile-config';

/** Fetch basic config (all 28 fields). Replace with: api.get<BasicConfig>(ENDPOINT + '/basic') */
export async function fetchBasicConfig(): Promise<BasicConfig> {
  await new Promise((r) => setTimeout(r, 300));
  return { ...DEFAULT_BASIC_CONFIG };
}

/** Update basic config. Replace with: api.put(ENDPOINT + '/basic', config, token) */
export async function updateBasicConfig(config: BasicConfig): Promise<BasicConfig> {
  await new Promise((r) => setTimeout(r, 500));
  return config;
}

/** Fetch application basic config. Replace with: api.get<ApplicationBasicConfig>(ENDPOINT + '/application-basic') */
export async function fetchApplicationBasicConfig(): Promise<ApplicationBasicConfig> {
  await new Promise((r) => setTimeout(r, 300));
  return { ...DEFAULT_APPLICATION_BASIC_CONFIG };
}

/** Update application basic config. Replace with: api.put(ENDPOINT + '/application-basic', config, token) */
export async function updateApplicationBasicConfig(config: ApplicationBasicConfig): Promise<ApplicationBasicConfig> {
  await new Promise((r) => setTimeout(r, 500));
  return config;
}

/** Fetch third party account config. Replace with: api.get<ThirdPartyAccountConfig>(ENDPOINT + '/third-party-account') */
export async function fetchThirdPartyAccountConfig(): Promise<ThirdPartyAccountConfig> {
  await new Promise((r) => setTimeout(r, 300));
  return { ...DEFAULT_THIRD_PARTY_ACCOUNT_CONFIG };
}

/** Update third party account config. Replace with: api.put(ENDPOINT + '/third-party-account', config, token) */
export async function updateThirdPartyAccountConfig(config: ThirdPartyAccountConfig): Promise<ThirdPartyAccountConfig> {
  await new Promise((r) => setTimeout(r, 500));
  return config;
}

/** Fetch Alibaba Cloud config. Replace with: api.get<AlibabaCloudConfig>(ENDPOINT + '/alibaba-cloud') */
export async function fetchAlibabaCloudConfig(): Promise<AlibabaCloudConfig> {
  await new Promise((r) => setTimeout(r, 300));
  return { ...DEFAULT_ALIBABA_CLOUD_CONFIG };
}

/** Update Alibaba Cloud config. Replace with: api.put(ENDPOINT + '/alibaba-cloud', config, token) */
export async function updateAlibabaCloudConfig(config: AlibabaCloudConfig): Promise<AlibabaCloudConfig> {
  await new Promise((r) => setTimeout(r, 500));
  return config;
}

/** Fetch Tencent Live config. Replace with: api.get<TencentLiveConfig>(ENDPOINT + '/tencent-live') */
export async function fetchTencentLiveConfig(): Promise<TencentLiveConfig> {
  await new Promise((r) => setTimeout(r, 300));
  return { ...DEFAULT_TENCENT_LIVE_CONFIG };
}

/** Update Tencent Live config. Replace with: api.put(ENDPOINT + '/tencent-live', config, token) */
export async function updateTencentLiveConfig(config: TencentLiveConfig): Promise<TencentLiveConfig> {
  await new Promise((r) => setTimeout(r, 500));
  return config;
}

function createConfigApi<T>(key: string, defaultConfig: T) {
  return {
    fetch: async (): Promise<T> => {
      await new Promise((r) => setTimeout(r, 300));
      return { ...defaultConfig };
    },
    update: async (config: T): Promise<T> => {
      await new Promise((r) => setTimeout(r, 500));
      return config;
    },
  };
}

const anchorWithdrawalApi = createConfigApi('anchor-withdrawal', DEFAULT_ANCHOR_WITHDRAWAL_CONFIG);
const appVersionApi = createConfigApi('app-version', DEFAULT_APP_VERSION_CONFIG);
const paidLiveApi = createConfigApi('paid-live', DEFAULT_PAID_LIVE_CONFIG);
const videoModuleApi = createConfigApi('video-module', DEFAULT_VIDEO_MODULE_CONFIG);
const familyApi = createConfigApi('family-config', DEFAULT_FAMILY_CONFIG);
const liveSortingApi = createConfigApi('live-sorting', DEFAULT_LIVE_SORTING_CONFIG);
const shareSettingsApi = createConfigApi('share-settings', DEFAULT_SHARE_SETTINGS_CONFIG);
const robotSettingsApi = createConfigApi('robot-settings', DEFAULT_ROBOT_SETTINGS_CONFIG);
const invitingDistributionApi = createConfigApi('inviting-distribution', DEFAULT_INVITING_DISTRIBUTION_CONFIG);
const consumerPriceApi = createConfigApi('consumer-price', DEFAULT_CONSUMER_PRICE_CONFIG);
const dynamicModuleApi = createConfigApi('dynamic-module', DEFAULT_DYNAMIC_MODULE_CONFIG);
const downloadPageApi = createConfigApi('download-page', DEFAULT_DOWNLOAD_PAGE_CONFIG);
const redEnvelopeApi = createConfigApi('red-envelope', DEFAULT_RED_ENVELOPE_CONFIG);

export const fetchAnchorWithdrawalConfig = anchorWithdrawalApi.fetch as () => Promise<AnchorWithdrawalConfig>;
export const updateAnchorWithdrawalConfig = anchorWithdrawalApi.update as (c: AnchorWithdrawalConfig) => Promise<AnchorWithdrawalConfig>;
export const fetchAppVersionConfig = appVersionApi.fetch as () => Promise<AppVersionConfig>;
export const updateAppVersionConfig = appVersionApi.update as (c: AppVersionConfig) => Promise<AppVersionConfig>;
export const fetchPaidLiveConfig = paidLiveApi.fetch as () => Promise<PaidLiveConfig>;
export const updatePaidLiveConfig = paidLiveApi.update as (c: PaidLiveConfig) => Promise<PaidLiveConfig>;
export const fetchVideoModuleConfig = videoModuleApi.fetch as () => Promise<VideoModuleConfig>;
export const updateVideoModuleConfig = videoModuleApi.update as (c: VideoModuleConfig) => Promise<VideoModuleConfig>;
export const fetchFamilyConfig = familyApi.fetch as () => Promise<FamilyConfig>;
export const updateFamilyConfig = familyApi.update as (c: FamilyConfig) => Promise<FamilyConfig>;
export const fetchLiveSortingConfig = liveSortingApi.fetch as () => Promise<LiveSortingConfig>;
export const updateLiveSortingConfig = liveSortingApi.update as (c: LiveSortingConfig) => Promise<LiveSortingConfig>;
export const fetchShareSettingsConfig = shareSettingsApi.fetch as () => Promise<ShareSettingsConfig>;
export const updateShareSettingsConfig = shareSettingsApi.update as (c: ShareSettingsConfig) => Promise<ShareSettingsConfig>;
export const fetchRobotSettingsConfig = robotSettingsApi.fetch as () => Promise<RobotSettingsConfig>;
export const updateRobotSettingsConfig = robotSettingsApi.update as (c: RobotSettingsConfig) => Promise<RobotSettingsConfig>;
export const fetchInvitingDistributionConfig = invitingDistributionApi.fetch as () => Promise<InvitingDistributionConfig>;
export const updateInvitingDistributionConfig = invitingDistributionApi.update as (c: InvitingDistributionConfig) => Promise<InvitingDistributionConfig>;
export const fetchConsumerPriceConfig = consumerPriceApi.fetch as () => Promise<ConsumerPriceConfig>;
export const updateConsumerPriceConfig = consumerPriceApi.update as (c: ConsumerPriceConfig) => Promise<ConsumerPriceConfig>;
export const fetchDynamicModuleConfig = dynamicModuleApi.fetch as () => Promise<DynamicModuleConfig>;
export const updateDynamicModuleConfig = dynamicModuleApi.update as (c: DynamicModuleConfig) => Promise<DynamicModuleConfig>;
export const fetchDownloadPageConfig = downloadPageApi.fetch as () => Promise<DownloadPageConfig>;
export const updateDownloadPageConfig = downloadPageApi.update as (c: DownloadPageConfig) => Promise<DownloadPageConfig>;
export const fetchRedEnvelopeConfig = redEnvelopeApi.fetch as () => Promise<RedEnvelopeConfig>;
export const updateRedEnvelopeConfig = redEnvelopeApi.update as (c: RedEnvelopeConfig) => Promise<RedEnvelopeConfig>;
