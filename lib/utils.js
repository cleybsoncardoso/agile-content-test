const formatDate = (date) => {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const formatTime = (date) => {
  const hour = ("0" + date.getHours()).slice(-2);
  const minute = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${hour}:${minute}:${seconds}`;
};

const parseCamel = (s) => s.replace(/-\w/g, (l) => l[1].toUpperCase());

module.exports = {
  formatDate,
  formatTime,
  parseCamel,
};
