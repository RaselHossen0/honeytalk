/**
 * Third Party Games API service.
 * Replace demo data with actual API calls when backend is ready.
 */

import type {
  GameConfig,
  GameConfigPayload,
  GameRecord,
  GameRecordFilters,
  GameCoinRecord,
  GameCoinRecordFilters,
} from '@/types/game';

const PLACEHOLDER = 'https://placehold.co/64x64/e0e0e0/666?text=G';
const BG_PLACEHOLDER = 'https://placehold.co/120x64/e0e0e0/666?text=BG';

const DEMO_GAME_CONFIGS: GameConfig[] = [
  { id: 1, number: 103, gameName: 'Fairy Pro', gameId: 558, merchantId: '1000000', gameIconUrl: PLACEHOLDER, backgroundImageUrl: BG_PLACEHOLDER, type: 'fruitMachineFairyPro', frontendDomainUrl: 'https://gamesp.ccdn.ink/fruitMachineFairyPro/', status: 'Unban', bannerDisplay: 'Unban', sort: 2, time: '2026-01-22 14:39:30' },
  { id: 2, number: 105, gameName: 'Monkey Pro', gameId: 615, merchantId: '1000000', gameIconUrl: PLACEHOLDER, backgroundImageUrl: BG_PLACEHOLDER, type: 'greedyMonkeyPro', frontendDomainUrl: 'https://gamesp.ccdn.ink/greedyMonkeyPro/', status: 'Unban', bannerDisplay: 'Unban', sort: 1, time: '2025-08-16 16:03:04' },
  { id: 3, number: 76, gameName: 'Teen Patti Gold', gameId: 1, merchantId: '1000000', gameIconUrl: PLACEHOLDER, backgroundImageUrl: BG_PLACEHOLDER, type: 'kingdoms', frontendDomainUrl: 'https://gamesp.ccdn.ink/kingdoms/', status: 'Unban', bannerDisplay: 'Unban', sort: 0, time: '2024-01-15 10:00:00' },
  { id: 4, number: 77, gameName: 'Teen Patti', gameId: 5, merchantId: '1000000', gameIconUrl: PLACEHOLDER, backgroundImageUrl: BG_PLACEHOLDER, type: 'kingdoms2', frontendDomainUrl: 'https://gamesp.ccdn.ink/kingdoms2/', status: 'Unban', bannerDisplay: 'Unban', sort: 0, time: '2024-01-15 10:00:00' },
  { id: 5, number: 78, gameName: 'Lucky77', gameId: 7, merchantId: '1000000', gameIconUrl: PLACEHOLDER, backgroundImageUrl: BG_PLACEHOLDER, type: 'lucky77', frontendDomainUrl: 'https://gamesp.ccdn.ink/lucky77/', status: 'Unban', bannerDisplay: 'Unban', sort: 0, time: '2024-01-15 10:00:00' },
  { id: 6, number: 79, gameName: 'Lucky99', gameId: 8, merchantId: '1000000', gameIconUrl: PLACEHOLDER, backgroundImageUrl: BG_PLACEHOLDER, type: 'lucky99', frontendDomainUrl: 'https://gamesp.ccdn.ink/lucky99/', status: 'Unban', bannerDisplay: 'Unban', sort: 0, time: '2024-01-15 10:00:00' },
  { id: 7, number: 80, gameName: 'Fruit Loops', gameId: 9, merchantId: '1000000', gameIconUrl: PLACEHOLDER, backgroundImageUrl: BG_PLACEHOLDER, type: 'fruitLoops', frontendDomainUrl: 'https://gamesp.ccdn.ink/fruitLoops/', status: 'Unban', bannerDisplay: 'Unban', sort: 0, time: '2024-01-15 10:00:00' },
];

const DEMO_GAME_RECORDS: GameRecord[] = [
  { id: 1, number: 25116, gameName: 'Greedy', identification: '1230458440409677 825', consumptionAmount: 4500, rewardAmount: 8000, platformRevenue: -3500, gameVictoryResult: 'pot0:0;pot1:0;pot2:0;pot3:0;pot4:1600;pot5:1100;pot6:1800;pot7:0;Game victory result:pot4', time: '2026-02-17 10:02:33' },
  { id: 2, number: 25115, gameName: 'Greedy', identification: '1230458440409677 824', consumptionAmount: 5600, rewardAmount: 1500, platformRevenue: 4100, gameVictoryResult: 'pot0:0;pot1:0;pot2:0;pot3:0;pot4:1600;pot5:1100;pot6:1800;pot7:0;Game victory result:pot6', time: '2026-02-17 10:01:22' },
  { id: 3, number: 25114, gameName: 'Greedy', identification: '1230458440409677 823', consumptionAmount: 3000, rewardAmount: 1200, platformRevenue: 1800, gameVictoryResult: 'pot0:0;pot1:0;pot2:0;pot3:0;pot4:1600;pot5:1100;pot6:1800;pot7:0;Game victory result:pot5', time: '2026-02-17 09:55:00' },
  { id: 4, number: 25113, gameName: 'Lucky77', identification: '1230458440409677 822', consumptionAmount: 2000, rewardAmount: 3800, platformRevenue: -1800, gameVictoryResult: 'apple:0;seven:800;watermelon:1800;Game victory result:watermelon', time: '2026-02-17 09:50:15' },
  { id: 5, number: 25112, gameName: 'Lucky77', identification: '1230458440409677 821', consumptionAmount: 1500, rewardAmount: 500, platformRevenue: 1000, gameVictoryResult: 'apple:0;seven:800;watermelon:0;Game victory result:seven', time: '2026-02-17 09:45:30' },
];

