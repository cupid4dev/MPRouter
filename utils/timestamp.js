const ts2LWDDLMYYYY = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

const ts2DateOptions = (timestamp) => {
  const date = new Date(timestamp * 1000);
  // Format date
  const dateOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  return formattedDate;
}

module.exports = {
  ts2LWDDLMYYYY,
  ts2DateOptions,
}