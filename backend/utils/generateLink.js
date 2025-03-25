const generateLink = (sessionId) => {
  const baseURL = process.env.BASE_URL || "http://localhost:5000";
  return `${baseURL}/session/${sessionId}`;
};

export default generateLink;
