import { BUILDER_NAMES } from '@faithstack/contract';
import { bytes } from 'multiformats';
import { testAccounts } from '../../../../tests/testAccount.js';
import { Address } from '../../../mate/address.js';
import { Contract } from '../index.js';
import { testCoinContract } from './contractTest.util.js';

describe('contract', () => {
  describe('test', () => {
    it('should simple fn ok', async () => {
      const contract = new Contract();
      await contract.init();

      const res = await contract.runContract(
        bytes.fromString(testCoinContract),
        {
          cuLimit: 10000n,
          storage: bytes.fromString(''),
          method: BUILDER_NAMES.CONSTRUCTOR_METHOD,
          sender: new Address(testAccounts[0].id),
        },
      );
      expect(res.funcResult).toEqual('undefined');
    });
    it('should load storage ok', async () => {
      const contract = new Contract();
      await contract.init();

      const res = await contract.runContract(
        bytes.fromString(testCoinContract),
        {
          cuLimit: 10000n,
          storage: bytes.fromString('{"balances":{"test-did":1000n}}'),
          method: 'getBalance',
          args: ['{did: "test-did"}'],
          sender: new Address(testAccounts[0].id),
        },
      );
      expect(res.funcResult).toEqual('1000n');
    });
  });
});
