import axios from "axios";

const instance = axios.create({
  baseURL: "https://mu-sync.herokuapp.com/",
});

export default instance;
