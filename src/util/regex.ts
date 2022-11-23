export const execObjectByString = (REG: RegExp, str: string) => {
  const obj: Record<string, string> = {};

  let matched;
  while ((matched = REG.exec(str)) !== null) {
    obj[matched[1]] = matched[2];
  }

  return obj;
};
