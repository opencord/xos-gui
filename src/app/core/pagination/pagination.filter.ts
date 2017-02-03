export function PaginationFilter() {
  return function(input: any[], start: string) {
    if (!input || !angular.isArray(input)) {
      return input;
    }
    let position: number = parseInt(start, 10);
    return input.slice(position);
  };
}
