// export const DEPT_MAP = {
//   '66': 'AIML',
//   '24': 'AE',
//   '01': 'Civil',
//   '32': 'CSBS',
//   '05': 'CSE',
//   '12': 'IT',
//   '62': 'Cyber Security',
//   '67': 'CSE-DS',
//   '04': 'ECE',
//   '02': 'EEE',
//   '10': 'EIE',
//   '69': 'IoT',
//   '03': 'ME',
// }

// // Expected email pattern: 2XXXXAYYnn@gmail.com
// export function getDeptCodeFromEmail(email) {
//   if (!email) return null
//   const m = String(email).match(/2\d{4}A(\d{2})\d{2}@/i)
//   return m ? m[1] : null
// }

// export function getDeptFromEmail(email) {
//   const code = getDeptCodeFromEmail(email)
//   return code && DEPT_MAP[code] ? { code, name: DEPT_MAP[code] } : { code: null, name: null }
// }
export const DEPT_MAP = {
  '66': 'AIML',
  '24': 'AE',
  '01': 'Civil',
  '32': 'CSBS',
  '05': 'CSE',
  '12': 'IT',
  '62': 'Cyber Security',
  '67': 'CSE-DS',
  '04': 'ECE',
  '02': 'EEE',
  '10': 'EIE',
  '69': 'IoT',
  '03': 'ME',
}

export function getDeptCodeFromEmail(email) {
  if (!email) return null
  const m = String(email).match(/2\d{4}A(\d{2})\d{2}@/i)
  return m ? m[1] : null
}

export function getDeptFromEmail(email) {
  const code = getDeptCodeFromEmail(email)
  return code && DEPT_MAP[code] ? { code, name: DEPT_MAP[code] } : { code: null, name: null }
}

export function getDeptCodeFromRoll(roll) {
  if (!roll) return null
  const m = String(roll).match(/2\d{4}A(\d{2})\d{2}/i)
  return m ? m[1] : null
}
