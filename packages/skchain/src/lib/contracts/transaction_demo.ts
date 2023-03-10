import { accountOpCodes, errorCodes } from '../contract/code.js';
import type { BlockService } from '../ipld/blockService/blockService.js';
import type { UpdateAccountI } from '../ipld/blockService/nextBlock.js';
export interface TransactionContractParam {
  from: string;
  recipient: string;
  amount: bigint;
}

// 仅仅是demo阶段的交易处理逻辑，通过js实现,并在浏览器的js runtime执行
// 将来正式版用cwjsr执行智能合约实现
export const transDemoFn = async (
  trans: TransactionContractParam,
  getAccount: BlockService['getExistAccount'],
): Promise<UpdateAccountI[]> => {
  const fromAccount = await getAccount(trans.from);
  const _toAccount = await getAccount(trans.recipient);
  if (fromAccount.getBlance() < trans.amount) {
    return [
      {
        account: trans.from,
        opCode: errorCodes['Insufficient balance'],
        value: errorCodes['Insufficient balance'],
      },
    ];
  }

  return [
    {
      account: trans.from,
      opCode: accountOpCodes.minus,
      value: trans.amount,
    },
    {
      account: trans.recipient,
      opCode: accountOpCodes.plus,
      value: trans.amount,
    },
  ];
};
