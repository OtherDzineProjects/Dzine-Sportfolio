import { STORAGE_KEYS } from "common/constants";
export async function http(
  endpoint,
  { body, method, contentType = "application/json", ...customConfig } = {}
) {
  const apiUrl = `${import.meta.env.VITE_API_URL}${endpoint}`;

  const myHeaders = new Headers();

  if (contentType !== "application/json") {
    myHeaders.delete("Content-Type");
  } else {
    myHeaders.append("Content-Type", contentType);
  }

  if (localStorage.getItem(STORAGE_KEYS.TOKEN)) {
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem(STORAGE_KEYS.TOKEN)}`
    );
  }

  const config = {
    method: method,
    headers: myHeaders,
    ...customConfig,
    redirect: "follow"
  };

  if (body) {
    config.body =
      contentType === "application/json" ? JSON.stringify(body) : body;
  }

  let data;
  try {
    const response = await window.fetch(apiUrl, config);
    data = await response.json();
    if (response.ok) {
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url
      };
    }
    if (response?.status === 401) {
      localStorage.clear();
      window.location.href = "/auth/signin";
      return Promise.reject("Token expired");
    }
    throw new Error(response.statusText);
  } catch (err) {
    return Promise.reject(data.errMsg ? data.errMsg : err.message);
  }
}

http.get = function (endpoint, customConfig = {}) {
  return http(endpoint, { ...customConfig, method: "GET" });
};

http.post = function (
  endpoint,
  body,
  contentType = "application/json",
  customConfig = {}
) {
  return http(endpoint, { ...customConfig, body, contentType, method: "POST" });
};

http.put = function (
  endpoint,
  body,
  contentType = "application/json",
  customConfig = {}
) {
  return http(endpoint, { ...customConfig, body, contentType, method: "PUT" });
};

http.delete = function (endpoint, body, customConfig = {}) {
  return http(endpoint, { ...customConfig, body, method: "DELETE" });
};
