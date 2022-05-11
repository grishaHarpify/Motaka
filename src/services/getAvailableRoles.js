
function getUserAvailableRoles(user) {
  const availableRoles = []

  if (user.role.isUser) {
    availableRoles.push('user')
  }

  if (user.role.isProvider) {
    availableRoles.push('provider')
  }

  return availableRoles
}

module.exports = getUserAvailableRoles
