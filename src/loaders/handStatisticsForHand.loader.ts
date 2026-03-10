import DataLoader from 'dataloader';

import { assembleHandStatistics } from '@/utils/five.utils';

import type { Hand } from '@/models/hand.model';
import type { HandStatistics } from '@/models/handStatistics.model';

const handStatisticsForHand = () => {
    return new DataLoader<Hand, HandStatistics>(async (hands) => {
        const stats = hands.map((hand) => assembleHandStatistics(hand));
        const cache = new Map<Hand, HandStatistics>();
        for (const stat of stats) {
            cache.set(stat.hand, stat);
        }
        return hands.map((hand) => cache.get(hand) as HandStatistics);
    });
};

export default handStatisticsForHand;
