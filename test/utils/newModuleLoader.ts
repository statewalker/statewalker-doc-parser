export function newModuleLoader(
  match: (path: string) => boolean = (filePath) =>
    !!filePath.match(/\.{js|ts}$/)
) {
  return async (filePath: string): Promise<Record<string, any> | undefined> => {
    try {
      if (!match(filePath)) return;
      return await import(filePath);
    } catch (err) {
      return undefined;
    }
  };
}
