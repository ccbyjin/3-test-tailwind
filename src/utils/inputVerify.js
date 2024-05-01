function inputVerify(userData) {
  const result = [];

  for (let key in userData) {
    if ((!userData[key] || userData[key] === '') && key !== 'remark') {
      result.push(key);
    }
  }

  return result;
}

export { inputVerify };
