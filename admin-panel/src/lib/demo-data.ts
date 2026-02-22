/**
 * Demo data for admin panel. Replace with API calls when backend is ready.
 * Structure matches expected API response shapes for easy migration.
 */

import type { Task } from '@/types/task';
import type { BlackoutRecord } from '@/types/blackout';
import type { IncomeExpenditureRecord } from '@/types/income-expenditure';
import type { PrivateMessageGiftStat, PrivateMessageGiftDetail } from '@/types/private-message-gifts';
import type { AnchorTag } from '@/types/anchor-tag';
import type { NicknameRestriction } from '@/types/nickname-restriction';
import type { EncryptionKeyConfig } from '@/types/encryption-key';
import type { Role } from '@/types/role';
import type { UserManagementRecord } from '@/types/user-management';
import type { AdvertisingConfig } from '@/types/advertising';
import type { ExchangeRule } from '@/types/exchange';
import type { PurchaseRule } from '@/types/purchase';
import type { OperationLog } from '@/types/operation-log';
import type { Country } from '@/types/country';
import type { PopularCountry } from '@/types/popular-country';
import type { Administrator } from '@/types/administrator';
import type { PushMessage } from '@/types/push-message';
import type { PKRecord } from '@/types/pk-record';
import type { RoomBackground } from '@/types/room-background';
import type { DurationTask } from '@/types/duration-task';
import type { DurationTaskLog } from '@/types/duration-task-log';
import type { MusicTrack } from '@/types/music-track';
import type { Gift } from '@/types/gift';
import type { LuckyGift } from '@/types/lucky-gift';
import type { Car, CarPrice, CarPurchaseRecord, CarGiftRecord } from '@/types/car';
import type { GuardianCategory, GuardianPriceConfig, GuardianPrivilege, GuardianRecord } from '@/types/guardian';
import type { HeadFrame, HeadFrameConsumptionRecord, HeadFrameGiftRecord } from '@/types/head-frame';
import type { LevelAvatarFrameReward } from '@/types/level';
import type { NobleRecharge, NobleRechargeRecord, NobleGiftRecord } from '@/types/noble';
import type { VIPPurchaseRule, VIPConsumptionRecord } from '@/types/vip';
import type { CheckInReward, SignInListRecord } from '@/types/check-in';
import type { PaymentInterface, RechargeRecord, Bank, Withdrawal, InviteUserWithdrawal, RechargeStatisticsRecord, WithdrawalStatisticsRecord, AnchorDailyReportRecord, MonthlyReportRecord, ManualRechargeRecord } from '@/types/fund';
import type { DynamicPost, DynamicComment, DynamicTopic } from '@/types/dynamic';
import type { PluginConfig } from '@/types/plugin';
import type { AgentAccount, AgentRechargeRecord, AgentSalesRecord, AgentInvitationRecord } from '@/types/agent-recharge';
import type { AppVersion } from '@/types/version';
import type { ReportType, Report } from '@/types/report';
import type { RedEnvelopeRecord, RedEnvelopeAmountConfig, RedEnvelopeQuantityConfig } from '@/types/red-envelope';

export const TASKS_DEMO: Task[] = [
  { id: 1, number: 1, title: 'Share to Facebook', type: 'Share anchor tasks', targetQuantity: 10, rewardAmount: 1, taskTimes: 1, timeInterval: 0, status: 'Valid' },
  { id: 2, number: 2, title: 'Daily login', type: 'Online tasks', targetQuantity: 1, rewardAmount: 1, taskTimes: 1, timeInterval: 10, status: 'Valid' },
  { id: 3, number: 4, title: 'Follow the Host', type: 'Follow streamer tasks', targetQuantity: 10, rewardAmount: 1, taskTimes: 1, timeInterval: 10, status: 'Valid' },
  { id: 4, number: 5, title: 'Reward host', type: 'Rewarding Anchor Task', targetQuantity: 100000, rewardAmount: 1000, taskTimes: 1, timeInterval: 5, status: 'Valid' },
];

export const BLACKOUT_RECORDS_DEMO: BlackoutRecord[] = [
  { id: 1, userId: 168162, userNickname: 'Bogo168162', identifying: '1585486880', days: 1, ipOrDevice: 'Phone number', note: 'test', expirationTime: '2025-04-16 08:41:58', operator: 'admin (1)', creationTime: '2025-04-15 08:41:58', updateTime: '2025-04-15 08:46:17', status: 'Ended' },
  { id: 2, userId: 166599, userNickname: 'Scythe', identifying: '112.245.59.1', days: 1, ipOrDevice: 'IP', note: 'test', expirationTime: '2025-04-17 10:22:00', operator: 'admin (1)', creationTime: '2025-04-16 10:22:00', updateTime: '2025-04-16 10:25:33', status: 'Ended' },
  { id: 3, userId: 166725, userNickname: 'MÎShÃL MÜG ÅL', identifying: '52', days: 1, ipOrDevice: 'Phone number', note: 'test', expirationTime: '2025-04-18 14:15:22', operator: 'admin (1)', creationTime: '2025-04-17 14:15:22', updateTime: '2025-04-17 14:18:05', status: 'Ended' },
  { id: 4, userId: 167222, userNickname: 'DemoUser', identifying: '7', days: 1, ipOrDevice: 'IP', note: 'test', expirationTime: '2025-04-19 09:30:00', operator: 'admin (1)', creationTime: '2025-04-18 09:30:00', updateTime: '2025-04-18 09:32:41', status: 'Ended' },
  { id: 5, userId: 168500, userNickname: 'CoolUser', identifying: '86 138****1234', days: 1, ipOrDevice: 'Phone number', note: 'test', expirationTime: '2025-04-20 11:45:00', operator: 'admin (1)', creationTime: '2025-04-19 11:45:00', updateTime: '2025-04-19 11:48:22', status: 'Active' },
];

export const INCOME_EXPENDITURE_DEMO: IncomeExpenditureRecord[] = [
  { id: 1, number: 273282, userId: 168781, userNickname: 'ZETSU', numberOfChanges: -100, content: '1IndividualRomance: 0-100', category: 'Gift', addTime: '2026-02-14 23:51:38' },
  { id: 2, number: 273281, userId: 168780, userNickname: 'LuckyPlayer', numberOfChanges: 200, content: 'Lucky jackpot reward: 200-0', category: 'Lucky jackpot', addTime: '2026-02-14 23:50:15' },
  { id: 3, number: 273280, userId: 168779, userNickname: '✨StarUser✨', numberOfChanges: 1000, content: 'Lucky gift: 1IndividualA: 1000-0', category: 'Lucky winning', addTime: '2026-02-14 23:48:22' },
  { id: 4, number: 273279, userId: 168778, userNickname: 'Bogo168778', numberOfChanges: 500, content: 'Gift received: DiamondPack 500-0', category: 'Gift', addTime: '2026-02-14 23:45:10' },
  { id: 5, number: 273278, userId: 168777, userNickname: 'HostMaster', numberOfChanges: -50, content: 'Private message: 50-0', category: 'Gift', addTime: '2026-02-14 23:42:55' },
  { id: 6, number: 273277, userId: 168776, userNickname: 'DiamondKing', numberOfChanges: 1500, content: 'Lucky jackpot: MegaWin 1500-0', category: 'Lucky jackpot', addTime: '2026-02-14 23:40:33' },
  { id: 7, number: 273276, userId: 168775, userNickname: 'CoolUser', numberOfChanges: -200, content: 'Live gift: Rose 200-0', category: 'Gift', addTime: '2026-02-14 23:38:18' },
  { id: 8, number: 273275, userId: 168774, userNickname: '🦋Butterfly🦋', numberOfChanges: 300, content: 'Lucky winning: Spin 300-0', category: 'Lucky winning', addTime: '2026-02-14 23:35:42' },
  { id: 9, number: 273274, userId: 168773, userNickname: 'ProGamer', numberOfChanges: -75, content: 'Chat gift: 75-0', category: 'Gift', addTime: '2026-02-14 23:32:07' },
  { id: 10, number: 273273, userId: 168772, userNickname: 'TopDiamond', numberOfChanges: 2500, content: 'Lucky jackpot reward: 2500-0', category: 'Lucky jackpot', addTime: '2026-02-14 23:28:51' },
];

export const PRIVATE_MESSAGE_GIFTS_DEMO: PrivateMessageGiftStat[] = [
  { id: 1, anchorId: 166586, anchorNickname: 'DOLLAR', totalRevenueCoin: 1000, totalNumberOfPeople: 1 },
  { id: 2, anchorId: 166593, anchorNickname: 'Ffffewe', totalRevenueCoin: 50, totalNumberOfPeople: 3 },
  { id: 3, anchorId: 166766, anchorNickname: 'Bogo166766', totalRevenueCoin: 3, totalNumberOfPeople: 4 },
  { id: 4, anchorId: 166770, anchorNickname: 'RJ', totalRevenueCoin: 0, totalNumberOfPeople: 2 },
  { id: 5, anchorId: 166772, anchorNickname: 'Anwar', totalRevenueCoin: 120, totalNumberOfPeople: 1 },
  { id: 6, anchorId: 166775, anchorNickname: 'ib2030', totalRevenueCoin: 500, totalNumberOfPeople: 2 },
  { id: 7, anchorId: 166780, anchorNickname: "it's me", totalRevenueCoin: 200, totalNumberOfPeople: 1 },
  { id: 8, anchorId: 166782, anchorNickname: '👑Silent🎶king', totalRevenueCoin: 75, totalNumberOfPeople: 3 },
  { id: 9, anchorId: 166785, anchorNickname: '🦋KAJI🅱️🅾️🦋', totalRevenueCoin: 30, totalNumberOfPeople: 1 },
  { id: 10, anchorId: 166788, anchorNickname: 'Bogo168422', totalRevenueCoin: 150, totalNumberOfPeople: 5 },
  { id: 11, anchorId: 166790, anchorNickname: 'StarAnchor', totalRevenueCoin: 800, totalNumberOfPeople: 4 },
  { id: 12, anchorId: 166792, anchorNickname: 'ProHost', totalRevenueCoin: 250, totalNumberOfPeople: 2 },
  { id: 13, anchorId: 166795, anchorNickname: 'TopGifter', totalRevenueCoin: 1200, totalNumberOfPeople: 6 },
];

