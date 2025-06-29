export const serialNumber = (row, page) => {
  const { rowIndex = 0 } = row;
  return rowIndex + 1 + (Number(`${page}0`));
};
