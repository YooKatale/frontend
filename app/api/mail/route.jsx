import { emailTemplate, partneremailNotification } from "@constants/constants";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

//Lets leave this to be accessible to other services/functions

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yookatale256@gmail.com",
    pass: "yomarket256!",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
export const POST = async (req, res) => {
  try {
    const { email } = await req.json();
    // Send the welcome email
    const mailOptions = {
      from: "yookatale256@gmail.com",
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
          from: "yookatale256@gmail.com",
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
