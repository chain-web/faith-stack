import { Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { JsonView } from '../../../../components/JsonView';
import './index.scss';

export default function Devtool() {
  const [cid, setCid] = useState('');
  const [data, _setData] = useState({});
  return (
    <div className="devtool-box">
      <h3>devtools</h3>
      <div className="tool-group">
        <Button
          onClick={() => {
            indexedDB.databases().then((res) => {
              res.forEach((ele) => {
                indexedDB.deleteDatabase(ele.name as string);
              });
              message.success('cleared indexedDB');
            });
          }}
        >
          清除缓存(indexedDB)
        </Button>
        <Button
          onClick={() => {
            localStorage.clear();
            message.success('cleared localStorage');
          }}
        >
          清除缓存(localStorage)
        </Button>
      </div>
      <h4>db</h4>
      <div className="get-dag-cid">
        <Input
          value={cid}
          onChange={(e) => {
            setCid(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            // deepGetCid(current.context.chain.sk.db, CID.parse(cid)).then(
            //   (res) => {
            //     setData(res);
            //   },
            // );
          }}
        >
          get dag cid
        </Button>
      </div>
      <JsonView data={data} />
    </div>
  );
}
