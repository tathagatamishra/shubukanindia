const key = (role) => `exam-code-flow:${role}`;

export function saveExamCodeFlow(role, email, type) {
  sessionStorage.setItem(key(role), JSON.stringify({ email, type }));
}

export function readExamCodeFlow(role) {
  try { return JSON.parse(sessionStorage.getItem(key(role))); } catch { return null; }
}

export function clearExamCodeFlow(role) {
  sessionStorage.removeItem(key(role));
}
