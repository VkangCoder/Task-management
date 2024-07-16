function capitalizeEachWord(string) {
  return string
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

module.exports = { capitalizeEachWord };
