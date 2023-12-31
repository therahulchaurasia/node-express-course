const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
  return token
}

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ payload, response }) => {
  const oneDay = 1000 * 60 * 60 * 24
  const token = createJWT({ payload })
  response.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
  return token
}

module.exports = { createJWT, isTokenValid, attachCookiesToResponse }
