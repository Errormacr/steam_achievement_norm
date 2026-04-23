export function getSteamIdValidationErrorKey(value: string) {
  if (value === '') {
    return 'SteamIdRequired';
  }

  return /^\d+$/.test(value) ? null : 'SteamIdError';
}

export function isSteamIdLookupValue(value: string) {
  return value.length > 0 && /^\d+$/.test(value);
}
