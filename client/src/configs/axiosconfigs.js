import axios from "axios";

const instance = axios.create({
  baseURL: "https://mu-sync.herokuapp.com/" || "http://localhost:5000/",
});

export default instance;
