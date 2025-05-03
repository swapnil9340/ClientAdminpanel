const bcrypt = require('bcrypt');

const plainPassword = '123456';
const storedHash = '$2b$10$ytHAhKziWJK6jTFUOfggKOSbuNSGrEiEHfQLXZ3JbzhEpIO7zxtHe';

bcrypt.compare(plainPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password match:', result);
  }
});
