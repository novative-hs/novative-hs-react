export default function authHeader() {
  const obj = JSON.parse(localStorage.getItem("authUser"));

  console.log("Object: ", obj);

  if (obj && obj.token) {
    return obj.token;
  } else {
    return {};
  }
}
