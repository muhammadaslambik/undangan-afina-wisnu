// Database ucapan + RSVP (Google Sheets). Kolom: Waktu, Nama, Status, Ucapan, Jumlah
// Kolom "Jumlah" ditaruh di paling kanan supaya data lama tidak bergeser.
const SHEET = 'Ucapan';
const HEAD = ['Waktu', 'Nama', 'Status', 'Ucapan', 'Jumlah'];
const SS_ID = ''; // kosongkan bila skrip dibuat dari menu Extensions > Apps Script di dalam spreadsheet

function sh_() {
  const ss = SS_ID ? SpreadsheetApp.openById(SS_ID) : SpreadsheetApp.getActiveSpreadsheet();
  const s = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (s.getRange(1, 5).getValue() !== 'Jumlah') {
    s.getRange(1, 1, 1, 5).setValues([HEAD]).setFontWeight('bold');
    s.setFrozenRows(1);
  }
  return s;
}

const cut_ = (v, n) => String(v == null ? '' : v).slice(0, n);

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents), s = sh_(), r = s.getLastRow() + 1, hadir = d.status === 'Hadir';
    // format teks (@) mencegah isi berawalan = + - @ dibaca sebagai rumus
    s.getRange(r, 1, 1, 4).setNumberFormat('@').setValues([[
      cut_(d.time || new Date().toLocaleString('id-ID'), 40),
      cut_(d.name, 60),
      hadir ? 'Hadir' : 'Tidak Hadir',
      cut_(d.text, 300)
    ]]);
    s.getRange(r, 5).setValue(hadir ? Math.min(5, Math.max(1, parseInt(d.guests, 10) || 1)) : 0);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error');
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  const s = sh_(), last = s.getLastRow();
  let out = [];
  if (last > 1) {
    const from = Math.max(2, last - 199); // maksimal 200 terbaru
    out = s.getRange(from, 1, last - from + 1, 5).getValues().reverse().map((r) => ({
      time: String(r[0]), name: String(r[1]), status: String(r[2]),
      text: String(r[3]).replace(/^'/, ''), guests: Number(r[4]) || 0
    }));
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
