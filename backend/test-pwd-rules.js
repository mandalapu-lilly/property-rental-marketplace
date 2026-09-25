const isStrongPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
};

const tests = [
  { pwd: 'HavenStay@2026', expected: true },
  { pwd: 'password', expected: false },
  { pwd: 'password123', expected: false },
  { pwd: 'Password', expected: false },
  { pwd: '12345678', expected: false },
  { pwd: 'Havenstay2026', expected: false },
  { pwd: 'HAVENSTAY@2026', expected: false },
  { pwd: 'havenstay@2026', expected: false },
  { pwd: 'HavenStay@abc', expected: false },
];

let allPassed = true;
tests.forEach(({ pwd, expected }) => {
  const result = isStrongPassword(pwd);
  const passed = result === expected;
  if (!passed) allPassed = false;
  console.log(`${passed ? '✓' : '✗'} isStrongPassword("${pwd}") = ${result} (expected ${expected})`);
});

if (allPassed) {
  console.log('\nAll password security test cases passed successfully!');
} else {
  console.error('\nSome password security test cases failed.');
  process.exit(1);
}
