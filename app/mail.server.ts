import sgMail from '@sendgrid/mail';
import type { getBBQ } from '~/models/bbq.server';
import type { User, Attendee, BBQ, Upgrade } from '@prisma/client';
import { formatAmountToLocale, formatDateToLocale } from '~/utils';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const from = {
  name: 'BBQ @ Kas Kady',
  email: 'bbq@bbq.kaskady.nl',
};

export function sendMail(to: string, subject: string, html: string) {
  return sgMail.send({
    to,
    from,
    subject,
    html,
  });
}

export function sendMailToAttendees(
  bbq: NonNullable<Awaited<ReturnType<typeof getBBQ>>>,
) {
  let emails: sgMail.MailDataRequired[] = [];
  bbq.attendees.map((attendee) => {
    emails.push({
      to: {
        name: attendee.user.name,
        email: attendee.user.email,
      },
      from,
      subject: `Bevestiging ${bbq.title}`,
      html: parseBBQConfirmationTemplate(bbq, attendee),
    });
  });

  return sgMail.send(emails).catch((err) => {
    console.error(err);
    throw err.body;
  });
}

function parseBBQConfirmationTemplate(
  bbq: BBQ,
  attendee: Attendee & { user: User; chosenUpgrades: Upgrade[] },
) {
  const { user } = attendee;
  const chosenDate: string = bbq.date?.toISOString() || '';
  const attendeeChoseThisDate = attendee.availableDates.includes(chosenDate);

  return `
    <p>Hallo ${user.name},</p>
    <p>
      Jij hebt je mogelijke datums opgegeven voor ${bbq.title}<br/>
      De BBQ is gepland op <strong>${formatDateToLocale(bbq.date!)}</strong>
    </p>
    
    ${
      !attendeeChoseThisDate
        ? `
      <p>
        Je hebt aangegeven dat je niet kan op deze datum. Helaas, maar dan zien je we je graag een andere keer!
      </p>
    `
        : `
      <p>
        Je hebt aangegeven dat je kan op deze datum, we zien je dus graag tegen die tijd verschijnen!
      </p>
      
      ${
        attendee.brings
          ? `<p>
        Je neemt het volgende mee: <em>${attendee.brings}</em>
      </p>`
          : ''
      }
      
      ${
        attendee.chosenUpgrades.length
          ? `
      <p>Je hebt de volgende upgrades gekozen:</p>
      <ul>
        ${attendee.chosenUpgrades
          .map(
            (upgrade) => `<li>${upgrade.description} (${formatAmountToLocale(
              upgrade.amount,
            )})}
        )</li>`,
          )
          .join('')}
      </ul>
      `
          : ''
      }
    `
    }
  `;
}
