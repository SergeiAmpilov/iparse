

export const mailConfigObject = {
  host: 'smtp.spaceweb.ru',
  port: 465,
  secure: true,
  auth: {
      user: 'info@iparse.tech',
      pass: process.env?.EMAIL_PASSWORD,
  },
}