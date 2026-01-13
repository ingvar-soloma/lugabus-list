import bcrypt from 'bcrypt';

const saltRounds = 10;
const password = 'adminpassword'; // Replace with a strong password

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash);
  }
});
