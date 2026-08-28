import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user, pass },
  });
}

export async function sendEmail({
  subject,
  html,
  to,
}: {
  subject: string;
  html: string;
  to?: string;
}) {
  const transporter = getTransporter();
  const recipient = to || process.env.EMAIL_TO || process.env.SMTP_USER;

  if (!transporter || !recipient) {
    console.warn("[email] SMTP not configured — logging email instead");
    console.log({ to: recipient, subject, html });
    return { queued: false, logged: true };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: recipient,
    subject,
    html,
  });

  return { queued: true, logged: false };
}

export function productEnquiryEmail(data: {
  productName: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  deliveryAddress: string;
  message?: string;
}) {
  return {
    subject: `New Product Enquiry: ${data.productName}`,
    html: `
      <h2>New Product Enquiry</h2>
      <p><strong>Product:</strong> ${data.productName}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Quantity:</strong> ${data.quantity}</p>
      <p><strong>Delivery Address:</strong> ${data.deliveryAddress}</p>
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}
    `,
  };
}

export function distributorEmail(data: {
  name: string;
  businessName: string;
  email: string;
  whatsapp: string;
  state: string;
  city: string;
}) {
  return {
    subject: `New Distributor Application: ${data.businessName}`,
    html: `
      <h2>New Distributor Application</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Business Name:</strong> ${data.businessName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
      <p><strong>State:</strong> ${data.state}</p>
      <p><strong>City:</strong> ${data.city}</p>
    `,
  };
}

export function contactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return {
    subject: `Contact Form: ${data.subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  };
}