const DEMO_COIN_RECORDS: GameCoinRecord[] = [
  { id: 1, number: 44662, userNickname: 'ZETSU', userId: 168781, gameName: 'greedy', identification: '1230458440409677825', consumptionAmount: 4500, rewardAmount: 8000, gameVictoryResult: 'Chicken:0;lobster:0;meat:0;Hamburg:0;carrot:1600;watermelon:1100;mushroom:1800;lettuce:0;Game victory result:carrot', time: '2026-02-17 08:02:33' },
  { id: 2, number: 44661, userNickname: 'Game Test 10', userId: 167122, gameName: 'lucky77', identification: '1230458440409677824', consumptionAmount: 5600, rewardAmount: 1500, gameVictoryResult: 'apple:0;seven:800;watermelon:1800;Game victory result:watermelon', time: '2026-02-17 08:01:22' },
  { id: 3, number: 44660, userNickname: 'Snow', userId: 166589, gameName: 'greedyBaby', identification: '1230458440409677823', consumptionAmount: 0, rewardAmount: 4500, gameVictoryResult: 'pot0:0;pot1:4500;pot2:0;Game victory result:pot1', time: '2026-02-17 07:55:00' },
  { id: 4, number: 44659, userNickname: 'DOLLAR', userId: 166586, gameName: 'greedy', identification: '1230458440409677822', consumptionAmount: 3000, rewardAmount: 1200, gameVictoryResult: 'Chicken:0;lobster:1200;meat:0;Game victory result:lobster', time: '2026-02-17 07:50:15' },
  { id: 5, number: 44658, userNickname: 'Creator', userId: 167001, gameName: 'lucky99', identification: '1230458440409677821', consumptionAmount: 2000, rewardAmount: 5000, gameVictoryResult: 'seven:5000;apple:0;banana:0;Game victory result:seven', time: '2026-02-17 07:45:30' },
];

let gameConfigsData = [...DEMO_GAME_CONFIGS];

export async function fetchGameConfigs(): Promise<GameConfig[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...gameConfigsData];
}

export async function syncGames(): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
}

export async function updateGameConfig(id: number, payload: Partial<GameConfigPayload>): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  gameConfigsData = gameConfigsData.map((r) => (r.id === id ? { ...r, ...payload } : r));
}

export async function fetchGameRecords(
  filters?: GameRecordFilters,
  page = 1,
  perPage = 10
): Promise<{ data: GameRecord[]; total: number; consumptionAmount: number; rewardAmount: number; platformRevenue: number }> {
  await new Promise((r) => setTimeout(r, 300));
  let data = [...DEMO_GAME_RECORDS];
  if (filters?.identification) data = data.filter((r) => r.identification.includes(filters.identification!));
  if (filters?.type && filters.type !== 'all') data = data.filter((r) => r.gameName.toLowerCase().includes(filters.type!.toLowerCase()));
  if (filters?.timeStart) data = data.filter((r) => r.time >= filters.timeStart!);
  if (filters?.timeEnd) data = data.filter((r) => r.time <= filters.timeEnd! + ' 23:59:59');
  const consumptionAmount = 281961979110;
  const rewardAmount = 234743565210;
  const platformRevenue = 47218413900;
  const total = 25116;
  const start = (page - 1) * perPage;
  const slice = data.slice(start, start + perPage);
  return { data: slice, total, consumptionAmount, rewardAmount, platformRevenue };
}

export async function fetchGameCoinRecords(
  filters?: GameCoinRecordFilters,
  page = 1,
  perPage = 10
): Promise<{ data: GameCoinRecord[]; total: number; consumptionAmount: number; rewardAmount: number }> {
  await new Promise((r) => setTimeout(r, 300));
  let data = [...DEMO_COIN_RECORDS];
  if (filters?.userId) data = data.filter((r) => String(r.userId).includes(filters.userId!));
  if (filters?.identification) data = data.filter((r) => r.identification.includes(filters.identification!));
  if (filters?.type && filters.type !== 'all') data = data.filter((r) => r.gameName.toLowerCase().includes(filters.type!.toLowerCase()));
  if (filters?.timeStart) data = data.filter((r) => r.time >= filters.timeStart!);
  if (filters?.timeEnd) data = data.filter((r) => r.time <= filters.timeEnd! + ' 23:59:59');
  const consumptionAmount = 70568279410;
  const rewardAmount = 78337778406;
  const total = 44662;
  const start = (page - 1) * perPage;
  const slice = data.slice(start, start + perPage);
  return { data: slice, total, consumptionAmount, rewardAmount };
}
