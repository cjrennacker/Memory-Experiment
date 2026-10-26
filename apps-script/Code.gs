/**
 * Receives one JSON row per POST from index.html and appends it to a Google Sheet.
 * Rows with record_type "trial" go to the "Trials" tab and rows with record_type
 * "summary" go to the "Summary" tab. Tabs and header rows are created automatically.
 * New fields are added as new columns, so you can extend the task without editing this file.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var row = JSON.parse(e.postData.contents);
    var tabName = row.record_type === 'summary' ? 'Summary' : 'Trials';
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

    var lastCol = sheet.getLastColumn();
    var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

    Object.keys(row).forEach(function (key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
        sheet.getRange(1, headers.length).setValue(key);
      }
    });

    var values = headers.map(function (h) { return row[h] === undefined ? '' : row[h]; });
    sheet.appendRow(values);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Print Title Search logger is running.');
}
