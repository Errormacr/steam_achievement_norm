export const SORTING_OPTIONS = [
  {
    value: 'lastLaunchTime',
    label: 'LastLaunchSort'
  },
  {
    value: 'percent',
    label: 'PercentAchSort'
  },
  {
    value: 'allAchCount',
    label: 'AllAChInGameSort'
  },
  {
    value: 'unlockedCount',
    label: 'GainedAchSort'
  },
  {
    value: 'notUnlockedCount',
    label: 'NonGainedAchSort'
  },
  {
    value: 'playtime',
    label: 'PlayTimeSort'
  }
];

export const TIME_FILTER_OPTIONS = [
  { value: '1000', label: 'Above1000hour' },
  { value: '500', label: 'Above500hour' },
  { value: '100', label: 'Above100hour' },
  { value: '50', label: 'Above50hour' },
  { value: '20', label: 'Above20hour' },
  { value: '2', label: 'Above2hour' }
];

export const COMPLETION_FILTER_OPTIONS = [
  'percent99-100',
  'percent90-100',
  'percent80-90',
  'percent70-80',
  'percent60-70',
  'percent50-60',
  'percent40-50',
  'percent30-40',
  'percent20-30',
  'percent10-20',
  'percent0-10'
];
