import type { Block } from '../../mate/block.js';
import type { Skfs } from '../skfs/index.js';
import type { BlockService } from '../ipld/blockService/blockService.js';
import { chainState } from '../state/index.js';
import { LifecycleStap } from '../state/lifecycle.js';
// import { Slice } from './slice.js';

interface ConsensusNewBlockData {
  cid: string;
  number: bigint;
}

interface PossibleChain {
  contribute: bigint; // 从分叉点开始，这条子链的打包者contribute的和
  // 子链的块
  blockMap: Map<
    string,
    {
      cid: string;
      block: Block;
      blockRoot: string;
    }
  >;
  // 子链也可能会有子链
  possibleChain: PossibleChain;
}

export class Consensus {
  constructor(db: Skfs, blockService: BlockService) {
    this.db = db;
    this.blockService = blockService;
    // this.slice = new Slice(this.db);
  }

  blockPrefix = 'sk-block-new';
  db: Skfs;
  blockService: BlockService;
  // slice: Slice;
  // 是否已经同步完成，可以进行交易打包和参与共识
  private ready = true; // TODO default is false

  possibleChainMap = new Map<string, PossibleChain>();

  setIsReady = (ready: boolean): void => {
    this.ready = ready;
  };

  isReady = (): boolean => this.ready;

  init = async (): Promise<void> => {
    // await this.slice.init();
    // TODO
    // await this.subNewBlock();
    chainState.send('CHANGE', {
      event: LifecycleStap.initedConsensus,
    });
  };

  /**
   * 广播新区块
   * @param nextBlock
   */
  public pubNewBlock = async (nextBlock: Block): Promise<void> => {
    const blockCid = await nextBlock.toCborBlock();
    // TODO
    // const nextData: ConsensusNewBlockData = {
    //   number: nextBlock.header.number,
    //   cid: blockCid.cid.toString(),
    // };
    // await this.db.pubsub.publish(
    //   this.blockPrefix,
    //   bytes.fromString(JSON.stringify(nextData)),
    // );
    await this.blockService.addBlock(nextBlock);
    chainState.send('CHANGE', {
      event: LifecycleStap.newBlock,
      data: [blockCid.cid.toString(), nextBlock.header.number],
    });
  };

  // 接收其他节点广播的新区块
  // subNewBlock = async () => {
  //   this.chain.db.pubsub.subscribe(this.blockPrefix, async (data) => {
  //     if (data.from !== this.chain.did) {
  //       const newData: ConsensusNewBlockData = JSON.parse(
  //         bytes.toString(data.data),
  //       );
  //       const newBlock = await Block.fromCidOnlyHeader(
  //         newData.cid,
  //         this.chain.db,
  //       );

  //       const headerBlock = await this.chain.getHeaderBlock();

  //       // console.log('receive new block', newBlock);
  //       // console.log(headerBlock);

  //       if (
  //         newBlock.header.number.isLessThanOrEqualTo(headerBlock.header.number)
  //       ) {
  //         // 接收到的块小于等于当前最新块
  //         message.info('receive block: old');
  //         // 验证收到的块是否跟自己的本地存储块hash是否相同
  //         const savedBlock = await this.blockService.getBlockByNumber(
  //           newBlock.header.number,
  //         );
  //         if (savedBlock?.hash === newBlock.hash) {
  //           message.info('receive block: check pass');
  //         } else {
  //           // TODO 对比收到的块和自己本地块的contribute
  //         }
  //       } else {
  //         // 收到的块是比自己节点存储的更新的
  //         message.info('receive block: new');
  //         if (
  //           headerBlock.header.number.plus(1).isEqualTo(newBlock.header.number)
  //         ) {
  //           // 收到的是下一个块
  //           if (newBlock.header.parent === headerBlock.hash) {
  //             // 验证通过是下一个块
  //             await this.blockService.addBlockCidByNumber(
  //               newData.cid,
  //               newBlock.header.number,
  //             );

  //             await this.transAction.stopThisBlock();
  //           }
  //         }
  //         // TODO 验证收到的块的合法性,验证过程会
  //         // this.possibleChainMap.set()
  //         //
  //         // 更新自己的本地存储块
  //         await this.blockService.addBlockCidByNumber(
  //           newData.cid,
  //           newBlock.header.number,
  //         );
  //       }
  //     }
  //   });
  // };

  // compareContribute = async (_block: Block) => {
  //   // 对比相同高度两个block的sum contribute
  //   // 如果存储的contribute相等，就用上一block的hash的后几位，计算来进行确定性随即
  // };
}
