# Save website leads in a Google Sheet

Every callback form on the site posts to `/api/lead`. If `LEAD_WEBHOOK_URL` is set, each lead is also sent there. This guide points that at a Google Sheet. No code changes are needed.

## 1. Make the sheet
1. Create a new Google Sheet called **Humsafar Leads**.
2. In row 1 type these headers, one per column (A to K):
   `Time | Name | Phone | From city | Travel month | People | Trip | Page | Status | Next follow-up | Notes`

## 2. Add the script
1. In the sheet: **Extensions → Apps Script**.
2. Delete everything and paste this:

```js
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var d = JSON.parse(e.postData.contents);
  var next = new Date(d.createdAt || new Date());
  next.setDate(next.getDate() + 1);
  sheet.appendRow([
    new Date(d.createdAt || new Date()),
    d.name, d.phone, d.fromCity, d.travelMonth, d.people,
    d.trip, d.page, d.status || "new", next, ""
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, allow the permissions, and copy the **Web app URL**.

## 3. Connect it to the site
Add this environment variable in your hosting settings (Vercel → Settings → Environment Variables), then redeploy:

```
LEAD_WEBHOOK_URL = <the Web app URL>
```

## 4. Test
Open any tour page, submit the callback form with a test name and a number like 9876543210, and check that a new row appears in the sheet.

## Tips
- Add a dropdown to the **Status** column (new, contacted, interested, advance paid, confirmed, lost).
- Add conditional formatting on **Next follow-up**: red when the date is before today, so overdue leads stand out.
- The URL works for anyone who has it, so keep it private. Leave `SANITY_WRITE_TOKEN` unset if you only want the sheet.