const DOLLAR_166586_DETAILS: PrivateMessageGiftDetail[] = [
  { id: 1, userId: 166586, userNickname: 'DOLLAR', totalRevenueCoin: 1000, giftTime: '2026-02-02 14:33:15' },
  { id: 2, userId: 166586, userNickname: 'DOLLAR', totalRevenueCoin: 1000, giftTime: '2026-02-02 14:33:22' },
  ...Array.from({ length: 42 }, (_, i) => {
    const sec = 28 + i;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return {
      id: 3 + i,
      userId: 166586,
      userNickname: 'DOLLAR',
      totalRevenueCoin: 100,
      giftTime: `2026-02-02 14:${(33 + m).toString().padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    };
  }),
];

/** Gift details per anchor: users who sent gifts to each anchor. Key = anchorId. */
export const PRIVATE_MESSAGE_GIFT_DETAILS_DEMO: Record<number, PrivateMessageGiftDetail[]> = {
  166586: DOLLAR_166586_DETAILS,
  166593: [
    { id: 101, userId: 168001, userNickname: 'GifterA', totalRevenueCoin: 30, giftTime: '2026-02-02 10:00:00' },
    { id: 102, userId: 168002, userNickname: 'GifterB', totalRevenueCoin: 15, giftTime: '2026-02-02 10:05:00' },
    { id: 103, userId: 168003, userNickname: 'GifterC', totalRevenueCoin: 5, giftTime: '2026-02-02 10:10:00' },
  ],
};

export const ANCHOR_TAGS_DEMO: AnchorTag[] = [
  { id: 12, label: 'Cute', gender: 'Female', color: '#F61073' },
  { id: 13, label: 'Model', gender: 'Female', color: '#E813D7' },
  { id: 14, label: 'Attractive', gender: 'Female', color: '#F1E212' },
  { id: 16, label: 'Charming', gender: 'Female', color: '#F406A1' },
  { id: 17, label: 'Pretty', gender: 'Female', color: '#FF3587' },
  { id: 18, label: 'Strong', gender: 'Male', color: '#D66890' },
  { id: 19, label: 'Irresistible', gender: 'Female', color: '#645C84' },
  { id: 20, label: 'Gorgeous', gender: 'Female', color: '#FF2E87' },
  { id: 22, label: 'Adorable', gender: 'Female', color: '#CF3F3F' },
  { id: 23, label: 'Elegant', gender: 'Female', color: '#F11298' },
];

export const USER_MANAGEMENT_DEMO: UserManagementRecord[] = [
  { id: 1, userId: 166667, nickname: 'Herry', country: '', phone: '86 156****6666', diamonds: 0, consumptionAmount: 1991810, withdrawableBalance: 0, isRobotAvatar: false, coinAccumulated: 0, recommended: false, certification: 'Not verified', points: 5, follow: 0, fans: 0, level: 'Lv1', permanentBan: false, fancyNumber: '-', totalViewers: 0, registerIp: '41.45.79.100', loginIp: '2409:40c2:1155:9e56:8c59:acff:fe46:a701', deviceInfo: '2400a042115f2397ca69c978020197b0d', email: 'her***@gmail.com', facebook: '', googleId: '10481248061783\n3780985', appleId: '', inviter: 'None', giftRevenue: false, status: 'Valid', isVip: false, disablePopular: false, globallyMuteIm: false, loginMethod: 'Mobile', registrationTime: '2026-02-14 07:41:29' },
  { id: 2, userId: 168757, nickname: 'MAYO AFRAF FR', country: '', phone: '833****516', diamonds: 0, consumptionAmount: 0, withdrawableBalance: 0, isRobotAvatar: true, coinAccumulated: 0, recommended: false, certification: 'Not verified', points: 5, follow: 0, fans: 0, level: 'Lv1', permanentBan: false, fancyNumber: '-', totalViewers: 0, registerIp: '2409:40e0:3a:72eb:dc10:d424:474c:1d89', loginIp: '2409:40e0:3a:72eb:dc10:d424:474c:1d89', deviceInfo: '2c6bc0025610e34e18143ef2d0034d645', email: 'mh7****512@gmail.com', facebook: '', googleId: '', appleId: '001899.c77fb5b1\nde5047728f883f5\n4a3b12c86.1249', inviter: 'None', giftRevenue: false, status: 'Valid', isVip: false, disablePopular: false, globallyMuteIm: false, loginMethod: 'Apple', registrationTime: '2026-02-14 07:11:42' },
  { id: 3, userId: 166893, nickname: 'Chloe', country: '', phone: '86 158****3256', diamonds: 0, consumptionAmount: 0, withdrawableBalance: 0, isRobotAvatar: false, coinAccumulated: 0, recommended: false, certification: 'Not verified', points: 5, follow: 0, fans: 0, level: 'Lv1', permanentBan: false, fancyNumber: '-', totalViewers: 0, registerIp: '112.245.59.152', loginIp: '112.245.59.152', deviceInfo: 'a1b2c3d4e5f6g7h8i9j0', email: 'nit****.in@gmail.com', facebook: '', googleId: '10481248061784', appleId: '', inviter: 'None', giftRevenue: false, status: 'Valid', isVip: false, disablePopular: false, globallyMuteIm: false, loginMethod: 'Google', registrationTime: '2026-02-13 18:49:24' },
  { id: 4, userId: 166638, nickname: 'Harold', country: '', phone: '86 155****1622', diamonds: 0, consumptionAmount: 7450, withdrawableBalance: 0, isRobotAvatar: false, coinAccumulated: 0, recommended: true, certification: 'Verified', points: 5, follow: 0, fans: 0, level: 'Lv1', permanentBan: false, fancyNumber: '-', totalViewers: 0, registerIp: '54.178.81.11', loginIp: '54.178.81.11', deviceInfo: 'd4e5f6g7h8i9j0k1l2m3', email: '', facebook: '', googleId: '', appleId: '', inviter: 'None', giftRevenue: false, status: 'Valid', isVip: false, disablePopular: false, globallyMuteIm: false, loginMethod: 'Mobile', registrationTime: '2026-02-12 14:13:24' },
  { id: 5, userId: 166894, nickname: 'Madison', country: '', phone: '86 454****9653', diamonds: 0, consumptionAmount: 0, withdrawableBalance: 0, isRobotAvatar: false, coinAccumulated: 0, recommended: false, certification: 'Not verified', points: 5, follow: 0, fans: 0, level: 'Lv1', permanentBan: false, fancyNumber: '-', totalViewers: 0, registerIp: '18.143.100.85', loginIp: '18.143.100.85', deviceInfo: 'e5f6g7h8i9j0k1l2m3n4', email: '', facebook: '', googleId: '', appleId: '', inviter: 'None', giftRevenue: false, status: 'Valid', isVip: false, disablePopular: false, globallyMuteIm: false, loginMethod: 'Mobile', registrationTime: '2026-02-12 10:17:57' },
  { id: 6, userId: 169009, nickname: "I'M Possible", country: 'Egypt(818)', countryCode: 'EG', phone: '', diamonds: 0, consumptionAmount: 0, withdrawableBalance: 0, isRobotAvatar: false, coinAccumulated: 0, recommended: false, certification: 'Not verified', points: 5, follow: 0, fans: 0, level: 'Lv1', permanentBan: false, fancyNumber: '-', totalViewers: 0, registerIp: '203.0.113.45', loginIp: '203.0.113.45', deviceInfo: 'f6g7h8i9j0k1l2m3n4o5', email: '', facebook: '', googleId: '10481248061785', appleId: '', inviter: 'None', giftRevenue: false, status: 'Valid', isVip: false, disablePopular: false, globallyMuteIm: false, loginMethod: 'Google', registrationTime: '2026-02-12 08:55:35' },
  { id: 7, userId: 169008, nickname: 'NitroHost', country: 'India(356)', countryCode: 'IN', phone: '', diamonds: 0, consumptionAmount: 0, withdrawableBalance: 0, isRobotAvatar: false, coinAccumulated: 0, recommended: false, certification: 'Not verified', points: 5, follow: 0, fans: 0, level: 'Lv1', permanentBan: false, fancyNumber: '-', totalViewers: 0, registerIp: '192.168.1.10', loginIp: '192.168.1.10', deviceInfo: 'g7h8i9j0k1l2m3n4o5p6', email: '', facebook: '', googleId: '', appleId: '', inviter: 'None', giftRevenue: false, status: 'Valid', isVip: false, disablePopular: false, globallyMuteIm: false, loginMethod: 'Google', registrationTime: '2026-02-10 01:09:53' },
  { id: 8, userId: 169007, nickname: 'Tourist', country: 'United States of America(840)', countryCode: 'US', phone: '', diamonds: 0, consumptionAmount: 0, withdrawableBalance: 0, isRobotAvatar: false, coinAccumulated: 0, recommended: false, certification: 'Not verified', points: 5, follow: 0, fans: 0, level: 'Lv1', permanentBan: false, fancyNumber: '-', totalViewers: 0, registerIp: '10.0.0.1', loginIp: '10.0.0.1', deviceInfo: 'h8i9j0k1l2m3n4o5p6q7', email: '', facebook: '', googleId: '', appleId: '001899.c77fb5b2', inviter: 'None', giftRevenue: false, status: 'Valid', isVip: false, disablePopular: false, globallyMuteIm: false, loginMethod: 'Apple', registrationTime: '2026-02-10 01:09:53' },
  { id: 9, userId: 169006, nickname: 'Bogo169006', country: 'India(356)', countryCode: 'IN', phone: '86 399****7475', diamonds: 0, consumptionAmount: 0, withdrawableBalance: 0, isRobotAvatar: false, coinAccumulated: 0, recommended: false, certification: 'Not verified', points: 5, follow: 0, fans: 0, level: 'Lv1', permanentBan: false, fancyNumber: '-', totalViewers: 0, registerIp: '41.45.79.101', loginIp: '41.45.79.101', deviceInfo: 'i9j0k1l2m3n4o5p6q7r8', email: '', facebook: '', googleId: '10481248061786', appleId: '', inviter: 'None', giftRevenue: false, status: 'Valid', isVip: false, disablePopular: false, globallyMuteIm: false, loginMethod: 'Mobile', registrationTime: '2026-02-10 01:09:53' },
];

export const ROLES_DEMO: Role[] = [
  {
    id: 28,
    roleCode: 'dev',
    roleName: 'dev',
    note: '',
    contacted: true,
    disconnected: true,
    status: 'Unban',
    canDelete: true,
    canEditPermissions: true,
  },
  {
    id: 2,
    roleCode: 'admin',
    roleName: 'Administrators',
    note: '',
    contacted: true,
    disconnected: true,
    status: 'Unban',
    canDelete: false,
    canEditPermissions: false,
  },
];

export const demoAdvertising: AdvertisingConfig[] = [
  { id: 1, number: 1, title: 'Weekly Topic', imageUrl: 'https://picsum.photos/710/188?random=1', displayPosition: 'Carousel', type: 'Ranking list APP jump', sort: 9 },
  { id: 2, number: 2, title: 'Banner Ad', imageUrl: 'https://picsum.photos/710/188?random=2', displayPosition: 'Home', type: 'Image', sort: 1 },
  { id: 3, number: 3, title: 'Promo Banner', imageUrl: 'https://picsum.photos/710/188?random=3', displayPosition: 'Carousel', type: 'Carousel', sort: 2 },
];

export const demoExchangeRules: ExchangeRule[] = [
  { id: 1, number: 1, diamonds: 100, coin: 1000, status: 'Valid' },
  { id: 2, number: 2, diamonds: 500, coin: 5000, status: 'Valid' },
];

export const demoPurchaseRules: PurchaseRule[] = [
  {
    id: 1,
    number: 1,
    name: 'Diamonds100',
    diamonds: 100,
    price: 1.0,
    applePayDiamonds: 100,
    applePayPrice: 2.0,
    appleProjectId: 'pay1',
    diamondGifting: 5,
    googlePay: '',
    sort: 1,
    status: 'Valid',
  },
  {
    id: 2,
    number: 2,
    name: 'Premium Pack',
    diamonds: 500,
    price: 4.99,
    applePayDiamonds: 500,
    applePayPrice: 4.99,
    appleProjectId: 'com.example.premium',
    diamondGifting: 50,
    googlePay: '',
    sort: 2,
    status: 'Valid',
  },
];

export const NICKNAME_RESTRICTIONS_DEMO: NicknameRestriction[] = [
  { id: 133, nickname: 'WhatsApp' },
  { id: 134, nickname: 'Facebook' },
  { id: 135, nickname: 'fuck' },
  { id: 136, nickname: 'yash' },
  { id: 137, nickname: 'king' },
  { id: 138, nickname: 'cum' },
  { id: 139, nickname: 'Ali' },
  { id: 140, nickname: 'porn' },
  { id: 141, nickname: 'promotion' },
  { id: 142, nickname: 'Official' },
  { id: 143, nickname: 'admin' },
  { id: 144, nickname: 'support' },
];

export const ENCRYPTION_KEYS_DEMO: EncryptionKeyConfig[] = [
  { id: 1, number: 10, key: '1400480612000000', packingAndFilling: true, valid: true },
  { id: 2, number: 11, key: '1400480612000001', packingAndFilling: false, valid: true },
  { id: 3, number: 12, key: '1400480612000002', packingAndFilling: true, valid: false },
];

export const demoOperationLogs: OperationLog[] = [
  { id: 23706, number: 23706, logInformation: 'adminLogin Successful', addTime: '2026-02-15 18:08:03', ip: '103.220.205.222', systemAdministrator: 'administrator', result: 'Success', module: 'admin/login', action: 'login' },
  { id: 23705, number: 23705, logInformation: 'Admin ended prem official live room', addTime: '2026-02-15 18:07:52', ip: '2409:40e0:3a:72eb:dc10:d424:474c:1d89', systemAdministrator: 'administrator', result: 'Success', module: 'admin/video', action: 'closeLive' },
  { id: 23704, number: 23704, logInformation: 'Playback video saved successfully', addTime: '2026-02-15 18:07:48', ip: '2409:40e0:3a:72eb:dc10:d424:474c:1d89', systemAdministrator: 'administrator', result: 'Success', module: 'admin/video History', action: 'saveVideoPIayBack' },
  { id: 23703, number: 23703, logInformation: 'Video published online', addTime: '2026-02-15 18:07:12', ip: '103.220.205.222', systemAdministrator: 'administrator', result: 'Success', module: 'admin/video', action: 'videoOnline' },
  { id: 23702, number: 23702, logInformation: 'User role updated', addTime: '2026-02-15 18:05:33', ip: '2409:40e0:3a:72eb:dc10:d424:474c:1d89', systemAdministrator: 'administrator', result: 'Success', module: 'admin/roles', action: 'updateRole' },
  { id: 23701, number: 23701, logInformation: 'Gift configuration modified', addTime: '2026-02-15 18:03:21', ip: '103.220.205.222', systemAdministrator: 'administrator', result: 'Success', module: 'admin/gifts', action: 'updateGift' },
  { id: 23700, number: 23700, logInformation: 'Exchange rule created', addTime: '2026-02-15 18:01:15', ip: '2409:40e0:3a:72eb:dc10:d424:474c:1d89', systemAdministrator: 'administrator', result: 'Success', module: 'admin/system', action: 'createExchangeRule' },
  { id: 23699, number: 23699, logInformation: 'Admin logout', addTime: '2026-02-15 17:58:42', ip: '103.220.205.222', systemAdministrator: 'administrator', result: 'Success', module: 'admin/login', action: 'logout' },
];

export const demoCountries: Country[] = [
  { id: 2, number: 2, name: 'Pakistan', imageUrl: 'https://flagcdn.com/w40/pk.png', countryCode: 586, displaySearch: true, sort: 40, addTime: '2025-10-14 09:31:48' },
  { id: 17, number: 17, name: 'Indonesia', imageUrl: 'https://flagcdn.com/w40/id.png', countryCode: 360, displaySearch: true, sort: 17, addTime: '2025-10-14 09:28:22' },
  { id: 16, number: 16, name: 'Italy', imageUrl: 'https://flagcdn.com/w40/it.png', countryCode: 380, displaySearch: true, sort: 16, addTime: '2025-10-14 09:25:11' },
  { id: 18, number: 18, name: 'Singapore', imageUrl: 'https://flagcdn.com/w40/sg.png', countryCode: 702, displaySearch: true, sort: 18, addTime: '2025-10-14 09:35:00' },
  { id: 19, number: 19, name: 'Thailand', imageUrl: 'https://flagcdn.com/w40/th.png', countryCode: 764, displaySearch: true, sort: 19, addTime: '2025-10-14 09:40:15' },
  { id: 20, number: 20, name: 'Türkiye', imageUrl: 'https://flagcdn.com/w40/tr.png', countryCode: 792, displaySearch: true, sort: 20, addTime: '2025-10-14 09:42:33' },
  { id: 21, number: 21, name: 'Saudi Arabia', imageUrl: 'https://flagcdn.com/w40/sa.png', countryCode: 682, displaySearch: true, sort: 21, addTime: '2025-10-14 09:45:00' },
  { id: 22, number: 22, name: 'Mongolia', imageUrl: 'https://flagcdn.com/w40/mn.png', countryCode: 496, displaySearch: false, sort: 22, addTime: '2025-10-14 09:48:20' },
  { id: 1, number: 1, name: 'USA', imageUrl: 'https://flagcdn.com/w40/us.png', countryCode: 840, displaySearch: true, sort: 1, addTime: '2025-10-14 09:15:00' },
  { id: 23, number: 23, name: 'Malaysia', imageUrl: 'https://flagcdn.com/w40/my.png', countryCode: 458, displaySearch: true, sort: 23, addTime: '2025-10-14 09:50:45' },
];

export const demoPopularCountries: PopularCountry[] = [
  { id: 4, number: 4, groupName: 'India', imageUrls: ['https://flagcdn.com/w40/in.png'], sort: 1, addTime: '2025-08-04 17:03:32' },
  { id: 5, number: 5, groupName: 'Bangladesh', imageUrls: ['https://flagcdn.com/w40/bd.png'], sort: 3, addTime: '2025-08-18 02:03:41' },
  { id: 7, number: 7, groupName: 'all', imageUrls: ['https://flagcdn.com/w40/in.png', 'https://flagcdn.com/w40/bd.png', 'https://flagcdn.com/w40/pk.png'], sort: 5, addTime: '2025-09-09 11:31:35' },
  { id: 8, number: 8, groupName: 'Saudi Arabia', imageUrls: ['https://flagcdn.com/w40/sa.png'], sort: 4, addTime: '2025-10-22 16:52:45' },
];

export const demoPushMessages: PushMessage[] = [
  { id: 9203, number: 9203, anchorId: 168781, anchorNickname: '『ẞsj』 DOLL Gツ', liveStreamTitle: 'Sing Live Tonight', roomNumber: 14256, liveBroadcastCities: 'Mars', status: 'Not pushed', creationTime: '2026-02-08 02:02:31' },
  { id: 9202, number: 9202, anchorId: 168780, anchorNickname: 'Naeem Bio', liveStreamTitle: 'Chat & Chill', roomNumber: 14255, liveBroadcastCities: 'Mars', status: 'Not pushed', creationTime: '2026-02-08 01:58:15' },
  { id: 9201, number: 9201, anchorId: 168779, anchorNickname: 'Bogo168779', liveStreamTitle: 'Late Night Vibes', roomNumber: 14254, liveBroadcastCities: 'Earth', status: 'Pushed', creationTime: '2026-02-08 01:45:22' },
  { id: 9200, number: 9200, anchorId: 168778, anchorNickname: 'StarHost', liveStreamTitle: 'Music Hour', roomNumber: 14253, liveBroadcastCities: 'Tokyo', status: 'Not pushed', creationTime: '2026-02-08 01:32:08' },
  { id: 9199, number: 9199, anchorId: 168777, anchorNickname: 'CoolAnchor', liveStreamTitle: 'Gaming Stream', roomNumber: 14252, liveBroadcastCities: 'New York', status: 'Not pushed', creationTime: '2026-02-08 01:18:55' },
  { id: 9198, number: 9198, anchorId: 168776, anchorNickname: 'ProStreamer', liveStreamTitle: 'Karaoke Night', roomNumber: 14251, liveBroadcastCities: 'London', status: 'Pushed', creationTime: '2026-02-08 01:05:42' },
  { id: 9197, number: 9197, anchorId: 168775, anchorNickname: 'Bogo168775', liveStreamTitle: 'Just Chatting', roomNumber: 14250, liveBroadcastCities: 'Paris', status: 'Not pushed', creationTime: '2026-02-08 00:52:30' },
  { id: 9196, number: 9196, anchorId: 168774, anchorNickname: 'TopCreator', liveStreamTitle: 'Q&A Session', roomNumber: 14249, liveBroadcastCities: 'Sydney', status: 'Not pushed', creationTime: '2026-02-08 00:38:18' },
  { id: 9195, number: 9195, anchorId: 168773, anchorNickname: 'LiveKing', liveStreamTitle: 'Dance Party', roomNumber: 14248, liveBroadcastCities: 'Dubai', status: 'Not pushed', creationTime: '2026-02-08 00:25:05' },
  { id: 9194, number: 9194, anchorId: 168772, anchorNickname: 'VoiceQueen', liveStreamTitle: 'Sing Along', roomNumber: 14247, liveBroadcastCities: 'Singapore', status: 'Not pushed', creationTime: '2026-02-08 00:12:50' },
];

export const demoPKRecords: PKRecord[] = [
  { id: 1, number: 9201, anchor1Id: 166593, anchor1Nickname: 'Ffffewe', anchor2Id: 166766, anchor2Nickname: 'Bogo166766', anchor1Earnings: 0, anchor2Earnings: 0, startTime: '2026-01-14 08:36:36', timeMinutes: 1, status: 'Failure' },
  { id: 2, number: 9200, anchor1Id: 166766, anchor1Nickname: 'Bogo166766', anchor2Id: 166770, anchor2Nickname: 'RJ', anchor1Earnings: 150, anchor2Earnings: 120, startTime: '2026-01-14 08:30:12', timeMinutes: 5, status: 'Success' },
  { id: 3, number: 9199, anchor1Id: 166772, anchor1Nickname: 'Anwar', anchor2Id: 166775, anchor2Nickname: 'ib2030', anchor1Earnings: 0, anchor2Earnings: 200, startTime: '2026-01-14 08:15:45', timeMinutes: 3, status: 'Success' },
  { id: 4, number: 9198, anchor1Id: 166780, anchor1Nickname: "it's me", anchor2Id: 166782, anchor2Nickname: '👑Silent🎶king', anchor1Earnings: 80, anchor2Earnings: 0, startTime: '2026-01-14 07:58:22', timeMinutes: 5, status: 'Failure' },
  { id: 5, number: 9197, anchor1Id: 166785, anchor1Nickname: '🦋KAJI🅱️🅾️🦋', anchor2Id: 166788, anchor2Nickname: 'Bogo168422', anchor1Earnings: 100, anchor2Earnings: 100, startTime: '2026-01-14 07:40:10', timeMinutes: 5, status: 'Success' },
];

export const demoRoomBackgrounds: RoomBackground[] = [
  { id: 1, number: 32, title: 'ardent', imageUrl: 'https://picsum.photos/80/60?random=1', status: 'Valid', sort: 21 },
  { id: 2, number: 23, title: '20', imageUrl: 'https://picsum.photos/80/60?random=2', status: 'Valid', sort: 20 },
  { id: 3, number: 31, title: 'soulful', imageUrl: 'https://picsum.photos/80/60?random=3', status: 'Valid', sort: 20 },
  { id: 4, number: 22, title: '19', imageUrl: 'https://picsum.photos/80/60?random=4', status: 'Valid', sort: 19 },
  { id: 5, number: 21, title: '18', imageUrl: 'https://picsum.photos/80/60?random=5', status: 'Valid', sort: 18 },
  { id: 6, number: 20, title: '17', imageUrl: 'https://picsum.photos/80/60?random=6', status: 'Valid', sort: 17 },
  { id: 7, number: 19, title: '16', imageUrl: 'https://picsum.photos/80/60?random=7', status: 'Valid', sort: 16 },
  { id: 8, number: 18, title: '15', imageUrl: 'https://picsum.photos/80/60?random=8', status: 'Valid', sort: 15 },
  { id: 9, number: 17, title: '14', imageUrl: 'https://picsum.photos/80/60?random=9', status: 'Valid', sort: 14 },
  { id: 10, number: 16, title: '13', imageUrl: 'https://picsum.photos/80/60?random=10', status: 'Valid', sort: 13 },
];

export const demoDurationTasks: DurationTask[] = [
  { id: 1, number: 3, title: '60 minute', reward: '100000', videoDurationMinutes: 60, status: 'Valid' },
  { id: 2, number: 6, title: '60 minute', reward: '3000', videoDurationMinutes: 60, status: 'Valid' },
  { id: 3, number: 7, title: '30 minute', reward: '5000', videoDurationMinutes: 30, status: 'Valid' },
  { id: 4, number: 8, title: '120 minute', reward: '200000', videoDurationMinutes: 120, status: 'Valid' },
];

export const demoDurationTaskLogs: DurationTaskLog[] = [
  { id: 1, userId: 166766, userNickname: 'Bogo166766', videoDurationMinutes: 60, reward: '100000', status: 'Expired', roomNumber: 14161, creationTime: '2026-01-14 09:51:36', expirationTime: '2026-01-14 10:01:36', updateTime: '2026-01-14 10:08:50' },
  { id: 2, userId: 168748, userNickname: 'Cody*', videoDurationMinutes: 60, reward: '3000', status: 'Expired', roomNumber: 13956, creationTime: '2025-12-17 10:36:18', expirationTime: '2025-12-17 10:46:17', updateTime: '2025-12-17 10:47:01' },
  { id: 3, userId: 168748, userNickname: 'Cody*', videoDurationMinutes: 60, reward: '100000', status: 'Expired', roomNumber: 13956, creationTime: '2025-12-17 09:36:17', expirationTime: '2025-12-17 09:46:17', updateTime: '2025-12-17 09:47:01' },
  { id: 4, userId: 166772, userNickname: 'Anwar', videoDurationMinutes: 30, reward: '5000', status: 'Expired', roomNumber: 14100, creationTime: '2026-01-13 14:20:00', expirationTime: '2026-01-13 14:30:00', updateTime: '2026-01-13 14:32:15' },
];

export const demoMusicTracks: MusicTrack[] = [
  { id: 1, number: 63, name: 'Stronger', singer: 'Kelly Clarkson', musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', status: 'Unban', sort: 9, addTime: '2024-06-03 17:04:22' },
  { id: 2, number: 62, name: 'Stairway To Heaven', singer: 'Led Zeppelin', musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', status: 'Unban', sort: 8, addTime: '2024-06-03 17:03:15' },
  { id: 3, number: 61, name: 'Imagine', singer: 'John Lennon', musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', status: 'Unban', sort: 7, addTime: '2024-06-03 17:02:08' },
  { id: 4, number: 60, name: 'Bohemian Rhapsody', singer: 'Queen', musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', status: 'Unban', sort: 6, addTime: '2024-06-03 17:01:42' },
  { id: 5, number: 59, name: 'Hotel California', singer: 'Eagles', musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', status: 'Unban', sort: 5, addTime: '2024-06-03 17:00:30' },
  { id: 6, number: 58, name: 'Smells Like Teen Spirit', singer: 'Nirvana', musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', status: 'Unban', sort: 4, addTime: '2024-06-03 16:59:18' },
  { id: 7, number: 57, name: "Sweet Child O' Mine", singer: "Guns N' Roses", musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', status: 'Unban', sort: 3, addTime: '2024-06-03 16:58:05' },
  { id: 8, number: 56, name: 'Billie Jean', singer: 'Michael Jackson', musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', status: 'Unban', sort: 2, addTime: '2024-06-03 16:56:52' },
  { id: 9, number: 55, name: 'Purple Haze', singer: 'Jimi Hendrix', musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', status: 'Unban', sort: 1, addTime: '2024-06-03 16:55:40' },
];

export const demoGifts: Gift[] = [
  { id: 1, number: 89, name: 'Love Gun', imageUrl: 'https://picsum.photos/48/48?random=1', points: 1000, diamond: 1000, coin: 1000, pushToAllChannels: 'Yes', type: 'ordinary gift', displayAnimation: 'SVGA Gift', status: 'Valid', sort: 100 },
  { id: 2, number: 91, name: 'Heart beat', imageUrl: 'https://picsum.photos/48/48?random=2', points: 100, diamond: 100, coin: 100, pushToAllChannels: 'No', type: 'ordinary gift', displayAnimation: 'SVGA Gift', status: 'Valid', sort: 100 },
  { id: 3, number: 92, name: 'Lock', imageUrl: 'https://picsum.photos/48/48?random=3', points: 100, diamond: 100, coin: 100, pushToAllChannels: 'No', type: 'Guardian Gift', displayAnimation: 'ordinary gift', status: 'Valid', sort: 100 },
  { id: 4, number: 93, name: 'Love You', imageUrl: 'https://picsum.photos/48/48?random=4', points: 100, diamond: 100, coin: 100, pushToAllChannels: 'No', type: 'ordinary gift', displayAnimation: 'SVGA Gift', status: 'Valid', sort: 100 },
  { id: 5, number: 94, name: 'I love you', imageUrl: 'https://picsum.photos/48/48?random=5', points: 10, diamond: 10, coin: 50, pushToAllChannels: 'No', type: 'ordinary gift', displayAnimation: 'SVGA Gift', status: 'Valid', sort: 100 },
  { id: 6, number: 95, name: 'Passionate_Kiss', imageUrl: 'https://picsum.photos/48/48?random=6', points: 10, diamond: 10, coin: 1, pushToAllChannels: 'No', type: 'ordinary gift', displayAnimation: 'SVGA Gift', status: 'Valid', sort: 100 },
  { id: 7, number: 96, name: 'Purple_rose', imageUrl: 'https://picsum.photos/48/48?random=7', points: 10, diamond: 10, coin: 1, pushToAllChannels: 'No', type: 'Noble gift', displayAnimation: 'SVGA Gift', status: 'Valid', sort: 100 },
  { id: 8, number: 97, name: 'Rose', imageUrl: 'https://picsum.photos/48/48?random=8', points: 10, diamond: 10, coin: 1, pushToAllChannels: 'No', type: 'ordinary gift', displayAnimation: 'SVGA Gift', status: 'Valid', sort: 10 },
  { id: 9, number: 98, name: 'Promise', imageUrl: 'https://picsum.photos/48/48?random=9', points: 10, diamond: 10, coin: 1, pushToAllChannels: 'No', type: 'Lucky gift', displayAnimation: 'SVGA Gift', status: 'Valid', sort: 100 },
  { id: 10, number: 99, name: 'Romantic_Night', imageUrl: 'https://picsum.photos/48/48?random=10', points: 10, diamond: 10, coin: 1, pushToAllChannels: 'No', type: 'ordinary gift', displayAnimation: 'SVGA Gift', status: 'Valid', sort: 100 },
];

export const demoLuckyGifts: LuckyGift[] = [
  { id: 1, number: 6, giftName: 'Butterflies fly(6)', giftPrice: 100, prizePoolBalance: 50000, winningProbability: '80%', winningMultiple: '2,5,10,20', status: 'Valid', creationTime: '2025-10-24 14:20:00' },
  { id: 2, number: 98, giftName: 'Promise(98)', giftPrice: 50, prizePoolBalance: 25000, winningProbability: '50%', winningMultiple: '2,3,5', status: 'Valid', creationTime: '2025-11-15 09:30:22' },
  { id: 3, number: 105, giftName: 'A(105)', giftPrice: 200, prizePoolBalance: 100000, winningProbability: '60%', winningMultiple: '2,5,10,20,50', status: 'Valid', creationTime: '2025-12-01 11:45:18' },
  { id: 4, number: 106, giftName: 'lucky box(106)', giftPrice: 150, prizePoolBalance: 75000, winningProbability: '70%', winningMultiple: '2,5,10', status: 'Valid', creationTime: '2026-01-08 16:22:35' },
  { id: 5, number: 107, giftName: 'Hat(107)', giftPrice: 80, prizePoolBalance: 40000, winningProbability: '55%', winningMultiple: '2,5', status: 'Valid', creationTime: '2026-02-12 08:15:42' },
];

export const demoCars: Car[] = [
  { id: 49, number: 49, vehicleName: 'Cruise ship', vehicleCover: 'https://picsum.photos/64/48?random=ship', sort: 23, status: 'Unban' },
  { id: 48, number: 48, vehicleName: 'Motorcycle', vehicleCover: 'https://picsum.photos/64/48?random=moto', sort: 22, status: 'Unban' },
  { id: 47, number: 47, vehicleName: 'Tiger', vehicleCover: 'https://picsum.photos/64/48?random=tiger', sort: 21, status: 'Unban' },
  { id: 46, number: 46, vehicleName: 'Love', vehicleCover: 'https://picsum.photos/64/48?random=love', sort: 20, status: 'Unban' },
  { id: 45, number: 45, vehicleName: 'Love ship', vehicleCover: 'https://picsum.photos/64/48?random=loveship', sort: 19, status: 'Unban' },
  { id: 44, number: 44, vehicleName: 'Sports car', vehicleCover: 'https://picsum.photos/64/48?random=car', sort: 18, status: 'Unban' },
  { id: 43, number: 43, vehicleName: 'Skateboard', vehicleCover: 'https://picsum.photos/64/48?random=skate', sort: 17, status: 'Unban' },
  { id: 42, number: 42, vehicleName: 'Limousine', vehicleCover: 'https://picsum.photos/64/48?random=limo', sort: 16, status: 'Unban' },
  { id: 41, number: 41, vehicleName: 'Noble', vehicleCover: 'https://picsum.photos/64/48?random=noble', sort: 15, status: 'Unban' },
];

export const demoCarPrices: CarPrice[] = [
  { id: 1, number: 1, vehicleName: 'Carriage', diamond: 20000, days: '1 Month', points: 1000, sort: 11, status: 'Valid' },
  { id: 2, number: 2, vehicleName: 'Airplane', diamond: 99999, days: '9 Month', points: 300, sort: 8, status: 'Valid' },
  { id: 3, number: 3, vehicleName: 'Racing car', diamond: 30000, days: '7 Days', points: 1500, sort: 7, status: 'Valid' },
  { id: 4, number: 4, vehicleName: 'Magic broom', diamond: 1000, days: '6 Month', points: 0, sort: 6, status: 'Valid' },
  { id: 5, number: 5, vehicleName: 'Princess carriage', diamond: 50000, days: '1 Month', points: 2000, sort: 5, status: 'Valid' },
  { id: 6, number: 6, vehicleName: 'Bat', diamond: 15000, days: '30 Days', points: 500, sort: 3, status: 'Valid' },
  { id: 7, number: 7, vehicleName: 'Cool', diamond: 25000, days: '3 Month', points: 800, sort: 2, status: 'Valid' },
  { id: 8, number: 8, vehicleName: 'Noble', diamond: 35000, days: '1 Month', points: 1000, sort: 1, status: 'Valid' },
];

export const demoCarPurchaseRecords: CarPurchaseRecord[] = [
  { id: 81071, number: 81071, userId: 168422, userNickname: 'Bogo168422(168422)', purchasedVehicle: 'Noble(36) x 7 Day', consumptionAmount: 1000, time: '2026-02-10 14:49:30', expirationTime: '2026-02-17 14:49:30' },
  { id: 80568, number: 80568, userId: 168781, userNickname: 'ZETSU 🐢(168781)', purchasedVehicle: 'Motorcycle(18) x 10 Day', consumptionAmount: 1000, time: '2026-02-09 11:22:15', expirationTime: '2026-02-19 11:22:15' },
  { id: 80234, number: 80234, userId: 168063, userNickname: 'Do it 🤩🤩🤩🤩(168063)', purchasedVehicle: 'Ferrari(19) x 30 Day', consumptionAmount: 25000, time: '2026-02-08 09:15:42', expirationTime: '2026-03-10 09:15:42' },
  { id: 80112, number: 80112, userId: 166596, userNickname: 'Bogo166596(166596)', purchasedVehicle: 'Noble(36) x 7 Day', consumptionAmount: 1000, time: '2026-02-07 16:33:20', expirationTime: '2026-02-14 16:33:20' },
];

export const demoCarGiftRecords: CarGiftRecord[] = [
  { id: 1, number: 1, userId: 166596, regularUser: '(166596)', type: 'Noble(37)', giftedTimeDays: 7, note: 'Congratulations', addTime: '2025-12-13 15:33:53' },
  { id: 2, number: 2, userId: 168762, regularUser: 'Maha Maha doll(168762)', type: 'Monster(36)', giftedTimeDays: 3, note: '', addTime: '2025-12-13 14:22:18' },
  { id: 3, number: 3, userId: 166968, regularUser: 'Mr_Rahul (166968)', type: 'Supreme(32)', giftedTimeDays: 1, note: 'Congratulations', addTime: '2025-12-13 13:10:42' },
  { id: 4, number: 4, userId: 166725, regularUser: 'MISHAL MÜGÅL(166725)', type: 'Magic broom(33)', giftedTimeDays: 5, note: 'Test', addTime: '2025-12-13 12:05:30' },
  { id: 5, number: 5, userId: 167132, regularUser: 'CoolUser(167132)', type: 'Cool(35)', giftedTimeDays: 10, note: '', addTime: '2025-12-12 18:45:00' },
  { id: 6, number: 6, userId: 168063, regularUser: 'Do it 🤩(168063)', type: 'White horse(38)', giftedTimeDays: 14, note: '', addTime: '2025-12-12 17:30:15' },
];

export const demoAdministrators: Administrator[] = [
  { id: 1, account: 'dev', userNickname: 'dev', gender: 'Male', phoneNumber: '', email: '', avatarUrl: '', status: 'Unban', canDelete: true },
  { id: 2, account: 'admin', userNickname: 'administrator', gender: 'Male', phoneNumber: '+86 15715385900', email: 'weipeng201707@gmail.com', avatarUrl: '', status: 'Unban', canDelete: false },
];

export const demoGuardianCategories: GuardianCategory[] = [
  { id: 1, number: 6, name: 'Silver', imageUrl: 'https://picsum.photos/48/48?random=silver', privileges: 'turn on the broadcast, Identity, exclusive gift, Exclusive barrage skin, site-wide broadcast, Anti-kick anti-ban', sort: 1 },
  { id: 2, number: 3, name: 'Gold', imageUrl: 'https://picsum.photos/48/48?random=gold', privileges: 'turn on the broadcast, Identity, exclusive gift, Exclusive barrage skin, site-wide broadcast, Anti-kick anti-ban', sort: 0 },
  { id: 3, number: 4, name: 'Supreme', imageUrl: 'https://picsum.photos/48/48?random=supreme', privileges: 'turn on the broadcast, Identity, exclusive gift, Exclusive barrage skin, site-wide broadcast, Anti-kick anti-ban', sort: 0 },
];

export const demoGuardianPriceConfigs: GuardianPriceConfig[] = [
  { id: 1, number: 14, guardianTypeName: '7 day', guardianDays: 7, consumptionAmount: 1200, guardianCategory: 'Supreme', sort: 150 },
  { id: 2, number: 15, guardianTypeName: '1 month', guardianDays: 30, consumptionAmount: 6000, guardianCategory: 'Gold', sort: 140 },
  { id: 3, number: 16, guardianTypeName: 'ivanoo', guardianDays: 7, consumptionAmount: 2, guardianCategory: 'Silver', sort: 0 },
];

export const demoGuardianPrivileges: GuardianPrivilege[] = [
  { id: 1, number: 1, name: 'turn on the broadcast', selectedIconUrl: 'https://picsum.photos/32/32?random=p1s', defaultIconUrl: 'https://picsum.photos/32/32?random=p1d', sort: 100 },
  { id: 2, number: 2, name: 'Identity', selectedIconUrl: 'https://picsum.photos/32/32?random=p2s', defaultIconUrl: 'https://picsum.photos/32/32?random=p2d', sort: 95 },
  { id: 3, number: 3, name: 'exclusive gift', selectedIconUrl: 'https://picsum.photos/32/32?random=p3s', defaultIconUrl: 'https://picsum.photos/32/32?random=p3d', sort: 85 },
  { id: 4, number: 4, name: 'Exclusive barrage skin', selectedIconUrl: 'https://picsum.photos/32/32?random=p4s', defaultIconUrl: 'https://picsum.photos/32/32?random=p4d', sort: 80 },
  { id: 5, number: 5, name: 'site-wide broadcast', selectedIconUrl: 'https://picsum.photos/32/32?random=p5s', defaultIconUrl: 'https://picsum.photos/32/32?random=p5d', sort: 75 },
  { id: 6, number: 6, name: 'Anti-kick anti-ban', selectedIconUrl: 'https://picsum.photos/32/32?random=p6s', defaultIconUrl: 'https://picsum.photos/32/32?random=p6d', sort: 70 },
];

export const demoVIPPurchaseRules: VIPPurchaseRule[] = [
  { id: 8, number: 8, name: 'Ordinary Member', purchaseDays: 14, price: 1800 },
  { id: 9, number: 9, name: 'Ordinary Member', purchaseDays: 30, price: 3500 },
  { id: 1, number: 1, name: 'Ordinary Member', purchaseDays: 7, price: 1000 },
];

export const demoCheckInRewards: CheckInReward[] = [
  { id: 1, number: 1, days: 1, diamondReward: 3, modificationTime: '2026-02-17 22:45:32', addTime: '2026-02-17 22:45:32' },
  { id: 2, number: 2, days: 2, diamondReward: 10, modificationTime: '2026-02-17 22:45:32', addTime: '2026-02-17 22:45:32' },
  { id: 3, number: 3, days: 3, diamondReward: 15, modificationTime: '2026-02-17 22:45:32', addTime: '2026-02-17 22:45:32' },
  { id: 4, number: 4, days: 4, diamondReward: 20, modificationTime: '2026-02-17 22:45:32', addTime: '2026-02-17 22:45:32' },
  { id: 5, number: 5, days: 5, diamondReward: 25, modificationTime: '2026-02-17 22:45:32', addTime: '2026-02-17 22:45:32' },
  { id: 6, number: 6, days: 6, diamondReward: 30, modificationTime: '2026-02-17 22:45:32', addTime: '2026-02-17 22:45:32' },
  { id: 7, number: 7, days: 7, diamondReward: 50, modificationTime: '2026-02-17 22:45:32', addTime: '2026-02-17 22:45:32' },
];

export const demoSignInList: SignInListRecord[] = [
  { id: 1503, number: 1503, userNickname: 'ZETSU✨', userId: 168781, lastCheckInTime: '2026-02-12 17:56:18', checkInFrequency: 3, continuousCheckIn: 'No' },
  { id: 1508, number: 1508, userNickname: 'Bogo168422', userId: 168422, lastCheckInTime: '2026-02-06 12:49:49', checkInFrequency: 1, continuousCheckIn: 'Yes' },
  { id: 1502, number: 1502, userNickname: '『ẞs』DOLL Gツ', userId: 168748, lastCheckInTime: '2026-01-19 07:56:07', checkInFrequency: 1, continuousCheckIn: 'No' },
  { id: 1501, number: 1501, userNickname: 'Mr.Gx777', userId: 168777, lastCheckInTime: '2026-01-15 14:22:33', checkInFrequency: 2, continuousCheckIn: 'No' },
  { id: 1500, number: 1500, userNickname: 'CoolUser 😊', userId: 166586, lastCheckInTime: '2026-01-10 09:15:00', checkInFrequency: 5, continuousCheckIn: 'Yes' },
  { id: 1499, number: 1499, userNickname: 'StarGazer 💕', userId: 166596, lastCheckInTime: '2025-12-28 18:30:22', checkInFrequency: 1, continuousCheckIn: 'No' },
  { id: 1498, number: 1498, userNickname: 'DiamondKing', userId: 168063, lastCheckInTime: '2025-12-20 11:45:15', checkInFrequency: 4, continuousCheckIn: 'Yes' },
  { id: 1497, number: 1497, userNickname: 'ProMember', userId: 166725, lastCheckInTime: '2025-12-15 16:20:08', checkInFrequency: 2, continuousCheckIn: 'No' },
  { id: 1496, number: 1496, userNickname: 'TopVIP', userId: 167132, lastCheckInTime: '2025-11-28 08:10:42', checkInFrequency: 1, continuousCheckIn: 'No' },
  { id: 1495, number: 1495, userNickname: 'LuckyUser', userId: 166968, lastCheckInTime: '2025-11-20 13:55:30', checkInFrequency: 3, continuousCheckIn: 'No' },
];

export const demoVIPConsumptionRecords: VIPConsumptionRecord[] = [
  { id: 81215, number: 81215, user: 'ZETSU 💨', userId: 168781, vipName: 'Ordinary Member', consumptionAmount: 1000, time: '2026-02-17 07:58:11' },
  { id: 80933, number: 80933, user: 'Mr.Gx777', userId: 168777, vipName: 'Ordinary Member', consumptionAmount: 3500, time: '2026-02-16 14:37:21' },
  { id: 80570, number: 80570, user: '『ßS』 DOLL G😊ツ', userId: 168748, vipName: 'Ordinary Member', consumptionAmount: 1800, time: '2026-02-15 09:22:33' },
  { id: 80123, number: 80123, user: 'DOLLAR', userId: 166586, vipName: 'Ordinary Member', consumptionAmount: 1000, time: '2026-02-14 18:15:44' },
  { id: 79999, number: 79999, user: '♥', userId: 166596, vipName: 'Ordinary Member', consumptionAmount: 3500, time: '2025-12-13 14:37:21' },
  { id: 79850, number: 79850, user: 'CoolUser', userId: 168422, vipName: 'Ordinary Member', consumptionAmount: 1800, time: '2025-12-12 11:20:15' },
  { id: 79500, number: 79500, user: 'StarGazer', userId: 168063, vipName: 'Ordinary Member', consumptionAmount: 1000, time: '2025-12-11 16:45:00' },
  { id: 79200, number: 79200, user: 'DiamondKing', userId: 166725, vipName: 'Ordinary Member', consumptionAmount: 3500, time: '2025-12-10 08:30:22' },
  { id: 78900, number: 78900, user: 'TopVIP', userId: 167132, vipName: 'Ordinary Member', consumptionAmount: 1800, time: '2025-12-09 13:10:55' },
  { id: 78600, number: 78600, user: 'ProMember', userId: 166968, vipName: 'Ordinary Member', consumptionAmount: 1000, time: '2025-12-08 10:05:18' },
];

export const demoDynamicPosts: DynamicPost[] = [
  { id: 1001, userId: 168781, userNickname: 'ZETSU ⚡', publishContent: 'Sichuan-Chongqing New Year Gala', audioAddress: '', videoUrl: 'https://picsum.photos/80/60?random=1', imageUrl: '', likeCount: 1, commentCount: 0, forwardCount: 0, isPinned: '-', status: 'Approved', releaseTime: '2026-01-28 12:00:00' },
  { id: 1002, userId: 168063, userNickname: 'Do it 😄😄😄😄😄', publishContent: 'Having fun today!', audioAddress: '', videoUrl: '', imageUrl: 'https://picsum.photos/64/64?random=2', likeCount: 15, commentCount: 3, forwardCount: 1, isPinned: '-', status: 'Approved', releaseTime: '2026-01-27 14:22:00' },
  { id: 1003, userId: 168777, userNickname: 'Mr.Gx777', publishContent: 'Great content', audioAddress: '', videoUrl: '', imageUrl: 'https://picsum.photos/64/64?random=3', likeCount: 8, commentCount: 2, forwardCount: 0, isPinned: '-', status: 'Approved', releaseTime: '2026-01-26 09:15:00' },
  { id: 1004, userId: 166586, userNickname: 'prem official', publishContent: 'Live session highlights', audioAddress: '', videoUrl: '', imageUrl: 'https://picsum.photos/64/64?random=4', likeCount: 42, commentCount: 12, forwardCount: 5, isPinned: '-', status: 'Approved', releaseTime: '2026-01-25 18:30:00' },
  { id: 1005, userId: 168748, userNickname: 'DiamondKing', publishContent: 'New post with images', audioAddress: '', videoUrl: '', imageUrl: 'https://picsum.photos/64/64?random=5', likeCount: 25, commentCount: 7, forwardCount: 2, isPinned: '-', status: 'Approved', releaseTime: '2026-01-24 11:45:00' },
  { id: 1006, userId: 168422, userNickname: 'CoolUser', publishContent: 'Check this out', audioAddress: '', videoUrl: '', imageUrl: 'https://picsum.photos/64/64?random=6', likeCount: 5, commentCount: 1, forwardCount: 0, isPinned: '-', status: 'Approved', releaseTime: '2026-01-23 16:20:00' },
];

export const demoDynamicComments: DynamicComment[] = [
  { id: 440, number: 440, commenterNickname: 'MR.J€lix00/', commenterId: 167132, publisherNickname: 'Do it 😃😃😃', publisherId: 168063, commentContent: 'huhu', releaseTime: '2026-01-19 14:31:51' },
  { id: 439, number: 439, commenterNickname: 'ZETSU', commenterId: 168781, publisherNickname: 'Mr.Gx777', publisherId: 168777, commentContent: 'Nice! 👍', releaseTime: '2026-01-18 10:22:15' },
  { id: 438, number: 438, commenterNickname: 'CoolUser', commenterId: 166586, publisherNickname: 'prem official', publisherId: 166586, commentContent: 'Great post', releaseTime: '2026-01-17 15:45:30' },
  { id: 437, number: 437, commenterNickname: 'StarGazer', commenterId: 168748, publisherNickname: 'DiamondKing', publisherId: 168748, commentContent: 'Love it!', releaseTime: '2026-01-16 09:10:22' },
  { id: 436, number: 436, commenterNickname: 'ProMember', commenterId: 166725, publisherNickname: 'CoolUser', publisherId: 168422, commentContent: 'Interesting 🤔', releaseTime: '2026-01-15 14:33:08' },
  { id: 435, number: 435, commenterNickname: 'TopVIP', commenterId: 167132, publisherNickname: 'ZETSU ⚡', publisherId: 168781, commentContent: 'Haha', releaseTime: '2026-01-14 11:20:45' },
  { id: 434, number: 434, commenterNickname: 'LuckyUser', commenterId: 166968, publisherNickname: 'Do it 😄', publisherId: 168063, commentContent: 'Amazing content', releaseTime: '2026-01-13 16:55:12' },
  { id: 433, number: 433, commenterNickname: 'Bogo168422', commenterId: 168422, publisherNickname: 'Mr.Gx777', publisherId: 168777, commentContent: '😊', releaseTime: '2026-01-12 08:30:00' },
  { id: 432, number: 432, commenterNickname: 'DiamondKing', commenterId: 168063, publisherNickname: 'prem official', publisherId: 166586, commentContent: 'Thanks for sharing', releaseTime: '2026-01-11 13:15:33' },
  { id: 431, number: 431, commenterNickname: 'Do it 🤩', commenterId: 168063, publisherNickname: 'StarGazer', publisherId: 168748, commentContent: '🔥', releaseTime: '2026-01-10 10:05:18' },
];

export const demoDynamicTopics: DynamicTopic[] = [
  { id: 32, number: 32, topic: 'Hiring Host', sort: 4, backgroundImageUrl: 'https://picsum.photos/120/80?random=t1', coverImageUrl: 'https://picsum.photos/120/80?random=t1', status: 'Display' },
  { id: 31, number: 31, topic: 'Games', sort: 3, backgroundImageUrl: 'https://picsum.photos/120/80?random=t2', coverImageUrl: 'https://picsum.photos/120/80?random=t2', status: 'Display' },
  { id: 30, number: 30, topic: 'Love', sort: 2, backgroundImageUrl: 'https://picsum.photos/120/80?random=t3', coverImageUrl: 'https://picsum.photos/120/80?random=t3', status: 'Display' },
  { id: 29, number: 29, topic: 'Leisure time', sort: 1, backgroundImageUrl: 'https://picsum.photos/120/80?random=t4', coverImageUrl: 'https://picsum.photos/120/80?random=t4', status: 'Display' },
  { id: 28, number: 28, topic: 'Music', sort: 0, backgroundImageUrl: 'https://picsum.photos/120/80?random=t5', coverImageUrl: 'https://picsum.photos/120/80?random=t5', status: 'Display' },
];

export const demoGuardianRecords: GuardianRecord[] = [
  { id: 482, number: 482, userId: 168781, userNickname: 'ZETSU (168781)', guardianTypeName: 'Recommended', daysGuarded: 7, consumptionAmount: 2, anchorId: 166586, anchorNickname: 'DOLLAR (166586)', startTime: '2026-02-15 10:00:00', endTime: '2026-02-22 10:00:00', status: 'Success' },
  { id: 481, number: 481, userId: 168780, userNickname: 'NitroHost (168780)', guardianTypeName: 'Honorable', daysGuarded: 30, consumptionAmount: 6000, anchorId: 166593, anchorNickname: 'Ffffewe (166593)', startTime: '2026-02-14 14:30:00', endTime: '2026-03-16 14:30:00', status: 'Success' },
  { id: 480, number: 480, userId: 168779, userNickname: 'Bogo168779 (168779)', guardianTypeName: 'Recommended', daysGuarded: 7, consumptionAmount: 1200, anchorId: 166766, anchorNickname: 'Bogo166766 (166766)', startTime: '2026-02-13 09:15:00', endTime: '2026-02-20 09:15:00', status: 'Success' },
  { id: 479, number: 479, userId: 168778, userNickname: 'StarUser (168778)', guardianTypeName: 'Honorable', daysGuarded: 30, consumptionAmount: 6000, anchorId: 166770, anchorNickname: 'RJ (166770)', startTime: '2026-02-12 18:45:00', endTime: '2026-03-14 18:45:00', status: 'Success' },
  { id: 478, number: 478, userId: 168777, userNickname: 'CoolUser (168777)', guardianTypeName: 'Recommended', daysGuarded: 7, consumptionAmount: 2, anchorId: 166772, anchorNickname: 'Anwar (166772)', startTime: '2026-02-11 12:20:00', endTime: '2026-02-18 12:20:00', status: 'Success' },
  { id: 477, number: 477, userId: 168776, userNickname: 'DiamondKing (168776)', guardianTypeName: 'Honorable', daysGuarded: 30, consumptionAmount: 6000, anchorId: 166775, anchorNickname: 'ib2030 (166775)', startTime: '2026-02-10 16:00:00', endTime: '2026-03-12 16:00:00', status: 'Success' },
  { id: 476, number: 476, userId: 168775, userNickname: 'ProGamer (168775)', guardianTypeName: 'Recommended', daysGuarded: 7, consumptionAmount: 1200, anchorId: 166780, anchorNickname: "it's me (166780)", startTime: '2026-02-09 11:30:00', endTime: '2026-02-16 11:30:00', status: 'Success' },
  { id: 475, number: 475, userId: 168774, userNickname: 'TopDiamond (168774)', guardianTypeName: 'Honorable', daysGuarded: 30, consumptionAmount: 6000, anchorId: 166782, anchorNickname: '👑Silent🎶king (166782)', startTime: '2026-02-08 08:15:00', endTime: '2026-03-10 08:15:00', status: 'Success' },
  { id: 474, number: 474, userId: 168773, userNickname: 'LuckyPlayer (168773)', guardianTypeName: 'Recommended', daysGuarded: 7, consumptionAmount: 2, anchorId: 166785, anchorNickname: '🦋KAJI🅱️🅾️🦋 (166785)', startTime: '2026-02-07 15:45:00', endTime: '2026-02-14 15:45:00', status: 'Success' },
  { id: 473, number: 473, userId: 168772, userNickname: 'Bogo168772 (168772)', guardianTypeName: 'Honorable', daysGuarded: 30, consumptionAmount: 6000, anchorId: 166788, anchorNickname: 'Bogo168422 (166788)', startTime: '2026-02-06 13:20:00', endTime: '2026-03-08 13:20:00', status: 'Success' },
];

/** Avatar frames available as level rewards (for Level Edit modal) */
export const LEVEL_AVATAR_FRAMES_DEMO: Array<{ id: number; name: string; imageUrl: string }> = [
  { id: 1, name: 'Purple', imageUrl: 'https://picsum.photos/64/64?random=purple' },
  { id: 2, name: 'Diamond', imageUrl: 'https://picsum.photos/64/64?random=diamond' },
  { id: 3, name: 'Green', imageUrl: 'https://picsum.photos/64/64?random=green' },
  { id: 4, name: 'Aperture', imageUrl: 'https://picsum.photos/64/64?random=aperture' },
  { id: 5, name: 'spring', imageUrl: 'https://picsum.photos/64/64?random=spring' },
  { id: 6, name: 'Rabbit', imageUrl: 'https://picsum.photos/64/64?random=rabbit' },
  { id: 7, name: 'Fire', imageUrl: 'https://picsum.photos/64/64?random=fire' },
  { id: 8, name: 'Flower', imageUrl: 'https://picsum.photos/64/64?random=flower' },
];

export const demoHeadFrames: HeadFrame[] = [
  { id: 1, number: 51, name: 'Summer', price: 10000, timeDays: 30, imageUrl: 'https://picsum.photos/64/64?random=summer', unban: 'Yes', sort: 100 },
  { id: 2, number: 52, name: 'Butterfly', price: 30000, timeDays: 30, imageUrl: 'https://picsum.photos/64/64?random=butterfly', unban: 'Yes', sort: 100 },
  { id: 3, number: 53, name: 'Rose', price: 15000, timeDays: 30, imageUrl: 'https://picsum.photos/64/64?random=rose', unban: 'Yes', sort: 100 },
  { id: 4, number: 54, name: 'Gold', price: 50000, timeDays: 30, imageUrl: 'https://picsum.photos/64/64?random=gold', unban: 'Yes', sort: 100 },
  { id: 5, number: 55, name: 'Purple', price: 25000, timeDays: 30, imageUrl: 'https://picsum.photos/64/64?random=purple', unban: 'Yes', sort: 100 },
  { id: 6, number: 56, name: 'Swan', price: 20000, timeDays: 30, imageUrl: 'https://picsum.photos/64/64?random=swan', unban: 'Yes', sort: 100 },
  { id: 7, number: 57, name: 'Feather', price: 18000, timeDays: 30, imageUrl: 'https://picsum.photos/64/64?random=feather', unban: 'Yes', sort: 100 },
  { id: 8, number: 58, name: 'Blossom', price: 22000, timeDays: 30, imageUrl: 'https://picsum.photos/64/64?random=blossom', unban: 'Yes', sort: 100 },
];

export const demoHeadFrameConsumptionRecords: HeadFrameConsumptionRecord[] = [
  { id: 1, number: 81215, userId: 168781, regularUser: 'ZETSU ⑤(168781)', name: 'King(13)', type: 'consumption', status: 'normal', consumptionAmount: 1000, addTime: '2026-02-10 14:48:48', endTime: '2026-03-12 14:48:48' },
  { id: 2, number: 81214, userId: 168422, regularUser: 'Bogo168422(168422)', name: 'jellyfish(9)', type: 'consumption', status: 'normal', consumptionAmount: 20000, addTime: '2026-02-10 14:49:30', endTime: '2026-03-12 14:49:30' },
  { id: 3, number: 81213, userId: 168748, regularUser: '『BS』 DOLL G😁ツ(168748)', name: 'Father Day(40)', type: 'consumption', status: 'normal', consumptionAmount: 25000, addTime: '2026-02-09 11:22:15', endTime: '2026-03-11 11:22:15' },
  { id: 4, number: 81212, userId: 168063, regularUser: 'Do it 🤩(168063)', name: 'Top 1(13)', type: 'consumption', status: 'normal', consumptionAmount: 10000, addTime: '2026-02-09 09:15:42', endTime: '2026-03-11 09:15:42' },
  { id: 5, number: 81211, userId: 166596, regularUser: 'Bogo166596(166596)', name: 'Helmet(27)', type: 'consumption', status: 'normal', consumptionAmount: 30000, addTime: '2026-02-08 16:33:20', endTime: '2026-03-10 16:33:20' },
  { id: 6, number: 81210, userId: 166770, regularUser: 'RJ(166770)', name: 'Wing(17)', type: 'consumption', status: 'normal', consumptionAmount: 15000, addTime: '2026-02-08 12:20:05', endTime: '2026-03-10 12:20:05' },
  { id: 7, number: 81209, userId: 166775, regularUser: 'ib2030(166775)', name: 'CP 1(20)', type: 'consumption', status: 'normal', consumptionAmount: 18000, addTime: '2026-02-07 10:15:30', endTime: '2026-03-09 10:15:30' },
  { id: 8, number: 81208, userId: 166782, regularUser: '👑Silent🎶king(166782)', name: 'Summer(51)', type: 'consumption', status: 'normal', consumptionAmount: 10000, addTime: '2026-02-07 08:45:12', endTime: '2026-03-09 08:45:12' },
];

export const demoHeadFrameGiftRecords: HeadFrameGiftRecord[] = [
  { id: 1, number: 37, userId: 166599, regularUser: 'Scythe(166599)', type: 'Doraemon(18)', giftedTimeDays: 100, note: 'test', addTime: '2025-12-09 17:03:34' },
  { id: 2, number: 22, userId: 166968, regularUser: 'Mr_Rahul (166968)', type: 'Swan(50)', giftedTimeDays: 100, note: 'Note', addTime: '2025-03-21 16:58:37' },
  { id: 3, number: 2, userId: 166725, regularUser: 'MISHAL MÜGÅL(166725)', type: 'Jeep(45)', giftedTimeDays: 1, note: 'b', addTime: '2024-04-10 18:42:38' },
  { id: 4, number: 15, userId: 168781, regularUser: 'ZETSU(168781)', type: 'Butterfly(52)', giftedTimeDays: 30, note: '', addTime: '2026-01-15 14:22:00' },
  { id: 5, number: 16, userId: 168422, regularUser: 'Bogo168422(168422)', type: 'Gold(54)', giftedTimeDays: 7, note: 'Congratulations', addTime: '2026-01-14 09:30:15' },
  { id: 6, number: 17, userId: 166586, regularUser: 'DOLLAR(166586)', type: 'Rose(53)', giftedTimeDays: 14, note: '', addTime: '2026-01-13 16:45:22' },
];

export const demoNobleRecharge: NobleRecharge[] = [
  { id: 1, number: 65, amount: 40000, time: '2Month', name: 'Emperor', sort: 7, status: 'Valid' },
  { id: 2, number: 62, amount: 35000, time: '1Month', name: 'God', sort: 6, status: 'Valid' },
  { id: 3, number: 61, amount: 18000, time: '1Month', name: 'Marquis', sort: 5, status: 'Valid' },
  { id: 4, number: 60, amount: 15000, time: '1Month', name: 'Duke', sort: 4, status: 'Valid' },
  { id: 5, number: 59, amount: 12000, time: '1Month', name: 'Earl', sort: 3, status: 'Valid' },
  { id: 6, number: 58, amount: 5000, time: '7Days', name: 'Viscount', sort: 2, status: 'Valid' },
  { id: 7, number: 57, amount: 1000, time: '7Days', name: 'Knight', sort: 1, status: 'Valid' },
];

export const demoNobleRechargeRecords: NobleRechargeRecord[] = [
  { id: 81215, number: 81215, userId: 168777, userNickname: 'Mr.Gx777', nobleName: 'Emperor', consumptionAmount: 40000, addTime: '2026-02-08 20:18:03' },
  { id: 81214, number: 81214, userId: 168748, userNickname: '『BS』 DOLL Gツ', nobleName: 'Viscount', consumptionAmount: 15000, addTime: '2026-02-08 18:45:22' },
  { id: 81213, number: 81213, userId: 168781, userNickname: 'KAJIBO💗', nobleName: 'Knight', consumptionAmount: 2000, addTime: '2026-02-08 15:30:10' },
  { id: 81212, number: 81212, userId: 166593, userNickname: 'Ffffewe', nobleName: 'Viscount', consumptionAmount: 1000, addTime: '2026-02-07 22:15:48' },
  { id: 81211, number: 81211, userId: 168422, userNickname: 'Bogo168422', nobleName: 'God', consumptionAmount: 35000, addTime: '2026-02-07 19:30:00' },
  { id: 81210, number: 81210, userId: 166586, userNickname: 'DOLLAR', nobleName: 'Emperor', consumptionAmount: 40000, addTime: '2026-02-06 14:20:33' },
  { id: 81209, number: 81209, userId: 168063, userNickname: 'Do it 🤩', nobleName: 'Marquis', consumptionAmount: 18000, addTime: '2026-02-05 11:45:15' },
  { id: 81208, number: 81208, userId: 166725, userNickname: 'MISHAL MÜGÅL', nobleName: 'Earl', consumptionAmount: 12000, addTime: '2026-02-04 09:18:42' },
  { id: 81207, number: 81207, userId: 167132, userNickname: 'TopVIP', nobleName: 'Duke', consumptionAmount: 15000, addTime: '2026-02-03 16:55:28' },
  { id: 81206, number: 81206, userId: 166968, userNickname: 'Mr_Rahul', nobleName: 'Knight', consumptionAmount: 1000, addTime: '2026-02-02 13:22:11' },
];

export const demoNobleGiftRecords: NobleGiftRecord[] = [
  { id: 1, number: 40, userId: 168781, regularUser: 'ZETSU (168781)', type: 'God(13)', giftedTimeDays: 2027, note: 'Hi', addTime: '2025-12-29 17:01:43' },
  { id: 2, number: 38, userId: 167902, regularUser: 'prem official(167902)', type: 'Emperor(6)', giftedTimeDays: 2147483647, note: 'done', addTime: '2025-05-18 23:14:17' },
  { id: 3, number: 33, userId: 166968, regularUser: 'Mr_Rahul (166968)', type: 'Official(18)', giftedTimeDays: 500, note: '', addTime: '2025-03-21 16:58:37' },
  { id: 4, number: 30, userId: 166725, regularUser: 'MISHAL MÜGÅL(166725)', type: 'Allegiance(17)', giftedTimeDays: 30, note: '', addTime: '2025-02-15 14:22:00' },
  { id: 5, number: 28, userId: 168422, regularUser: 'Bogo168422(168422)', type: 'Viscount(58)', giftedTimeDays: 10000, note: 'Thanks', addTime: '2025-01-10 09:30:15' },
  { id: 6, number: 26, userId: 166586, regularUser: 'DOLLAR(166586)', type: 'Knight(57)', giftedTimeDays: 100, note: '', addTime: '2024-12-20 11:45:22' },
];

export const demoPaymentInterfaces: PaymentInterface[] = [
  { id: 1, number: 48, name: 'Google Pay', categoryName: 'GooglePay', status: 'Valid', receivedPayment: 0, automaticWithdrawal: 'No', withdrawalPaymentAccount: '', paymentType: 'Online Payment', imageUrl: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg', description: 'Google Pay', sort: 1 },
  { id: 2, number: 49, name: 'TopPay', categoryName: 'TopPay', status: 'Invalid', receivedPayment: 0, automaticWithdrawal: 'Yes', withdrawalPaymentAccount: '', paymentType: 'Offline payment', imageUrl: '', description: '', sort: 1 },
  { id: 3, number: 44, name: 'Apple Pay', categoryName: 'ApplePay', status: 'Valid', receivedPayment: 96, automaticWithdrawal: 'No', withdrawalPaymentAccount: '', paymentType: 'App payment', imageUrl: '', description: 'Apple Pay', sort: 0 },
];

export const demoRechargeRecords: RechargeRecord[] = [
  { id: 1, number: 81215, userId: 168781, userNickname: 'ZETSU', paymentOrderNumber: 'PO-2026-001', projectName: 'Diamonds10000', externalOrderNumber: 'EXT-001', paymentMethod: 'Google Pay', creationTime: '2026-02-11 21:38:53', paymentTime: '', amount: '100.00', whetherPaid: 'No' },
  { id: 2, number: 81214, userId: 168422, userNickname: 'Bogo168422', paymentOrderNumber: 'PO-2026-002', projectName: 'Diamonds50000', externalOrderNumber: 'EXT-002', paymentMethod: 'Apple Pay', creationTime: '2026-02-11 20:15:22', paymentTime: '', amount: '500.00', whetherPaid: 'No' },
  { id: 3, number: 81213, userId: 168748, userNickname: 'DOLL Gツ', paymentOrderNumber: 'PO-2026-003', projectName: 'Diamonds100', externalOrderNumber: 'EXT-003', paymentMethod: 'Google Pay', creationTime: '2026-02-11 18:45:10', paymentTime: '2026-02-11 18:46:00', amount: '1.00', whetherPaid: 'Yes' },
];

export const demoInviteUserWithdrawals: InviteUserWithdrawal[] = [
  { id: 1, userId: 167132, userNickname: 'MR.Felix00/', amount: 5000000, coin: 500, accountType: 'wp', bankAccountNumber: '996****6996', paymentName: 'ccb', status: 'Under review', applicationTime: '2024-03-13 08:07:21' },
  { id: 2, userId: 166586, userNickname: 'DOLLAR', amount: 12000, coin: 200, accountType: 'bank', bankAccountNumber: '645****9194', paymentName: 'ICBC', status: 'Approved', applicationTime: '2024-03-14 10:20:00' },
  { id: 3, userId: 168530, userNickname: 'M33R', amount: 6616, coin: 1000, accountType: 'bri', bankAccountNumber: 'Nod****.com', paymentName: 'BRI', status: 'Rejected', applicationTime: '2024-03-15 14:35:12' },
  { id: 4, userId: 167902, userNickname: 'prem official', amount: 8000, coin: 150, accountType: 'bank', bankAccountNumber: '423****1530', paymentName: 'TURNA', status: 'Under review', applicationTime: '2024-03-16 09:15:00' },
];

export const demoFamilyWithdrawals: Withdrawal[] = [
  { id: 101, number: 52, anchorId: 166586, anchorNickname: 'DOLLAR', accountType: 'mmmmm', bankAccountNumber: '645****9194', accountName: 'ICBC', amount: 9999.96, coin: 166666, applicationTime: '2026-01-23 17:40:15', applicationNote: 'mmmmm', whetherToReview: 'No', confirmPaymentTime: '', operationNotes: '', businessOrderNumber: '20260123054031791', paymentNotes: 'Payment received', status: 'Pending' },
  { id: 102, number: 49, anchorId: 168530, anchorNickname: 'M33R', accountType: 'Bank Rakyat Indonesia (BRI)', bankAccountNumber: 'Nod****.com', accountName: 'Nodykhaled1144@gmail.com', amount: 6616.20, coin: 5555, applicationTime: '2025-10-30 09:38:23', applicationNote: '987777876666', whetherToReview: 'Yes', confirmPaymentTime: '2025-11-09 18:32:25', operationNotes: '', businessOrderNumber: '20251030093833798', paymentNotes: 'Payment received', status: 'Completed' },
  { id: 103, number: 45, anchorId: 167902, anchorNickname: 'prem official', accountType: '987777876666', bankAccountNumber: '423****1530', accountName: 'TURNA', amount: 6.00, coin: 110270, applicationTime: '2025-10-17 22:11:09', applicationNote: 'king1', whetherToReview: 'Yes', confirmPaymentTime: '2025-11-17 11:26:06', operationNotes: 'd', businessOrderNumber: '20251017221109894', paymentNotes: 'Payment received', status: 'Completed' },
  { id: 104, number: 44, anchorId: 168422, anchorNickname: 'Bogo168422', accountType: 'Bank Rakyat Indonesia (BRI)', bankAccountNumber: '423****1531', accountName: 'Test', amount: 150.50, coin: 3000, applicationTime: '2025-09-17 09:15:51', applicationNote: '9', whetherToReview: 'Yes', confirmPaymentTime: '2025-09-17 07:21:31', operationNotes: '', businessOrderNumber: '20250917091551896', paymentNotes: 'Payment received', status: 'Completed' },
  { id: 105, number: 43, anchorId: 166725, anchorNickname: 'Mr_Rahul', accountType: '987777876666', bankAccountNumber: '423****1532', accountName: 'User725', amount: 2500.00, coin: 166666, applicationTime: '2025-07-20 14:54:37', applicationNote: 'Bkash', whetherToReview: 'Yes', confirmPaymentTime: '2025-08-23 08:34:23', operationNotes: 'm', businessOrderNumber: '20250720025420515', paymentNotes: 'Payment received', status: 'Completed' },
  { id: 106, number: 42, anchorId: 166968, anchorNickname: 'Mr_Rahul', accountType: '987777876666', bankAccountNumber: '423****1533', accountName: 'User968', amount: 890.00, coin: 110270, applicationTime: '2025-07-20 01:20:58', applicationNote: '', whetherToReview: 'Yes', confirmPaymentTime: '2025-10-22 16:43:43', operationNotes: '189', businessOrderNumber: '20250720012058898', paymentNotes: 'Payment received', status: 'Completed' },
  { id: 107, number: 41, anchorId: 168781, anchorNickname: 'ZETSU', accountType: 'Google Pay', bankAccountNumber: '423****1534', accountName: 'User781', amount: 100.00, coin: 10000, applicationTime: '2025-07-05 22:23:15', applicationNote: '', whetherToReview: 'Yes', confirmPaymentTime: '', operationNotes: 'test', businessOrderNumber: '20250705102370301', paymentNotes: '', status: 'Pending Review' },
  { id: 108, number: 40, anchorId: 166596, anchorNickname: '❤️', accountType: '987777876666', bankAccountNumber: '037****7724', accountName: 'MUHAMMAD FAHEEM', amount: 500.00, coin: 79537, applicationTime: '2025-06-15 10:30:00', applicationNote: '', whetherToReview: 'Yes', confirmPaymentTime: '2025-06-16 14:20:00', operationNotes: 'done', businessOrderNumber: '20250615103000899', paymentNotes: 'Payment received', status: 'Completed' },
];

export const demoWithdrawals: Withdrawal[] = [
  { id: 1, number: 52, anchorId: 166586, anchorNickname: 'DOLLAR', accountType: 'mmmmm', bankAccountNumber: '645****9194', accountName: 'ICBC', amount: 9999.96, coin: 166666, applicationTime: '2026-01-23 17:40:15', applicationNote: 'mmmmm', whetherToReview: 'No', confirmPaymentTime: '', operationNotes: '', businessOrderNumber: '20260123054031791', paymentNotes: '', status: 'Pending' },
  { id: 2, number: 51, anchorId: 168748, anchorNickname: '『βs』 DOLL G😊ツ', accountType: '987777876666', bankAccountNumber: '059****3326', accountName: 'KHALEDREFAEIAHMED', amount: 600.00, coin: 10000, applicationTime: '2026-01-23 04:46:45', applicationNote: '', whetherToReview: 'No', confirmPaymentTime: '', operationNotes: '', businessOrderNumber: '20260123044645792', paymentNotes: '', status: 'Pending' },
  { id: 3, number: 50, anchorId: 166596, anchorNickname: '❤️', accountType: '987777876666', bankAccountNumber: '037****7724', accountName: 'MUHAMMAD FAHEEM', amount: 4772.22, coin: 10000, applicationTime: '2026-01-13 14:23:11', applicationNote: '', whetherToReview: 'Yes', confirmPaymentTime: '', operationNotes: '', businessOrderNumber: '20260113142311893', paymentNotes: '', status: 'Pending Review' },
  { id: 4, number: 49, anchorId: 168530, anchorNickname: 'M33R', accountType: 'Bank Rakyat Indonesia (BRI)', bankAccountNumber: 'Nod****.com', accountName: 'Nodykhaled1144@gmail.com', amount: 333.30, coin: 166666, applicationTime: '2025-10-30 09:38:23', applicationNote: '987777876666', whetherToReview: 'Yes', confirmPaymentTime: '2025-11-09 18:32:25', operationNotes: '', businessOrderNumber: '20251030093833798', paymentNotes: 'Payment received', status: 'Completed' },
  { id: 5, number: 48, anchorId: 166593, anchorNickname: 'Ffffewe', accountType: '987777876666', bankAccountNumber: '010****0062', accountName: 'khaled', amount: 180.00, coin: 79537, applicationTime: '2025-10-17 22:11:09', applicationNote: '', whetherToReview: 'Yes', confirmPaymentTime: '2025-11-17 11:26:06', operationNotes: 'd', businessOrderNumber: '20251017221109894', paymentNotes: 'Paid', status: 'Completed' },
  { id: 6, number: 47, anchorId: 167902, anchorNickname: 'prem official', accountType: 'Bank Rakyat Indonesia (BRI)', bankAccountNumber: '423****1530', accountName: 'TURNA', amount: 6616.20, coin: 5555, applicationTime: '2025-10-09 02:57:04', applicationNote: '', whetherToReview: 'Yes', confirmPaymentTime: '2025-10-13 22:32:27', operationNotes: '', businessOrderNumber: '20251009025704895', paymentNotes: '', status: 'Completed' },
  { id: 7, number: 46, anchorId: 168422, anchorNickname: 'Bogo168422', accountType: 'Bank Rakyat Indonesia (BRI)', bankAccountNumber: '423****1531', accountName: 'Test', amount: 150.50, coin: 3000, applicationTime: '2025-09-17 09:15:51', applicationNote: 'Bank Rakyat Indonesia (BRI)', whetherToReview: 'Yes', confirmPaymentTime: '2025-09-17 07:21:31', operationNotes: '', businessOrderNumber: '20250917091551896', paymentNotes: '', status: 'Completed' },
  { id: 8, number: 45, anchorId: 166725, anchorNickname: 'MISHAL MÜGÅL', accountType: '987777876666', bankAccountNumber: '423****1532', accountName: 'User725', amount: 2500.00, coin: 166666, applicationTime: '2025-07-20 14:54:37', applicationNote: '987777876666', whetherToReview: 'Yes', confirmPaymentTime: '2025-08-23 08:34:23', operationNotes: '', businessOrderNumber: '20250720145437897', paymentNotes: '', status: 'Completed' },
  { id: 9, number: 44, anchorId: 166968, anchorNickname: 'Mr_Rahul', accountType: '987777876666', bankAccountNumber: '423****1533', accountName: 'User968', amount: 890.00, coin: 166666, applicationTime: '2025-07-20 01:20:58', applicationNote: '', whetherToReview: 'Yes', confirmPaymentTime: '2025-10-22 16:43:43', operationNotes: 'm', businessOrderNumber: '20250720012058898', paymentNotes: '', status: 'Completed' },
  { id: 10, number: 43, anchorId: 168781, anchorNickname: 'ZETSU', accountType: 'Google Pay', bankAccountNumber: '423****1534', accountName: 'User781', amount: 1200.50, coin: 110270, applicationTime: '2025-07-05 22:23:15', applicationNote: '', whetherToReview: 'Yes', confirmPaymentTime: '', operationNotes: '189', businessOrderNumber: '20250705102370301', paymentNotes: '', status: 'Rejected' },
];

/** Withdrawals pending payment confirmation (status: Allow Payment) */
export const demoPendingConfirmationWithdrawals: Withdrawal[] = [
  { id: 201, number: 52, anchorId: 166586, anchorNickname: 'DOLLAR', accountType: 'mmmmm', bankAccountNumber: '645****9194', accountName: 'ICBC', amount: 9999.96, coin: 166666, applicationTime: '2026-01-23 17:40:15', applicationNote: 'Approved for payment', whetherToReview: 'No', confirmPaymentTime: '', operationNotes: '', businessOrderNumber: '20260123054031791', paymentNotes: '', status: 'Allow Payment' },
  { id: 202, number: 51, anchorId: 168748, anchorNickname: '『βs』 DOLL Gツ', accountType: '987777876666', bankAccountNumber: '059****3326', accountName: 'KHALEDREFAEIAHMED', amount: 600.00, coin: 10000, applicationTime: '2026-01-23 04:46:45', applicationNote: '', whetherToReview: 'No', confirmPaymentTime: '', operationNotes: '', businessOrderNumber: '20260123044645792', paymentNotes: '', status: 'Allow Payment' },
];

export const demoRechargeStatistics: RechargeStatisticsRecord[] = [
  { id: 1, userId: 166613, userNickname: 'OFFICIAL SIR', amount: 113.22, lastRechargeTime: '2022-07-24 11:42:41', whetherPaid: 'Yes' },
  { id: 2, userId: 166588, userNickname: 'Ivanoo0', amount: 13.32, lastRechargeTime: '2023-04-03 08:21:55', whetherPaid: 'Yes' },
  { id: 3, userId: 166593, userNickname: 'Ffffewe', amount: 2.0, lastRechargeTime: '2025-02-05 09:57:21', whetherPaid: 'Yes' },
  { id: 4, userId: 168236, userNickname: 'ABRAM', amount: 2.0, lastRechargeTime: '2025-05-28 13:28:36', whetherPaid: 'Yes' },
  { id: 5, userId: 168781, userNickname: 'ZETSU', amount: 50.0, lastRechargeTime: '2026-02-10 15:30:00', whetherPaid: 'Yes' },
];

export const demoWithdrawalStatistics: WithdrawalStatisticsRecord[] = [
  { id: 1, userId: 166586, userNickname: 'DOLLAR', amount: 9999.96, coin: 166666, lastWithdrawalTime: '2026-01-23 15:40:15', whetherToReview: 'No' },
  { id: 2, userId: 168748, userNickname: '『βs』 DOLL Gツ', amount: 600.0, coin: 10000, lastWithdrawalTime: '2026-01-13 12:23:11', whetherToReview: 'Yes' },
  { id: 3, userId: 167902, userNickname: 'prem official', amount: 6616.2, coin: 5555, lastWithdrawalTime: '2025-12-20 10:15:00', whetherToReview: 'Yes' },
  { id: 4, userId: 166725, userNickname: 'Sardar', amount: 2500.0, coin: 166666, lastWithdrawalTime: '2025-11-15 09:30:22', whetherToReview: 'Yes' },
  { id: 5, userId: 168422, userNickname: 'ABRAM', amount: 150.5, coin: 3000, lastWithdrawalTime: '2025-10-09 14:20:00', whetherToReview: 'No' },
  { id: 6, userId: 166588, userNickname: 'Ivanoo0', amount: 890.0, coin: 110270, lastWithdrawalTime: '2025-09-18 16:45:11', whetherToReview: 'Yes' },
  { id: 7, userId: 166593, userNickname: 'Garnas', amount: 180.0, coin: 79537, lastWithdrawalTime: '2025-08-22 11:10:33', whetherToReview: 'No' },
  { id: 8, userId: 168781, userNickname: 'mofiz', amount: 1200.5, coin: 10000, lastWithdrawalTime: '2025-07-30 08:55:00', whetherToReview: 'Yes' },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: 9 + i,
    userId: 166600 + i,
    userNickname: `User${166600 + i}`,
    amount: (100 + i * 50) * 1.5,
    coin: 50000 + i * 10000,
    lastWithdrawalTime: `2025-0${6 - (i % 5)}-${(i % 28) + 1} ${10 + (i % 12)}:${(i % 60).toString().padStart(2, '0')}:00`,
    whetherToReview: (i % 2 === 0 ? 'Yes' : 'No') as 'Yes' | 'No',
  })),
];

export const demoAnchorDailyReports: AnchorDailyReportRecord[] = [
  { id: 9651, number: 9651, time: '2026-02-18', userNickname: 'ZETSU(168781)', guild: '', liveStreamingDuration: '0:00:25', totalRevenue: 0, valid: 0 },
  { id: 9650, number: 9650, time: '2026-02-15', userNickname: 'ZETSU(168781)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 100, valid: 0 },
  { id: 9649, number: 9649, time: '2026-02-14', userNickname: '『βs』DOLL Gツ(168748)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 620, valid: 0 },
  { id: 9648, number: 9648, time: '2026-02-14', userNickname: 'RJ(166863)', guild: 'test(166863)', liveStreamingDuration: '0:00:00', totalRevenue: '2.2 k', valid: 0 },
  { id: 9647, number: 9647, time: '2026-02-13', userNickname: 'Mr.Gx777(168777)', guild: 'Agency(168777)', liveStreamingDuration: '0:00:00', totalRevenue: 3, valid: 0 },
  { id: 9646, number: 9646, time: '2026-02-12', userNickname: 'RJ(166863)', guild: 'test(166863)', liveStreamingDuration: '0:00:00', totalRevenue: '1.1 k', valid: 0 },
  { id: 9645, number: 9645, time: '2026-02-12', userNickname: '『βs』DOLL Gツ(168748)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: '131.8 k', valid: 0 },
  { id: 9644, number: 9644, time: '2026-02-11', userNickname: '『βs』DOLL Gツ(168748)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 45, valid: 0 },
  { id: 9643, number: 9643, time: '2026-02-11', userNickname: "it's me(167121)", guild: '', liveStreamingDuration: '0:00:00', totalRevenue: '30.4 k', valid: 0 },
  { id: 9642, number: 9642, time: '2026-02-11', userNickname: 'RJ(166863)', guild: 'test(166863)', liveStreamingDuration: '0:00:00', totalRevenue: 39, valid: 0 },
];

export const demoMonthlyReports: MonthlyReportRecord[] = [
  { id: 1, time: '2026-02', userNickname: 'Silent king(167144)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 30, valid: 0 },
  { id: 2, time: '2026-02', userNickname: 'Mr.Gx777(168777)', guild: 'Agency(168777)', liveStreamingDuration: '4:32:05', totalRevenue: 136992, valid: 1 },
  { id: 3, time: '2026-02', userNickname: 'ib2030(167120)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 500, valid: 0 },
  { id: 4, time: '2026-02', userNickname: 'Bogo168422(168422)', guild: '', liveStreamingDuration: '0:43:33', totalRevenue: 2500, valid: 0 },
  { id: 5, time: '2026-02', userNickname: '『βs』 DOLL Gツ (167148)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 15000, valid: 0 },
  { id: 6, time: '2026-02', userNickname: 'Anwar Al-Hajjaj (167114)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 120, valid: 0 },
  { id: 7, time: '2026-02', userNickname: "it's me(167121)", guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 8000, valid: 0 },
  { id: 8, time: '2026-02', userNickname: 'KAJIBO (167186)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 300, valid: 0 },
  { id: 9, time: '2026-02', userNickname: 'Bogo166766(166766)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 5000, valid: 0 },
  { id: 10, time: '2026-02', userNickname: 'Ffffewe(166593)', guild: '', liveStreamingDuration: '0:00:00', totalRevenue: 2000, valid: 0 },
  ...Array.from({ length: 4 }, (_, i) => ({
    id: 11 + i,
    time: '2026-02' as const,
    userNickname: `Anchor${167100 + i}(${167100 + i})`,
    guild: '',
    liveStreamingDuration: '0:00:00',
    totalRevenue: 1000 + i * 500,
    valid: 0,
  })),
];

export const demoBanks: Bank[] = [
  { id: 1, number: 1, bankName: 'Bank Aceh Syariah', bankAbbreviation: 'ACEH', bankCode: '116', status: 'Unban', sort: 0, addTime: '2025-03-26 13:32:41' },
  { id: 2, number: 2, bankName: 'Bank Agris UUS', bankAbbreviation: 'ACEH_UUS', bankCode: '1160', status: 'Unban', sort: 0, addTime: '2025-03-26 13:32:41' },
  { id: 3, number: 3, bankName: 'Bank BCA', bankAbbreviation: 'BCA', bankCode: '014', status: 'Unban', sort: 1, addTime: '2025-03-26 13:35:00' },
  { id: 4, number: 4, bankName: 'Bank Mandiri', bankAbbreviation: 'MANDIRI', bankCode: '008', status: 'Unban', sort: 0, addTime: '2025-03-26 14:20:15' },
];

export const demoAgentAccounts: AgentAccount[] = [
  { id: 80, userId: 168781, userNickname: 'VICKEY(80)', phoneNumber: '+263771234567', accountBalance: 10000, totalRevenue: 10000, consumptionAmount: 0, numberOfBuyers: 2, country: 'Zimbabwe', certification: 'Yes', platform: 'Android', invitationCode: 'AGT80', level: 'Secondary', status: 'Yes', superiorId: 2, superiorName: 'test(2)', registrationTime: '2026-02-06 18:45:39', updateTime: '2026-02-11 20:15:00' },
  { id: 79, userId: 168422, userNickname: 'Bogo168422(79)', phoneNumber: '+263771234568', accountBalance: 5000, totalRevenue: 15000, consumptionAmount: 10000, numberOfBuyers: 5, country: 'Zimbabwe', certification: 'Yes', platform: 'iOS', invitationCode: 'AGT79', level: 'Secondary', status: 'Yes', superiorId: 2, superiorName: 'test(2)', registrationTime: '2026-02-05 12:20:00', updateTime: '2026-02-12 09:30:00' },
  { id: 78, userId: 168748, userNickname: 'Hero1(78)', phoneNumber: '+263771234569', accountBalance: 20000, totalRevenue: 25000, consumptionAmount: 5000, numberOfBuyers: 8, country: 'Indonesia', certification: 'No', platform: 'Web', invitationCode: 'AGT78', level: 'Primary', status: 'Yes', superiorId: 1, superiorName: 'Hero1(1)', registrationTime: '2026-02-04 08:00:00', updateTime: '2026-02-13 14:20:00' },
  ...[...Array(71)].map((_, i) => ({
    id: 77 - i,
    userId: 168000 + i,
    userNickname: `Agent${77 - i}(${77 - i})`,
    phoneNumber: `+2637712345${String(i).padStart(2, '0')}`,
    accountBalance: 1000 + i * 100,
    totalRevenue: 5000 + i * 200,
    consumptionAmount: i * 50,
    numberOfBuyers: i % 10,
    country: ['Zimbabwe', 'Indonesia', 'Kenya'][i % 3],
    certification: i % 3 === 0 ? 'No' : 'Yes',
    platform: ['Android', 'iOS', 'Web'][i % 3],
    invitationCode: `AGT${77 - i}`,
    level: i % 2 === 0 ? 'Primary' : 'Secondary',
    status: 'Yes',
    superiorId: i % 2 === 0 ? 1 : 2,
    superiorName: i % 2 === 0 ? 'Hero1(1)' : 'test(2)',
    registrationTime: `2026-02-${String((i % 28) + 1).padStart(2, '0')} ${String(10 + (i % 14)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
    updateTime: `2026-02-${String((i % 28) + 1).padStart(2, '0')} ${String(12 + (i % 10)).padStart(2, '0')}:00:00`,
  })),
];

export const demoAgentRechargeRecords: AgentRechargeRecord[] = [
  { id: 304, agentId: 80, agentName: 'VICKEY(80)', receivingAccount: 10000, accountBalance: 10000, note: 'Vickey note', superiorId: 2, superiorName: 'test(2)', registrationTime: '2026-02-06 23:02:27' },
  { id: 303, agentId: 79, agentName: 'Bogo168422(79)', receivingAccount: -5000, accountBalance: 5000, note: 'Deduction', superiorId: 2, superiorName: 'test(2)', registrationTime: '2026-02-06 22:15:00' },
  { id: 302, agentId: 79, agentName: 'Bogo168422(79)', receivingAccount: 100000, accountBalance: 100000, note: 'Initial top-up', superiorId: 2, superiorName: 'test(2)', registrationTime: '2025-12-17 14:16:22' },
  ...[...Array(149)].map((_, i) => ({
    id: 301 - i,
    agentId: [80, 79, 78, 2][i % 4],
    agentName: ['VICKEY(80)', 'Bogo168422(79)', 'Hero1(78)', 'test(2)'][i % 4],
    receivingAccount: (i % 2 === 0 ? 1 : -1) * (1000 + (i % 20) * 500),
    accountBalance: 5000 + (i % 50) * 1000,
    note: `Note ${i + 1}`,
    superiorId: i % 2 === 0 ? 1 : 2,
    superiorName: i % 2 === 0 ? 'Hero1(1)' : 'test(2)',
    registrationTime: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
  })),
];

export const demoAgentSalesRecords: AgentSalesRecord[] = [
  { id: 302, userNickname: 'Bogo168422(168422)', agentId: 2, agentName: 'test(2)', receivingAccount: 100000, accountBalance: 100000, note: 'Recharge', registrationTime: '2025-12-17 14:16:22' },
  { id: 301, userNickname: 'DOLL Gツ(168748)', agentId: 2, agentName: 'test(2)', receivingAccount: 50000, accountBalance: 50000, note: 'Sale', registrationTime: '2025-12-18 10:30:00' },
  { id: 300, userNickname: 'ZETSU(168781)', agentId: 80, agentName: 'VICKEY(80)', receivingAccount: 25000, accountBalance: 25000, note: 'Purchase', registrationTime: '2026-02-10 16:45:00' },
  ...[...Array(143)].map((_, i) => ({
    id: 299 - i,
    userNickname: `User${168000 + i}(${168000 + i})`,
    agentId: [80, 79, 2][i % 3],
    agentName: ['VICKEY(80)', 'Bogo168422(79)', 'test(2)'][i % 3],
    receivingAccount: 5000 + (i % 30) * 1000,
    accountBalance: 10000 + (i % 40) * 500,
    note: ['Recharge', 'Sale', 'Purchase'][i % 3],
    registrationTime: `2025-12-${String((i % 28) + 1).padStart(2, '0')} ${String(10 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
  })),
];

export const demoPluginConfigs: PluginConfig[] = [
  { id: 4, number: 4, name: 'Pay Per Person', iconUrl: 'https://picsum.photos/64/64?random=payperson', status: 'Valid', sort: 4 },
  { id: 1, number: 1, name: 'Charge On Time', iconUrl: 'https://picsum.photos/64/64?random=chargetime', status: 'Valid', sort: 3 },
];

export const demoAgentInvitationRecords: AgentInvitationRecord[] = [
  { id: 1, userId: 166724, userNickname: 'Bogo166724(166724)', agentId: 2, agentName: 'test(2)', registrationTime: '2023-01-31 12:46:59' },
  { id: 2, userId: 166723, userNickname: '5757🥳(166723)', agentId: 2, agentName: 'test(2)', registrationTime: '2023-01-30 15:20:10' },
  { id: 3, userId: 166722, userNickname: 'Hero2(166722)', agentId: 1, agentName: 'Hero1(1)', registrationTime: '2023-01-29 09:15:00' },
  { id: 4, userId: 166721, userNickname: 'User166721(166721)', agentId: 2, agentName: 'test(2)', registrationTime: '2023-01-28 11:00:00' },
];

export const demoManualRechargeRecords: ManualRechargeRecord[] = [
  { id: 1, number: 476, userId: 168748, userNickname: '『ßs』 DOLL Gツ (168748)', numberOfChanges: '+ 50000 Diamond', changeAmount: 50000, accountBalance: '50292 Diamond', accountLog: '12345', ip: '54.178.81.11', operator: 'dev (2)', addTime: '2026-02-14 07:06:43' },
  { id: 2, number: 475, userId: 168777, userNickname: 'Mr.Gx777 (168777)', numberOfChanges: '+ 990000 Diamond', changeAmount: 990000, accountBalance: '998151 Diamond', accountLog: 'test', ip: '18.143.100.85', operator: 'admin (1)', addTime: '2025-12-26 16:22:02' },
  { id: 3, number: 474, userId: 166766, userNickname: 'Bogo166766 (166766)', numberOfChanges: '+ 166766 Diamond', changeAmount: 166766, accountBalance: '166766 Diamond', accountLog: '67890', ip: '112.245.59.152', operator: 'admin (1)', addTime: '2025-12-20 10:15:30' },
  { id: 4, number: 473, userId: 168422, userNickname: 'Bogo168422 (168422)', numberOfChanges: '+ 10000000 Diamond', changeAmount: 10000000, accountBalance: '10300187 Diamond', accountLog: '11111', ip: '203.0.113.45', operator: 'dev (2)', addTime: '2025-12-15 14:30:00' },
  ...[...Array(472)].map((_, i) => ({
    id: 5 + i,
    number: 472 - i,
    userId: 166000 + (i % 500),
    userNickname: `User${166000 + (i % 500)} (${166000 + (i % 500)})`,
    numberOfChanges: `+ ${(1000 + (i % 50) * 1000).toLocaleString()} Diamond`,
    changeAmount: 1000 + (i % 50) * 1000,
    accountBalance: `${(50000 + (i % 100) * 500).toLocaleString()} Diamond`,
    accountLog: i % 3 === 0 ? 'test' : String(10000 + i),
    ip: `192.168.${i % 256}.${(i * 7) % 256}`,
    operator: i % 2 === 0 ? 'admin (1)' : 'dev (2)',
    addTime: `2025-${String(((i % 12) + 1)).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
  })),
];

export const demoAppVersions: AppVersion[] = [
  { id: 38, number: 38, versionNumber: '2025101201', versionContent: '', downloadAddress: 'https://loadly.io/version250228', platform: 'Android', forceUpdate: 'Yes', whetherToPublish: 'Yes', time: '2025-12-15 11:45:55' },
  { id: 37, number: 37, versionNumber: '2025101200', versionContent: 'Bug fixes and performance improvements', downloadAddress: 'https://loadly.io/version251015', platform: 'Android', forceUpdate: 'No', whetherToPublish: 'Yes', time: '2025-10-15 14:20:00' },
  { id: 36, number: 36, versionNumber: '2025090101', versionContent: 'New features', downloadAddress: 'https://loadly.io/version250901', platform: 'iOS', forceUpdate: 'Yes', whetherToPublish: 'Yes', time: '2025-09-01 09:30:00' },
  { id: 35, number: 35, versionNumber: '2025081502', versionContent: '', downloadAddress: 'https://loadly.io/version250815', platform: 'iOS', forceUpdate: 'No', whetherToPublish: 'No', time: '2025-08-15 16:45:22' },
];

export const demoReportTypes: ReportType[] = [
  { id: 20, number: 20, name: 'Terrorism', status: 'Valid' },
  { id: 21, number: 21, name: 'Scams', status: 'Valid' },
  { id: 22, number: 22, name: 'pornography', status: 'Valid' },
  { id: 23, number: 23, name: 'Involving politics', status: 'Valid' },
];

export const demoReports: Report[] = [
  { id: 15, number: 15, reportedRoomNumber: 10037, whistleblower: '『βsJ』 DOLL Gツ (168748)', reportedBy: 'Mr.Gx777(168777)', type: 'Scams', reportingTime: '2026-02-06 19:54:42', note: '' },
  { id: 14, number: 14, reportedRoomNumber: 13382, whistleblower: '(166990)', reportedBy: 'DOLLAR(166586)', type: 'Scams', reportingTime: '2025-10-12 09:18:44', note: '' },
  { id: 13, number: 13, reportedRoomNumber: 11944, whistleblower: 'Mr_Rahul (166968)', reportedBy: 'KING (166977)', type: 'Scams', reportingTime: '2025-03-21 16:22:50', note: '' },
  { id: 12, number: 12, reportedRoomNumber: 11436, whistleblower: 'HAZY MAN(166835)', reportedBy: 'RJ(166863)', type: 'Involving politics', reportingTime: '2024-10-17 04:28:54', note: '' },
  { id: 11, number: 11, reportedRoomNumber: 10892, whistleblower: 'User1(166001)', reportedBy: 'User2(166002)', type: 'Terrorism', reportingTime: '2024-08-15 12:00:00', note: '' },
  { id: 10, number: 10, reportedRoomNumber: 10500, whistleblower: 'Reporter(165500)', reportedBy: 'Target(165501)', type: 'Terrorism', reportingTime: '2024-06-20 08:30:00', note: 'Urgent' },
  { id: 9, number: 9, reportedRoomNumber: 10200, whistleblower: 'Whistle(165200)', reportedBy: 'Accused(165201)', type: 'pornography', reportingTime: '2024-04-10 15:45:00', note: '' },
  { id: 8, number: 8, reportedRoomNumber: 9900, whistleblower: 'UserA(164900)', reportedBy: 'UserB(164901)', type: 'Scams', reportingTime: '2024-02-28 11:20:00', note: '' },
  { id: 7, number: 7, reportedRoomNumber: 9500, whistleblower: 'Reporter2(164500)', reportedBy: 'Target2(164501)', type: 'Involving politics', reportingTime: '2023-12-15 09:00:00', note: '' },
  { id: 6, number: 6, reportedRoomNumber: 9000, whistleblower: 'UserX(164000)', reportedBy: 'UserY(164001)', type: 'Terrorism', reportingTime: '2023-10-01 14:30:00', note: '' },
  { id: 5, number: 5, reportedRoomNumber: 8500, whistleblower: 'Whistle2(163500)', reportedBy: 'Accused2(163501)', type: 'Scams', reportingTime: '2023-07-20 16:00:00', note: '' },
  { id: 4, number: 4, reportedRoomNumber: 8000, whistleblower: 'Final(163000)', reportedBy: 'FinalTarget(163001)', type: 'pornography', reportingTime: '2023-05-10 10:15:00', note: '' },
];

export const demoRedEnvelopeRecords: RedEnvelopeRecord[] = [
  { id: 1, roomNumber: 10037, user: 'ZETSU (168781)', quantity: 10, amount: 50000, status: 'In progress', creationTime: '2026-02-08 04:00:55', startTime: '2026-02-08 02:00:55', note: '' },
  { id: 2, roomNumber: 13382, user: 'MR.Z€lix00/(167132)', quantity: 15, amount: 99000, status: 'In progress', creationTime: '2026-02-08 03:45:00', startTime: '2026-02-08 01:45:00', note: '' },
  { id: 3, roomNumber: 11944, user: 'Do it (168063)', quantity: 25, amount: 166666, status: 'In progress', creationTime: '2026-02-08 03:30:12', startTime: '2026-02-08 01:30:12', note: '' },
  ...[...Array(4747)].map((_, i) => ({
    id: 4 + i,
    roomNumber: 10000 + (i % 5000),
    user: `User${166000 + (i % 500)} (${166000 + (i % 500)})`,
    quantity: [10, 15, 25][i % 3],
    amount: 10000 + (i % 100) * 1000,
    status: 'In progress',
    creationTime: `2026-02-${String((i % 28) + 1).padStart(2, '0')} ${String(4 + (i % 20)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
    startTime: `2026-02-${String((i % 28) + 1).padStart(2, '0')} ${String(2 + (i % 20)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
    note: i % 5 === 0 ? 'test' : '',
  })),
];

export const demoRedEnvelopeAmountConfigs: RedEnvelopeAmountConfig[] = [
  { id: 1, amount: 30000, iconUrl: 'https://picsum.photos/48/48?random=red1', sort: 0 },
  { id: 2, amount: 60000, iconUrl: 'https://picsum.photos/48/48?random=red2', sort: 0 },
  { id: 3, amount: 90000, iconUrl: 'https://picsum.photos/48/48?random=red3', sort: 0 },
  { id: 4, amount: 120000, iconUrl: 'https://picsum.photos/48/48?random=red4', sort: 0 },
];

export const demoRedEnvelopeQuantityConfigs: RedEnvelopeQuantityConfig[] = [
  { id: 1, quantity: 10, sort: 0 },
  { id: 2, quantity: 15, sort: 0 },
  { id: 3, quantity: 25, sort: 0 },
];
