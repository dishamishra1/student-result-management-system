const getGrade = (marks) => {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  if (marks >= 40) return "D";
  return "F";
};

const getStatus = (percentage) => {
  if (percentage >= 85) return "Excellent";
  if (percentage >= 70) return "Strong";
  if (percentage >= 55) return "Average";
  if (percentage >= 40) return "Needs Improvement";
  return "At Risk";
};

const getTip = (subject, marks) => {
  if (marks < 40) return `Revise basics of ${subject} and solve PYQs.`;
  if (marks < 60) return `Practice more questions in ${subject}.`;
  if (marks < 80) return `Good score. Revise weak units in ${subject}.`;
  return `Excellent in ${subject}. Maintain consistency.`;
};

module.exports = { getGrade, getStatus, getTip };
