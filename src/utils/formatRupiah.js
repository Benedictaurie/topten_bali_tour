export const formatRupiah = (value) => {
  if (!value) return "Rp. 0";
  return "Rp. " + value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const onlyNumber = (value) => {
  return value.replace(/\D/g, "");
};
