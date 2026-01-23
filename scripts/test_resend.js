const { Resend } = require('resend');

const resend = new Resend('re_NdhXZA9Q_M6cBWu81jt5Vab4YPcwP9TEy');

async function sendTestEmail() {
  try {
    console.log('Sending test email via Resend...');
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'fcandiac@febeflo.com', // Using the email from your previous message
      subject: 'Test Email from Febeflo Script',
      html: '<p>Si lees esto, <strong>la API Key funciona correctamente</strong>.</p>'
    });

    if (data.error) {
        console.error('❌ Error sending email:', data.error);
    } else {
        console.log('✅ Email sent successfully!', data);
    }
  } catch (error) {
    console.error('❌ Exception:', error);
  }
}

sendTestEmail();
