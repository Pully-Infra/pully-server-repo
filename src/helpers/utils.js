const isJsonString = (str) => {
  if (str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }

  return true;
};

module.exports = {
  isJsonString,
};
