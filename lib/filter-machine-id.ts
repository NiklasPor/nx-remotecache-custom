export function filterMachineId(path: string) {
  return !path.endsWith('/source');
}
