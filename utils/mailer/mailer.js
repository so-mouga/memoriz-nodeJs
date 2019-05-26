const nodemailer = require('nodemailer');
//Config Maildev
const transporter = nodemailer.createTransport({
  host: 'maildev',
  port: 25,
  //We add this setting to tell nodemailer the host isn't secure during dev:
  ignoreTLS: true,
});
exports.send = (from, to, subject, text) => {
  if (process.env.NODE_ENV === 'development') {
    return transporter.sendMail(
      {
        from: from,
        to: to,
        subject: subject,
        text: text,
      },
      (err, info) => {
        if (err) {
          return err;
        }
        return info;
      },
    );
  }

  return null;
};
