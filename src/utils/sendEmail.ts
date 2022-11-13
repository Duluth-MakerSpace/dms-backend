import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, subject: string, message: string) {
    // let testAccount = await nodemailer.createTestAccount();
    // console.log('testAccount', testAccount)

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'x3zc7edmi247r7ff@ethereal.email', // generated ethereal user
            pass: '1dzBSpu2SfRpJvenUS', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Duluth MakerSpace 🛠" <foo@example.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: message, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
