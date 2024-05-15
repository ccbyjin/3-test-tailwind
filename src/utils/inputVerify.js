function inputVerify(userData) {
  const result = [];

  for (let key in userData) {
    userData[key] = userData[key].trim();
    if ((!userData[key] || userData[key] === '') && key !== 'remark') {
      result.push(key);
    }
  }

  return result;
}

export { inputVerify };
