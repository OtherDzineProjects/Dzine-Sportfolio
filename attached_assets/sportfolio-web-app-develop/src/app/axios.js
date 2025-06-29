import axios from 'axios';
import queryString from 'query-string';

export const getRequest = (URL, payload) => {
  const { data: query = {}, config = {}, baseURL } = payload;
  return axios.get(queryString.stringifyUrl({ url: `${baseURL}/${URL}`, query }), config).then((response) => response).catch((error) => ({ error }));
};

export const putRequest = (URL, payload) => {
  const { data = {}, config = {}, baseURL } = payload;
  return axios.put(`${baseURL}/${URL}`, data, config).then((response) => response).catch((error) => ({ error }));
};

export const postRequest = (URL, payload) => {
  const { data = {}, config = {}, baseURL } = payload;
  return axios.post(`${baseURL}/${URL}`, data, config).then((response) => response).catch((error) => ({ error }));
};

export const patchRequest = (URL, payload) => {
  const { data = {}, config = {}, baseURL } = payload;
  return axios.patch(`${baseURL}/${URL}`, data, config).then((response) => response).catch((error) => ({ error }));
};

export const deleteRequest = (URL, payload) => {
  const { data: query = {}, config = {}, baseURL } = payload;
  return axios.delete(queryString.stringifyUrl({ url: `${baseURL}/${URL}`, query }), config).then((response) => response).catch((error) => ({ error }));
};
