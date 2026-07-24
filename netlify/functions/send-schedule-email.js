// Netlify Function: POST /.netlify/functions/send-schedule-email
// Body: { email: string, childName: string, pdfBase64: string }
// Requires RESEND_API_KEY set as a Netlify environment variable (server-side only, no VITE_ prefix).

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'RESEND_API_KEY belum diatur di Netlify environment variables.' }),
    }
  }

  try {
    const { email, childName, pdfBase64 } = JSON.parse(event.body || '{}')

    if (!email || !pdfBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: 'email dan pdfBase64 wajib diisi.' }) }
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Jadwal Ceria <onboarding@resend.dev>',
        to: [email],
        subject: `Jadwal Harian ${childName || 'Anak'}`,
        html: `<p>Halo! Terlampir jadwal harian untuk <strong>${childName || 'anak kamu'}</strong>.</p>`,
        attachments: [
          {
            filename: `jadwal-${(childName || 'anak').toLowerCase()}.pdf`,
            content: pdfBase64,
          },
        ],
      }),
    })

    const data = await resendRes.json()

    if (!resendRes.ok) {
      return {
        statusCode: resendRes.status,
        body: JSON.stringify({ error: data.message || 'Gagal mengirim email lewat Resend.' }),
      }
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, id: data.id }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Terjadi kesalahan server.' }) }
  }
}
