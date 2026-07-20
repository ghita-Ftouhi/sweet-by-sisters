import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Sweet by Sisters" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `💌 Nouveau message de ${name} — Sweet by Sisters`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #7a2050; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🍪 Sweet by Sisters</h1>
            <p style="color: #f9c6d0; margin: 6px 0 0;">Nouveau message reçu</p>
          </div>
          <div style="background: #fff5f7; padding: 24px; border-radius: 0 0 12px 12px;">
            <p><strong style="color:#7a2050;">Nom :</strong> ${name}</p>
            <p><strong style="color:#7a2050;">Email :</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong style="color:#7a2050;">Message :</strong></p>
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #e8697a;">
              ${message.replace(/\n/g, '<br/>')}
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 24px;">Réponds directement à cet email pour contacter ${name}.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
