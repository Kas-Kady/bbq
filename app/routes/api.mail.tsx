import sgMail from '@sendgrid/mail';
import { json } from '@remix-run/node';

export async function action() {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'hi@lodybo.nl', // Change to your recipient
    from: 'test@bbq.kaskady.nl', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  try {
    // TODO: uncomment this when we're gonna send mails.
    // await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    return json({ error: error }, { status: (error as any).code });
  }

  return json({ success: true });
}
