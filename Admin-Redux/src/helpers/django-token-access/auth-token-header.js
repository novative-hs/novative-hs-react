export default function authHeader() {
  const obj = JSON.parse(localStorage.getItem("authUser"));

  if (obj && obj.token) {
    console.log("User: ", obj);
    console.log("User: ", obj.token);
    return obj.token;
  } else {
    return "";
  }
}
