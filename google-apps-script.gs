// Google Sheets → Extensions → Apps Script. Paste, save, then deploy as Web app.
// Execute as: Me. Who has access: Anyone. Copy Web app URL to Cloudflare variable GOOGLE_APPS_SCRIPT_URL.
function doPost(e) {
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || "{}");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Диагностика") || ss.insertSheet("Диагностика");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Уақыты", "Аты-жөні", "Телефон", "Сынып", "Ұпай", "Барлығы", "Пайыз", "Қорытынды", "Тақырыптар", "Жауаптар"]);
    }
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name || "",
      data.phone || "",
      data.grade || "",
      data.score ?? "",
      data.total ?? "",
      data.percent ?? "",
      data.level || "",
      data.topicResults || "",
      data.detailedAnswers || ""
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
