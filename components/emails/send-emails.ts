import nodemailer from "nodemailer";

import { ReactElement } from "react";
import { render } from "@react-email/components";
import { OtpEmail } from "./templates/OtpEmail";
import NewsletterEmail from "./templates/NewsletterEmail";
import AccountCreatedEmail from "./templates/AccountCreatedEmail";
import ContactConfirmationEmail from "./templates/ContactConfirmationEmail";
import ApplicationConfirmationEmail from "./templates/ApplicationConfirmationEmail";

type SenderType = "default" | "confirmation" | "payment" | "otp";

const getTransporter = (sender: SenderType = "default") => {
  if (sender === "payment") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (sender === "confirmation") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (sender === "otp") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Default sender: contact@newhope-college.com
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendEmail({
  to,
  subject,
  html,
  sender = "default",
}: {
  to: string;
  subject: string;
  html: string;
  sender?: SenderType;
}) {
  const transporter = getTransporter(sender);
  transporter.verify(function (error, success) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Server is ready to take our messages", success);
    }
  });

  const from = fromSubject(sender);

  function fromSubject(type: SenderType) {
    switch (type) {
      case "default":
        return `"Connect Student" <${process.env.SMTP_USER}>`;
      case "payment":
        return `"Connect Student - Paiement" <${process.env.SMTP_USER}>`;
      case "confirmation":
        return `"Connect Student - Confirmation" <${process.env.SMTP_USER}>`;
      case "otp":
        return `"Connect Student - OTP" <${process.env.SMTP_USER}>`;
      default:
        return `"Connect Student" <${process.env.SMTP_USER}>`;
    }
  }

  return await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}

// send opt
export async function sendOtpEmail(to: string, fullname: string, otp: string) {
  const emailHtml = await render(OtpEmail({ fullname, otp }) as ReactElement);

  await sendEmail({
    to,
    subject: "Code OTP pour la connexion à votre compte Connect Student",
    html: emailHtml,
    sender: "otp",
  });
}

// send confirm subscription newsletter
export async function sendNewsletterEmail(to: string, email: string) {
  const emailHtml = await render(NewsletterEmail({ email }) as ReactElement);

  await sendEmail({
    to,
    subject: "Merci pour votre abonnement à notre newsletter !",
    html: emailHtml,
    sender: "default",
  });
}

// send confirm create account
export async function sendAccountCreatedEmail(
  to: string,
  fullname: string,
  otp?: string,
) {
  const emailHtml = await render(
    AccountCreatedEmail({ fullname, otp }) as ReactElement,
  );

  await sendEmail({
    to,
    subject: "Confirmation de création de compte",
    html: emailHtml,
    sender: "confirmation",
  });
}

// send confirm contact message
export async function sendContactConfirmationEmail(
  to: string,
  fullname: string,
  messageSummary?: string,
) {
  const emailHtml = await render(
    ContactConfirmationEmail({ fullname, messageSummary }) as ReactElement,
  );

  await sendEmail({
    to,
    subject: "Confirmation de votre message",
    html: emailHtml,
    sender: "confirmation",
  });
}

// send confirm application job
export async function sendJobApplicationEmail(
  to: string,
  candidateName: string,
  jobTitle: string,
  companyName: string,
  coverJob: string,
) {
  const emailHtml = await render(
    ApplicationConfirmationEmail({
      candidateName,
      jobTitle,
      companyName,
      coverJob,
    }) as ReactElement,
  );

  await sendEmail({
    to,
    subject: "Confirmation de votre candidature",
    html: emailHtml,
    sender: "confirmation",
  });
}
