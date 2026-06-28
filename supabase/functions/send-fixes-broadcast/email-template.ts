export const FIXES_BROADCAST_SUBJECT = "A quick fix to your reader — please sign back in.";
export const FIXES_BROADCAST_PREVIEW =
  "A small number of readers saw an unfamiliar font and lost their scroll position when switching tabs. Both are fixed.";

export const FIXES_BROADCAST_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light">
    <title>A quick fix to your reader.</title>
  </head>
  <body style="margin:0;padding:0;background:#f1ece4;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      A small number of readers saw an unfamiliar font and lost their scroll position when switching tabs. Both are fixed.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1ece4;">
      <tr>
        <td align="center" style="padding:26px 12px;">
          <table role="presentation" width="820" cellpadding="0" cellspacing="0" style="max-width:820px;width:100%;background:#fbf7ef;border:1px solid #ded8cd;">
            <tr>
              <td style="padding:46px 56px 48px;background:#fbf7ef;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="top" style="width:30%;padding-right:28px;">
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;letter-spacing:4px;text-transform:uppercase;color:#111111;font-weight:700;">
                        ALP Handbook
                      </p>
                      <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.5;letter-spacing:3px;text-transform:uppercase;color:#6f6a61;">
                        Reader Update
                      </p>
                    </td>
                    <td valign="top" style="width:70%;">
                      <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:48px;line-height:0.98;font-weight:400;color:#111111;letter-spacing:-1px;">
                        Two small fixes.<br>
                        Both resolved.
                      </h1>
                    </td>
                  </tr>
                </table>
                <div style="height:34px;line-height:34px;">&nbsp;</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="height:1px;background:#cfc7b8;">&nbsp;</td>
                  </tr>
                </table>
                <div style="height:30px;line-height:30px;">&nbsp;</div>
                <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#4f4a42;">
                  A reader flagged two issues in the handbook reader this week. Depending on your browser and location, you may have seen them too. Both have been fixed.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:18px 0;border-top:1px solid #d4ccbe;">
                      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.35;color:#111111;font-weight:700;">
                        The font looked wrong.
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#4f4a42;">
                        Certain browsers and content blockers were silently substituting a different typeface, which made headings look like a random mix of upper and lower case. The reader now loads its fonts directly and renders the same on every device.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 0;border-top:1px solid #d4ccbe;">
                      <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:1.35;color:#111111;font-weight:700;">
                        Your place wasn't held.
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#4f4a42;">
                        Switching to another tab and coming back was sending readers to the top of the page. The reader now stays exactly where you left off, even after a tab switch or a short break.
                      </p>
                    </td>
                  </tr>
                </table>
                <div style="height:34px;line-height:34px;">&nbsp;</div>
                <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;letter-spacing:3px;text-transform:uppercase;color:#111111;">
                  <span style="color:#d95f22;font-weight:700;">Please sign back in</span><br>
                  To pick up the fixes, open the handbook and sign in again.
                </p>
                <p style="margin:0;">
                  <a href="https://alphandbook.com/auth" style="display:inline-block;background:#111111;color:#fbf7ef;text-decoration:none;padding:15px 22px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">
                    Sign in to the Handbook
                  </a>
                </p>
                <p style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#4f4a42;">
                  Sign in with the same email you used at checkout. You'll receive a magic link — no password needed.
                </p>
                <div style="height:34px;line-height:34px;">&nbsp;</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="height:1px;background:#cfc7b8;">&nbsp;</td>
                  </tr>
                </table>
                <p style="margin:22px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.4;color:#111111;">
                  Marshall
                </p>
                <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#4f4a42;">
                  If you hit any other snags, reply to this email or reach me at <a href="mailto:marshall@marshallwilkinson.com" style="color:#111111;text-decoration:underline;">marshall@marshallwilkinson.com</a>. Thanks to the readers who flagged this.
                </p>
                <p style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#8a8377;">
                  You are receiving this because you purchased the ALP Handbook.
                  <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#8a8377;text-decoration:underline;">Unsubscribe</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
