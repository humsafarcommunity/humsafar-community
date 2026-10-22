# Save website leads in a Google Sheet

Every callback form on the site posts to `/api/lead`. If `LEAD_WEBHOOK_URL` is set, each lead is also sent there. This guide points that at a Google Sheet. No code changes are needed.

## 1. Make the sheet
1. Create a new Google Sheet called **Humsafar Leads**.
2. In row 1 type these headers, one per column (A to O):
   `Time | Name | Phone | Email | Trip type | Destination | From city | Travel month | People | Trip | Page | OK to send offers | Status | Next follow-up | Notes`

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
    d.name, d.phone, d.email || "", d.tripType || "", d.destination || "",
    d.fromCity || "", d.travelMonth || "", d.people || "",
    d.trip || "", d.page || "", d.consent ? "Yes" : "No",
    d.status || "new", next, ""
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

## The enquiry popup
In Sanity Studio open **Site Settings → Enquiry Popup Form** to change the photo, heading, button text, trip types and destinations. Visitors open it with the **Enquire Now** button in the menu. Its submissions land in the same sheet. If you already deployed the older script, paste this newer one and choose **Deploy → Manage deployments → Edit → New version**, so the link stays the same.

## Tips
- Add a dropdown to the **Status** column (new, contacted, interested, advance paid, confirmed, lost).
- Add conditional formatting on **Next follow-up**: red when the date is before today, so overdue leads stand out.
- The URL works for anyone who has it, so keep it private. Leave `SANITY_WRITE_TOKEN` unset if you only want the sheet.
