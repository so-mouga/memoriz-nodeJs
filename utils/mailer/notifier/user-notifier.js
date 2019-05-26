const Mailer = require('../mailer');

exports.sendMailValidationUser = (user, token) => {
  return Mailer.send(
    process.env.ADMIN_MAIL,
    user.email,
    'Bienvenue sur Memoriz',
    `Bienvenue ${user.userName} sur la plateforme Memoriz lien de validation : ${
      process.env.HOST_URL
    }/api/users/verify/account?token=${token}`,
  );
};
