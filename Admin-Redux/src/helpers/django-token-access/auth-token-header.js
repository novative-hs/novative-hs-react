export default function authHeader() {
  const obj = JSON.parse(localStorage.getItem("authUser"));

  if (obj && obj.token) {
    return obj.token;
  } else {
    return {};
  }
}
