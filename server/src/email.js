const nodemailer = require('nodemailer')
const path = require('path')
const emailLogoUrl = 'https://user52518.na.imgto.link/public/20261106/edb64a68ebf0c93a0b06a218-logo-email.avif'

function getTransport() {
  if (!process.env.SMTP_HOST) throw new Error('SMTP is not configured')
  if (process.env.SMTP_USER && !process.env.SMTP_PASS) {
    throw new Error('SMTP_PASS is required when SMTP_USER is configured')
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  })
}

function isTransientEmailError(error) {
  return ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EPIPE', 'ESOCKET'].includes(error.code)
    || [421, 450, 451, 452].includes(Number(error.responseCode))
}

async function deliverWithRetry(mailOptions) {
  for (let attempt = 0; ; attempt += 1) {
    const currentTransport = getTransport()
    try {
      return await currentTransport.sendMail(mailOptions)
    } catch (error) {
      const canRetry = attempt < 2 && isTransientEmailError(error)
      if (!canRetry) {
        console.error('Email delivery failed:', {
          code: error.code,
          responseCode: error.responseCode,
          command: error.command,
          message: error.message,
        })
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)))
    } finally {
      currentTransport.close()
    }
  }
}

async function sendMail(to, subject, text, html, attachments) {
  const result = await deliverWithRetry({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@orbit.local',
    to,
    subject,
    text,
    html,
    attachments: attachments || [{ filename: 'logo-email.png', path: path.join(__dirname, '..', '..', 'public', 'logo-email.png'), cid: 'orbit-logo' }],
  })
  if (!result.accepted.length || result.rejected.length) {
    const error = new Error('The email provider did not accept all recipients')
    error.code = 'SMTP_RECIPIENT_REJECTED'
    console.error('Email recipient rejected by SMTP server:', { accepted: result.accepted.length, rejected: result.rejected.length })
    throw error
  }
  console.log('Email accepted by SMTP server:', { subject, messageId: result.messageId, accepted: result.accepted.length })
  return result
}

async function sendBulkMail(recipients, subject, text, html) {
  const uniqueRecipients = [...new Set(recipients.map(email => email.trim().toLowerCase()).filter(Boolean))]
  let delivered = 0
  let failed = 0

  for (let i = 0; i < uniqueRecipients.length; i += 50) {
    const batch = uniqueRecipients.slice(i, i + 50)
    try {
      const result = await deliverWithRetry({
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@orbit.local',
        bcc: batch,
        subject,
        text,
        html,
        attachments: [{ filename: 'logo-email.png', path: path.join(__dirname, '..', '..', 'public', 'logo-email.png'), cid: 'orbit-logo' }],
      })
      delivered += result.accepted.length
      failed += Math.max(result.rejected.length, batch.length - result.accepted.length)
    } catch (error) {
      failed += batch.length
      console.error(`Announcement email batch ${Math.floor(i / 50) + 1} failed:`, error.message)
    }
  }

  return { delivered, failed }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char])
}

function loginCodeEmail({ name, code, email }) {
  const safeName = escapeHtml(name || 'there')
  const safeCode = escapeHtml(code)
  const appUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  const verifyParams = `email=${encodeURIComponent(email || '')}&code=${encodeURIComponent(code)}`
  const verifyUrl = `${appUrl}/verify?${verifyParams}`
  const safeVerifyUrl = escapeHtml(verifyUrl)
  const text = `Hello ${name || 'there'},\n\nYour ORBIT sign-in code is ${code}. It expires in 10 minutes. If you did not request it, you can ignore this email.\n\nORBIT`
  const html = `<!doctype html>
<html lang="en"><body style="margin:0;padding:30px 12px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#171717;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr><td style="background:#080808;padding:24px;text-align:center;">
    <img src="${emailLogoUrl}" alt="ORBIT" width="120" style="display:block;width:120px;max-width:80%;height:auto;margin:0 auto 8px;border:0;" />
    <p style="color:#fff;font-size:13px;letter-spacing:2px;margin:0;">DISCOVER. CREATE. BUILD.</p>
  </td></tr>
  <tr><td style="padding:32px;text-align:center;">
    <h1 style="margin:0 0 8px;font-size:22px;color:#0A0A0A;">Your ORBIT sign-in code</h1>
    <p style="color:#555;margin:0 0 24px;font-size:15px;">Hello ${safeName}, use this code to complete your sign-in.</p>
    <div style="font-size:32px;font-weight:800;letter-spacing:8px;color:#00838F;margin:16px 0;">${safeCode}</div>
    <div style="margin:8px 0 16px;">
      <a href="${safeVerifyUrl}" style="display:inline-block;margin:4px;padding:13px 24px;border-radius:999px;background:#00838F;color:#fff;text-decoration:none;font-weight:700;font-size:15px;">Confirm sign-in</a>
    </div>
    <p style="color:#666;font-size:13px;margin:24px 0 0;">This code expires in 10 minutes. If you did not request it, ignore this email.</p>
  </td></tr>
  <tr><td style="padding:20px 32px;background:#F4F6F8;text-align:center;">
    <p style="color:#888;font-size:12px;margin:0;">ORBIT — Discover. Create. Build.</p>
  </td></tr>
</table>
</body></html>`
  return { text, html }
}

