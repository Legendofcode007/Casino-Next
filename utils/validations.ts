

export const isEmail = (s: unknown) => typeof s === 'string' &&  s.includes("@");

export const isStringNumber = (s: unknown) => typeof s === 'string' && /^[0-9]+/.test(s);

