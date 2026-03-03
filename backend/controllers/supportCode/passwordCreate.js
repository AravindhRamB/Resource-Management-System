/**
 * ==========================================================
 * File        : passwordCreate.js
 * Author      : Aravindh Ram
 * Created On  : 
 * Description : Controller to handle employee password creation
 * ==========================================================
 */
function generatePassword(length = 8) {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

    // Combine all characters
    const allChars = upperCase + lowerCase + numbers + symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }

    return password;
}

module.exports={
    generatePassword
}
