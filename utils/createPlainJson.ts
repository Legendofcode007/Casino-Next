
export const createPlainJson = (obj:any) => {
  return JSON.parse(JSON.stringify(obj));
}