function signInEmailHtml(name, confirmUrl, secureUrl) {
  const safeName = escapeHtml(name || 'there')
  const safeConfirm = escapeHtml(confirmUrl || '#')
  const safeSecure = escapeHtml(secureUrl || '#')
  const appUrl = escapeHtml(process.env.ORBIT_APP_URL || 'http://localhost:5173')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ORBIT</title>
</head>
<body style="margin:0;padding:30px 12px;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#171717;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
  <tr>
    <td style="background:#111827;padding:30px 40px;border-radius:12px 12px 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <img src="${emailLogoUrl}" alt="ORBIT" width="120" style="display:block;height:auto;border:0;" />
            <div style="font-size:11px;color:#9ca3af;letter-spacing:0.5px;margin-top:6px;text-transform:uppercase;">
              Discover. Create. Build.
            </div>
          </td>
          <td align="right" style="vertical-align:middle;">
            <div style="margin-bottom:8px;text-align:right;">
              <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#ffbf08;margin-left:4px;"></span>
              <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#d00800;margin-left:4px;"></span>
            </div>
            <div style="font-size:13px;color:#d1d5db;line-height:1.4;text-align:right;max-width:180px;">
              Premium templates, digital resources and tools for creators.
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="background:#ffffff;padding:40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f7f9;border-radius:10px;">
        <tr>
          <td align="center" style="padding:35px 20px;">
            <div style="background-color:#00bcd4;width:56px;height:42px;border-radius:8px;display:inline-block;position:relative;">
              <div style="position:absolute;top:0;left:0;width:0;height:0;border-left:28px solid transparent;border-right:28px solid transparent;border-top:22px solid #0097a7;border-top-left-radius:6px;border-top-right-radius:6px;"></div>
              <div style="position:absolute;bottom:-4px;right:-6px;background-color:#0284c7;color:#ffffff;width:22px;height:22px;border-radius:50%;font-size:12px;font-weight:bold;line-height:22px;text-align:center;border:2px solid #f0f7f9;">✓</div>
            </div>
            <h1 style="font-size:24px;font-weight:800;color:#111827;margin:20px 0 8px 0;">Welcome to ORBIT</h1>
            <p style="font-size:14px;color:#4b5563;margin:0;">Welcome back! We are glad to see you again.</p>
          </td>
        </tr>
      </table>
      <h2 style="font-size:18px;font-weight:700;color:#111827;margin:25px 0 15px 0;">Hello ${safeName}!</h2>
      <p style="font-size:14px;color:#374151;line-height:1.6;margin-bottom:25px;">
        Thank you for being part of ORBIT. We noticed a new sign-in to your account. If this was you, you can confirm below. If not, please secure your account immediately.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding-bottom:15px;">
            <a href="${safeConfirm}" target="_blank" style="background-color:#00a8b5;color:#ffffff;padding:14px 30px;border-radius:6px;font-size:15px;font-weight:600;text-decoration:none;display:inline-block;box-shadow:0 2px 4px rgba(0,168,181,0.2);margin:4px;">Yes, it was me &rarr;</a>
            <a href="${safeSecure}" target="_blank" style="background-color:#ffffff;color:#dc2626;padding:14px 30px;border-radius:6px;font-size:15px;font-weight:600;text-decoration:none;display:inline-block;border:1px solid #dc2626;margin:4px;">Secure my account</a>
          </td>
        </tr>
      </table>
      
    </td>
  </tr>
  <tr>
    <td align="center" style="background-color:#fcfcfc;border-top:1px solid #eaeaea;border-radius:0 0 12px 12px;padding:30px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr>
          <td align="left"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#00bcd4;"></span></td>
          <td align="right"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#ffbf08;"></span></td>
        </tr>
      </table>
      <img src="${emailLogoUrl}" alt="ORBIT" width="120" style="display:block;height:auto;border:0;margin:0 auto;" />
      <div style="font-size:10px;color:#9ca3af;letter-spacing:0.5px;margin-top:4px;text-transform:uppercase;">
        Discover. Create. Build.
      </div>
      <div style="margin:15px 0;">
        <span style="height:8px;width:8px;background-color:#00bcd4;border-radius:50%;display:inline-block;margin:0 3px;"></span>
        <span style="height:8px;width:8px;background-color:#e53935;border-radius:50%;display:inline-block;margin:0 3px;"></span>
        <span style="height:8px;width:8px;background-color:#fbbf24;border-radius:50%;display:inline-block;margin:0 3px;"></span>
      </div>
      <div style="font-size:11px;color:#9ca3af;line-height:1.5;">
        &copy; ${new Date().getFullYear()} ORBIT. All rights reserved.<br>
        <a href="${escapeHtml(process.env.ORBIT_APP_URL || 'http://localhost:5173')}" target="_blank" style="color:#6b7280;text-decoration:underline;">www.orbit.com</a>
      </div>
    </td>
  </tr>
</table>
</body>
</html>`
}

function layout(title, bodyHtml) {
  const appUrl = escapeHtml(process.env.ORBIT_APP_URL || 'http://localhost:5173')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:30px 12px;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#171717;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
  <!-- HEADER -->
  <tr>
    <td style="background:#111827;padding:30px 40px;border-radius:12px 12px 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <img src="${emailLogoUrl}" alt="ORBIT" width="120" style="display:block;height:auto;border:0;" />
            <div style="font-size:11px;color:#9ca3af;letter-spacing:0.5px;margin-top:6px;text-transform:uppercase;">
              Discover. Create. Build.
            </div>
          </td>
          <td align="right" style="vertical-align:middle;">
            <div style="font-size:13px;color:#d1d5db;line-height:1.4;text-align:right;max-width:180px;">
              Premium templates, digital resources and tools for creators.
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- BODY CONTENT -->
  <tr>
    <td style="background:#ffffff;padding:40px;">
      ${bodyHtml}
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td align="center" style="background-color:#fcfcfc;border-top:1px solid #eaeaea;border-radius:0 0 12px 12px;padding:30px 40px;">
      <img src="${emailLogoUrl}" alt="ORBIT" width="120" style="display:block;height:auto;border:0;margin:0 auto;" />
      <div style="font-size:10px;color:#9ca3af;letter-spacing:0.5px;margin-top:4px;text-transform:uppercase;">
        Discover. Create. Build.
      </div>
      <div style="margin:15px 0;">
        <span style="height:8px;width:8px;background-color:#00bcd4;border-radius:50%;display:inline-block;margin:0 3px;"></span>
        <span style="height:8px;width:8px;background-color:#e53935;border-radius:50%;display:inline-block;margin:0 3px;"></span>
        <span style="height:8px;width:8px;background-color:#fbbf24;border-radius:50%;display:inline-block;margin:0 3px;"></span>
      </div>
      <div style="font-size:11px;color:#9ca3af;line-height:1.5;">
        &copy; ${new Date().getFullYear()} ORBIT. All rights reserved.<br>
        <a href="${appUrl}" target="_blank" style="color:#6b7280;text-decoration:underline;">www.orbit.com</a>
      </div>
    </td>
  </tr>
</table>
</body>
</html>`
}

