function decode(encoded) {
  let tokens = encoded.split(".");
  return JSON.parse(atob(tokens[1]));
}

export default decode;