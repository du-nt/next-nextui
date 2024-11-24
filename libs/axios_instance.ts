import useBoundStore from "@/stores";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const apiDomain = "/api";

let refreshTokenRequest: null | Promise<void> = null;

const defaultHeaders = {
  "Content-Type": "application/json",
};

const axiosInstance = axios.create({
  baseURL: apiDomain,
  headers: defaultHeaders,
  withCredentials: true,
});

const refresh = async () => {
  try {
    const response = await axios.post(`${apiDomain}token/refresh`);

    return response.data.data.accessToken;
  } catch (error) {
    refreshTokenRequest = null;

    useBoundStore.getState().unAuthenticate();

    return Promise.reject(error);
  }
};

const onRequest = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  config.headers.set("Authorization", `Bearer `);

  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> =>
  Promise.reject(error);

const onResponse = (response: AxiosResponse): AxiosResponse => response.data;

const onResponseError = async (
  error: AxiosError
): Promise<AxiosResponse | AxiosError> => {
  if (error.response?.status === 401) {
    refreshTokenRequest = refreshTokenRequest || refresh();

    const newAccessToken = await refreshTokenRequest;

    const axiosConfig = {
      ...error.config,
      headers: {
        ...error.config?.headers,
        authorization: `Bearer ${newAccessToken}`,
      },
    };

    refreshTokenRequest = null;

    return axiosInstance(axiosConfig);
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(onRequest, onRequestError);
axiosInstance.interceptors.response.use(onResponse, onResponseError);

export default axiosInstance;
