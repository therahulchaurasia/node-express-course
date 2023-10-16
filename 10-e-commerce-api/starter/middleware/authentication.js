const CustomError = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
  //* use req.signedCookies to access cookies that were signed during creation otherwise use req.cookies()

  const token = req.signedCookies.token
  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication invalid')
  }
  try {
    const { name, userId, role } = isTokenValid({ token })

    req.user = {
      name,
      userId,
      role,
    }
    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication invalid')
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized user to access this route'
      )
    }
    next()
  }
}

module.exports = { authenticateUser, authorizePermissions }
