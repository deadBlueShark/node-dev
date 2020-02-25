'use strict';
/* Where句の生成 */
exports.editWhere = function (sWhere,sConjunction) {
    var sW = '';
    if (sWhere==''){
        sW = ' WHERE';
    }else{
        sW = sWhere+' '+sConjunction;
    }
    
    return sW;
};
/* エラーレスポンスの生成 */
exports.editErr = function (sResponseCode,sErrorMessage,sParam,sReason) {
    var sN ={"responseCode":sResponseCode,"errorMessage":sErrorMessage,"errorList":{"param":sParam,"reason":sReason}};
  return JSON.stringify(sN);
};
/* 処理区分から対象ステータスを返す */
/* アプリ用 */
exports.getSyutokuItem = function (syutokuKbn) {
//指令一覧：指令、承諾、拒否（アプリ側には不要）、対応中、完了前、キャンセル
//履歴一覧：完了、再指令済（アプリ側には不要？）、キャンセル確認
//00：指令　01：承諾　02：拒否　03：対応中　04：完了前　10：キャンセル  11：未達　90：完了　91：再指令済　92：キャンセル確認
    var sN='';
    
    switch (syutokuKbn) {
      case '1'://指令一覧
        sN=sN+' \'00\''; //指令
        sN=sN+',\'01\''; //承諾
        sN=sN+',\'03\''; //対応中
        sN=sN+',\'04\''; //完了前
        sN=sN+',\'10\''; //キャンセル
        sN=sN+',\'11\''; //未達
        
        break;
      case '2'://履歴一覧
        sN=sN+' \'90\''; //完了
        sN=sN+',\'91\''; //再指令済
        sN=sN+',\'92\''; //キャンセル確認
        break;
      default:
        break;
    }
    
    
    return sN;
};
/* 処理区分から対象ステータスを返す */
/* 指令PC用 */
exports.getSiSyutokuItem = function (syutokuKbn) {
//「指令応答待」…ステータス「指令」「未達」「拒否」
//「指令状況」…ステータス「承諾」「対応中」「完了前」「キャンセル」
//「指令履歴」…ステータス「完了」「再指令済」「キャンセル確認」
//00：指令　01：承諾　02：拒否　03：対応中　04：完了前　10：キャンセル  11：未達　90：完了　91：再指令済　92：キャンセル確認
//2018/7/11 設計書より
//指令一覧モード：t_sirei.status が「01：承諾」「03：対応中」「04：完了前」「10：キャンセル」
//応答待指令モード：t_sirei.status が「00：指令」「02：拒否」「11：未達」
    var sN='';
    
    switch (syutokuKbn) {
      case '1'://「指令一覧モード」
        sN=sN+' \'01\''; //承諾
        sN=sN+',\'03\''; //対応中
        sN=sN+',\'04\''; //完了前
        sN=sN+',\'10\''; //キャンセル
        break;
      case '2'://「応答待指令モード」
        sN=sN+' \'00\''; //指令
        sN=sN+',\'02\''; //拒否
        sN=sN+',\'11\''; //未達
        break;
      case '3'://「指令履歴」
        sN=sN+' \'90\''; //完了
        sN=sN+',\'91\''; //再指令済
        sN=sN+',\'92\''; //キャンセル確認
        break;
      default:
        break;
    }
    
    
    return sN;
};
//配列かどうか正確に判定する
exports.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
//nullかどうか判別する
exports.isNull = function (obj) {
  if (obj===undefined){
    return false;
  }
  if (obj==""){
    return false;
  }
  if (obj === null){
    return true;
  }
  
  if((typeof obj)=='string'){
    if(obj.toLowerCase() == 'null' ){
      return true;
    }
  }
  return false;
};
//指定された日付をYYYYMMDD形式で返す
exports.getYYYYMMDDString = function (odATE) {
var dt =new Date(odATE);
var yyyymmdd = dt.getFullYear()+( "0"+( dt.getMonth()+1 ) ).slice(-2)+( "0"+dt.getDate() ).slice(-2);
    return yyyymmdd;
};
//指定された日付をHHMMSS形式で返す
exports.getHHMMSSString = function (odATE) {
var dt =new Date(odATE);
                    console.log("dt:"+dt);
var HHMMSS = ( "0"+( dt.getHours()+1 ) ).slice(-2)+( "0"+( dt.getMinutes()+1 ) ).slice(-2)+( "0"+dt.getSeconds() ).slice(-2);
    return HHMMSS;
};
exports.manualLowercase = function (s) {
  return s.replace(/[A-Z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) | 32);});
};
exports.manualUppercase = function (s) {
  return s.replace(/[a-z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) & ~32);});
};
//指定された文字列をSQLに必要な設定で返す
exports.getSqlChar = function (obj) {
    //nullかどうか判別する
    var sql = "";
    if (this.isNull(obj)){
     sql += 'null';
     return sql;
    }
      sql +='\'' + obj + '\'';
    return sql;
    
};
//指定された数値をSQLに必要な設定で返す
exports.getSqlInt = function (obj) {
    //nullかどうか判別する
    var sql = "";
    if (this.isNull(obj)){
     sql += 'null';
     return sql;
    }
    
    sql +='' + obj + '';
    return sql;
};
//SQLインジェクション対策
exports.SqlIjCounter = function (obj) {
  var reobj = "";
  
  switch (typeof obj) {
      case 'string'://文字列
        reobj = obj;
        reobj = reobj.replace( /\"/g , "\"\"" );//ダブルコーテーションの置き換え
        reobj = reobj.replace( /\'/g , "\'\'" );//シングルコーテーションの置き換え
        reobj = reobj.replace( /\r?/g , "" );//改行コードに\rが含まれる場合の対応
        break;
      case 'number'://数値
        reobj = obj;
        break;
      case 'boolean'://boolean
        reobj = obj;
        break;
      case 'undefined'://undefined
        reobj = obj;
        break;
      case 'null'://null
        reobj = obj;
        break;
    }
  
    return reobj;
};