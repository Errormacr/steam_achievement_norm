import assert from 'node:assert/strict';
import {
  getSteamIdValidationErrorKey,
  isSteamIdLookupValue
} from './changeAccount.helpers';

assert.equal(getSteamIdValidationErrorKey(''), 'SteamIdRequired');
assert.equal(getSteamIdValidationErrorKey('123456789'), null);
assert.equal(getSteamIdValidationErrorKey('abc123'), 'SteamIdError');
assert.equal(getSteamIdValidationErrorKey('12 34'), 'SteamIdError');

assert.equal(isSteamIdLookupValue('76561198000000000'), true);
assert.equal(isSteamIdLookupValue(''), false);
assert.equal(isSteamIdLookupValue('12abc'), false);
