'use strict';

// module.exports.hello = async event => {
//   let greet = `Hello ${process.env.AUTHOR_NAME}`;
//   console.log(greet);
//   return {
//     statusCode: 200,
//     body: { message: greet }
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };

//アプリ.BLEマスタ一覧取得(getMBle_M)

//const aws = require('aws-sdk');
const pg = require('pg');
const expDbSet = require('./db.js');
const expCom = require('./common.js');

module.exports.hello = async (event, context, callback)=>{
/*
  //keibiincode   integer           警備員コード          一致 必須
  //keibicoid     varchar(20)       警備会社ID            パターン一致 必須
  //riyoukubun    char(2)           利用区分              自社,販売
  //activateflag  boolean           アクティベートフラグ  パターン一致 必須
  // tikucode     char(3)           地区コード
  //uuid        //varchar(32)     //UUID
  //major       //integer         //Major
  //minor       //integer         //Minor
  //licensekey  //varchar(50)     //ライセンス番号
  //sorts         配列（varchar）   並び順    デフォルト  更新日時降順
  //limit         decimal           抽出上限数 デフォルト 全件
  //offset        decimal           抽出開始位置 デフォルト 0
*/

  var config = expDbSet.getDbConnectSetting();

  console.log('config:', config);

  console.log('Received event:', JSON.stringify(event, null, 2));

  context.callbackWaitsForEmptyEventLoop = false;

  //項目チェック ------------------------------------------
  {

  var errParm = "";

  //keibicoid        //警備会社ID        varchar(20)   必須

  // 項目定義確認
  if (event.keibicoid === undefined)
  {
    errParm = expCom.editErr(400, '警備会社IDは必須です。', 'keibicoid', 'undefined');
    console.log('Err info:', errParm);
    callback(errParm);
    return;
  }

  // 値設定確認
  if (event.keibicoid == '')
  {
    errParm = expCom.editErr(400, '警備会社IDは必須です。', 'keibicoid', 'Value not set');
    console.log('Err info:', errParm);
    callback(errParm);
    return;
  }

  // 値設定確認
  if (expCom.isNull(event.keibicoid))
  {
    errParm = expCom.editErr(400, '警備会社IDは必須です。', 'keibicoid', 'Value is null');
    console.log('Err info:', errParm);
    callback(errParm);
    return;
  }

  //tikuCode      //地区コード      char(3)

  // 項目定義確認
  if (event.tikuCode === undefined)
  {
    errParm = expCom.editErr(400, '地区コードは必須です。', 'tikuCode', 'undefined');
    console.log('Err info:', errParm);
    callback(errParm);
    return;
  }

  // 値設定確認
  if (event.tikuCode == '')
  {
    errParm = expCom.editErr(400, '地区コードは必須です。', 'tikuCode', 'Value not set');
    console.log('Err info:', errParm);
    callback(errParm);
    return;
  }

  // 値設定確認
  if (expCom.isNull(event.tikuCode))
  {
    errParm = expCom.editErr(400, '地区コードは必須です。', 'tikuCode', 'Value is null');
    console.log('Err info:', errParm);
    callback(errParm);
    return;
  }
  }
  //項目チェック  End--------------------------------------------------------------------------------------------

}

