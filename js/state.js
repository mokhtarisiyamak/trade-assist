// ===== CONFIG & STATE =====
const DATA_SCHEMA_VERSION = 6; // v6.x: multi-device backup + smart merge + deviceId + draft/UX
const STORAGE = {
  trades:'tbc_v4_trades', journal:'tbc_v4_journal',
  dailyChecks:'tbc_v4_daily_checks', preChecks:'tbc_v4_pre_checks', scores:'tbc_v4_scores',
  settings:'tbc_v4_settings', weekly:'tbc_v4_weekly',
  backup:'tbc_v4_last_backup',
  deviceId:'tbc_v4_device_id',
  tradeDraft:'tbc_v4_trade_draft',
  compactMode:'tbc_v4_compact'
};
let trades=[], journals=[], dailyChecks={}, preChecks={}, scoresCache={}, settings={}, weeklyReviews=[];
let editingResultId=null;
// v5.6: forcedStopEnd حالا در localStorage ذخیره می‌شود — رفرش صفحه قفل ۲ ساعته را دور نمی‌زند (مانع فیزیکی واقعی)
let forcedStopEnd=0;
try{ const _fs=localStorage.getItem('tbc_v4_forced_stop_end'); if(_fs) forcedStopEnd=parseInt(_fs,10)||0; }catch(e){}
let forcedTimerInterval=null;

// ===== DEVICE ID (for multi-device awareness) =====
function getDeviceId(){
  try{
    let id = localStorage.getItem(STORAGE.deviceId);
    if(!id){
      id = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,10);
      localStorage.setItem(STORAGE.deviceId, id);
    }
    return id;
  }catch(e){ return 'dev_unknown'; }
}
const DEVICE_ID = getDeviceId();

