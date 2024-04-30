const { json } = require("express")
const axios = require("axios");

const AxiosEIP = axios.create({
  baseURL: '/',
  timeout: 1500,
  header: {
    "Content-Type": "application/json; charset=utf-8",
    pragma: "no-cache",
    "cache-control": "no-cache",
  },
});

const APIeips = {
  getParams(url, json) {
    return AxiosEIP.get(routeDispatch(url), { params: json });
  },
  getSlugParams(url, slug, json) {
    return AxiosEIP.get(`${routeDispatch(url)}/${slug}`, { params: json });
  },
  postBody(url, data) {
    return AxiosEIP.post(routeDispatch(url), data);
  },
  postParams(url, json) {
    return AxiosEIP.post(routeDispatch(url), null, { params: json });
  }
}

export { APIeips };