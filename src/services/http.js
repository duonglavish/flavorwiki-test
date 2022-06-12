import axios from "axios";
export default axios.create({
  baseURL: "https://62a1f81ccc8c0118ef5a2727.mockapi.io/api",
  headers: {
    "Content-type": "application/json"
  }
});