function welcomeEmail({ name }) {
  const safeName = escapeHtml(name || 'there')
  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f7f9;border-radius:10px;">
      <tr>
        <td align="center" style="padding:35px 20px;">
          <h1 style="font-size:24px;font-weight:800;color:#111827;margin:20px 0 8px 0;">Welcome to ORBIT!</h1>
          <p style="font-size:14px;color:#4b5563;margin:0;">Your creative journey starts here.</p>
        </td>
      </tr>
    </table>
    <h2 style="font-size:18px;font-weight:700;color:#111827;margin:25px 0 15px 0;">Hello, ${safeName}!</h2>
    <p style="font-size:14px;color:#374151;line-height:1.6;margin-bottom:25px;">
      Thank you for joining ORBIT. We’re excited to have you as part of our creative community. Explore premium templates, digital resources and tools to bring your ideas to life.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-bottom:15px;">
          <a href="${escapeHtml(process.env.ORBIT_APP_URL || 'http://localhost:5173')}/templates" target="_blank" style="background-color:#00a8b5;color:#ffffff;padding:14px 30px;border-radius:6px;font-size:15px;font-weight:600;text-decoration:none;display:inline-block;box-shadow:0 2px 4px rgba(0,168,181,0.2);">
            Explore templates &rarr;
          </a>
        </td>
      </tr>
    </table>
  `

  return {
    subject: 'Welcome to ORBIT',
    text: `Hello ${name || 'there'},\n\nWelcome to ORBIT! Your account is ready. Explore premium templates, digital resources and tools at ${(process.env.ORBIT_APP_URL || 'http://localhost:5173')}/templates.\n\nORBIT — Discover. Create. Build.`,
    html: layout('Welcome to ORBIT', body),
  }
}

module.exports = { sendMail, sendBulkMail, loginCodeEmail, signInEmailHtml, welcomeEmail }
