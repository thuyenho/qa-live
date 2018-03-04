import axios from 'axios';

// Send http requests with sessionID
axios.defaults.withCredentials = true;

const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT_URL;
const requestWithHeader = async (method, url, data = null) => {
  const token = null; // TODO  get access token from local storeage in case of using JWT
  const headers = token ? {
    Authorization: `Bearer ${token}`,
  } : {};

  const fullUrl = API_BASE_URL + url;
  const request = ['get', 'delete'].includes(method) ?
    axios[method](fullUrl, { headers }) :
    axios[method](fullUrl, data, { headers });

  return request;
};

const client = () => {
  const request = {};
  const methods = ['get', 'post', 'put', 'delete'];

  methods.forEach((method) => {
    request[method] = (url, data) => requestWithHeader(method, url, data);
  });

  return request;
};

export default client();
