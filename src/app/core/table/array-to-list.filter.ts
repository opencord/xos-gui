export function ArrayToListFilter() {
  return (input: any) => {
    if (!angular.isArray(input)) {
      return input;
    }
    return input.join(', ');
  };
}
