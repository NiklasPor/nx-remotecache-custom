export function createFilterMachineId(hash: string) {
  return function filterMachineId(path: string) {
    return !path.endsWith(`${hash}/source`);
  };
}
