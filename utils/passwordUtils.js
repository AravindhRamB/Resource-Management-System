function generatePassword() {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$&'; // allowed special chars only
  const allChars = upperCase + lowerCase + numbers + specialChars;

  while (true) {
    // Generate 8 random characters
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Ensure it contains at least one of each required type
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$&]/.test(password);

    if (hasUpper && hasNumber && hasSpecial) {
      return password;
    }
  }
}

module.exports = generatePassword;