/* Nguyen comment

  // WHERE 句の生成---------------------------------------------------------------
  var sW='';
  var QueryParam = new Array();
  var ItemIdex=0;

  //固定項目による設定
  {
  //"deleteflag":"false"のときのみ表示
  sW  = expCom.editWhere(sW,'AND');
  sW += ' m_ble.deleteflag = false';
  }

  //リクエスト項目による設定
  {

  //keibicoid   //警備会社ID     //varchar(20)   //必須
  if (!(event.keibicoid === undefined || event.keibicoid === '' || expCom.isNull(event.keibicoid)))
  {
    var keibicoid = await expCom.SqlIjCounter(event.keibicoid);
    ItemIdex +=1;
    QueryParam[ItemIdex-1] =keibicoid;
    sW  = expCom.editWhere(sW, 'AND');
    sW += ' m_ble.keibicoid=$'+ItemIdex;
  }

  //riyoukubun    char(2)           利用区分
  if (!(event.riyoukubun === undefined || event.riyoukubun === '' || expCom.isNull(event.riyoukubun)))
  {
    var riyoukubun = await expCom.SqlIjCounter(event.riyoukubun);
    ItemIdex +=1;
    QueryParam[ItemIdex-1] =riyoukubun;
    sW  = expCom.editWhere(sW, 'AND');
    sW += ' m_ble.riyoukubun = $'+ItemIdex ;
  }

  //activateflag  boolean           アクティベートフラグ
  if (!(event.activateflag === undefined || event.activateflag === '' || expCom.isNull(event.activateflag)))
  {
    var activateflag = await expCom.SqlIjCounter(event.activateflag);
    ItemIdex +=1;
    QueryParam[ItemIdex-1] =activateflag;
    sW  = expCom.editWhere(sW, 'AND');
    sW += ' m_ble.activateflag = $'+ItemIdex ;
  }

  //uuid        //varchar(32)     //UUID
  if (!(event.uuid === undefined || event.uuid === '' || expCom.isNull(event.uuid)))
  {
    var uuid = await expCom.SqlIjCounter(event.uuid);
    ItemIdex +=1;
    QueryParam[ItemIdex-1] =uuid;
    sW  = expCom.editWhere(sW, 'AND');
    sW += ' m_ble.uuid = $'+ItemIdex ;
  }

  //major       //integer         //Major
  if (!(event.major === undefined || event.major === '' || expCom.isNull(event.major)))
  {
    var major = await expCom.SqlIjCounter(event.major);
    ItemIdex +=1;
    QueryParam[ItemIdex-1] =major;
    sW  = expCom.editWhere(sW, 'AND');
    sW += ' m_ble.major = $'+ItemIdex ;
  }

  //minor       //integer         //Minor
  if (!(event.minor === undefined || event.minor === '' || expCom.isNull(event.minor)))
  {
    var minor = await expCom.SqlIjCounter(event.minor);
    ItemIdex +=1;
    QueryParam[ItemIdex-1] =minor;
    sW  = expCom.editWhere(sW, 'AND');
    sW += ' m_ble.minor = $'+ItemIdex ;
  }

  //licensekey  //varchar(50)     //ライセンス番号
  if (!(event.licensekey === undefined || event.licensekey === '' || expCom.isNull(event.licensekey)))
  {
    var licensekey = await expCom.SqlIjCounter(event.licensekey);
    ItemIdex +=1;
    QueryParam[ItemIdex-1] =licensekey;
    sW  = expCom.editWhere(sW, 'AND');
    sW += ' m_ble.licensekey = $'+ItemIdex ;
  }


  }


  // WHERE 句の生成 End-----------------------------------------------------------


  // Sort 句の生成---------------------------------------------------------------
  {
    var sSort = '';
    if ((event.sorts === undefined) | (event.sorts == '') | (expCom.isNull(event.sorts)))
    {
      sSort = ' m_ble.updatedate DESC';
    } else
    {
      var sD = '';
        console.log("sorts",event.sorts);
      for (var key in event.sorts)
      {
        console.log("key",key);
        if (event.sorts.hasOwnProperty(key))
        {
          sSort += sD + 'm_ble.' + key + ' ' + event.sorts[key] + ' ';
          if (sD == '')
          {
          sD = ',';
          }
        }
      }
    }
    if (sSort == '')
    {
    } else
    {
      sSort = ' ORDER BY ' + sSort;
    }
  }
  // Sort 句の生成 End-----------------------------------------------------------

  // limit 句の生成    ----------------------------------------------------------
  {
    var sLimit = '';
    if ((event.limit === undefined) | (event.limit == '') | (expCom.isNull(event.limit)))
    {
      sLimit = ' Limit ALL';
    } else
    {
      var tlimit = await expCom.SqlIjCounter(event.limit);
      ItemIdex +=1;
      QueryParam[ItemIdex-1] =tlimit;
      sLimit = ' Limit $' + ItemIdex;
    }
  }
  // limit 句の生成 End----------------------------------------------------------

  // offset 句の生成    ----------------------------------------------------------
  {
    var sOffset = '';
    if ((event.offset === undefined) | (event.offset == '') | (expCom.isNull(event.offset)))
    {
      sOffset = ' OFFSET 0';
    } else
    {
      var toffset = await expCom.SqlIjCounter(event.offset);
      ItemIdex +=1;
      QueryParam[ItemIdex-1] =toffset;
      sOffset = ' OFFSET $' + ItemIdex;
    }
  }
  // offset 句の生成 End----------------------------------------------------------


  //SELECT句・FROM句の生成--------------------------------------------------------
  {
  var sql = '';

  sql += ' select';
  sql += ' m_ble.keibicoid';          //警備会社ID
  sql += ',m_ble.bleid';              //BLEID
  sql += ',m_ble.tokuisakiid';        //得意先ID
  sql += ',m_ble.riyoukubun';         //利用区分
  sql += ',m_ble.licensekey';         //ライセンス番号
  sql += ',m_ble.uuid';               //UUID
  sql += ',m_ble.major';              //Major
  sql += ',m_ble.minor';              //Minor
  sql += ',m_ble.ebsid';              //EBSID
  sql += ',m_ble.keibiconame';        //警備会社名称
  sql += ',m_ble.yuukoustartdate';    //有効期限開始日
  sql += ',m_ble.yuukouenddate';      //有効期限終了日
  sql += ',m_ble.activateflag';       //アクティベートフラグ
  sql += ',m_ble.activatedate';       //アクティベート日
  sql += ',m_ble.bledenti';           //電池残量
  sql += ',m_ble.bledentidate';       //電池残量更新日時
  sql += ',m_ble.denticoukandate';    //電池交換日

  sql += ' from';
  sql += ' m_ble';

  sql += sW + sSort + sLimit + sOffset;

  sql = sql + ";" ;
  }
  //SELECT句・FROM句の生成 End----------------------------------------------------



// connection using created pool
  console.log('connect start...');
  //=========================================================================================================================================
  try
  {
  //=========================================================================================================================================
    // DBに接続    ---------------------------------------------------------------
    {
      console.log('Try connect ');
      var client = new pg.Client(config);
      try
      {
        await client.connect();
        console.log('connect ok');
      } catch (err)
      {
        errParm = expCom.editErr(500, 'DBに接続できませんでした。', 'DB', err);
        console.log('Err info:', errParm);
        await client.end();
        callback(errParm);
        return;
      } finally
      {

      }
    }
    // DBに接続 End---------------------------------------------------------------

    // SQL実行 ---------------------------------------------------------------
    {
      var result = '';
      var rv = '';
      try {
        console.log('sql   :' + sql);
        console.log('ReqItem :' + QueryParam);
        result = await client.query(sql,QueryParam);
        //結果の格納
        rv = { "count": result["rowCount"], "List": result["rows"] };
      } catch(err) {
        errParm = expCom.editErr(500, 'DBの処理が途中でエラーになりました。', 'DB', err);
        console.log('query Err info:', errParm);
        await client.end();
        callback(errParm);
        return;
      }

      console.log('return:', JSON.stringify(rv));
      console.log('return:', rv);
      context.succeed(rv);
    }
    // SQL実行 End---------------------------------------------------------------

  //=========================================================================================================================================
  } catch(err)
  {
    errParm = expCom.editErr(500, '障害が発生しました。', 'syntax', err);
    console.log('Err:', errParm);
    await client.end();
    callback(errParm);
    return;
  //=========================================================================================================================================
  } finally
  {
    console.log('connect finally');
    await client.end();
  }
  //=========================================================================================================================================
};



*/
