import { emailTemplate, partneremailNotification } from "@constants/constants";
import { NextResponse } from "next/server";
import transporter, { defaultSender } from "@lib/emailConfig";

// Using SendGrid SMTP service - emails sent from yookatale256@gmail.com via sendgrid.net
export const POST = async (req, res) => {
  try {
    const { email } = await req.json();
    // Send the welcome email
      const mailOptions = {
        from: {
          name: defaultSender.name,
          address: defaultSender.email, // yookatale256@gmail.com via sendgrid.net
        },
        replyTo: defaultSender.email,
        to: email,
        subject: "Welcome to our Food Market!",
        html: emailTemplate,
      };

    await transporter.sendMail(mailOptions);

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("Error point starts here");
    console.log({ error });
    return new NextResponse("Error occured", { status: 400 });
  }
};


export const POST2 = async(req, res)=>{
  let mailOptions = {}
  try {
    const body = req;
    if (body.length) {
      body.map((key, index) => {
        mailOptions = {
          from: {
            name: defaultSender.name,
            address: defaultSender.email, // yookatale256@gmail.com via sendgrid.net
          },
          replyTo: defaultSender.email,
          to: key.email,
          subject: "A new order has been created",
          html: partneremailNotification,
        }
      })
    }
    await transporter.sendMail(mailOptions);
    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("Error point starts here");
    console.log({ error });
    return new NextResponse("Error occured", { status: 400 });
  }
}
