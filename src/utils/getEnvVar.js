export const getEnvVar = (key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return process.env[key];
};
