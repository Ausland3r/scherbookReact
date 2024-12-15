import axios from "axios";

const API_BASE = "https://scherbook.onrender.com/api";

// Настройка axios
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 5000, // Тайм-аут 5 секунд
  headers: {
    "Content-Type": "application/json",
  },
});

// Перехватчик для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `API Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`
      );
    } else if (error.request) {
      console.error("No response received from API", error.message);
    } else {
      console.error("Unexpected error", error.message);
    }
    return Promise.reject(error);
  }
);

// Функция для повторных попыток запроса
const retryRequest = async (requestFn, maxRetries = 3) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      attempts++;
      if (attempts >= maxRetries) {
        throw error;
      }
    }
  }
};

// Авторизация
export const login = async (email, password) => {
  return retryRequest(() =>
    apiClient.post(`/auth/login`, { email, password }).then((response) => response.data)
  );
};

export const register = async (email, username, password, role = "user") => {
  return retryRequest(() =>
    apiClient.post(`/auth/register`, { email, username, password, role }).then((response) => response.data)
  );
};

// Пользователи
export const getUserById = async (id) => {
  return retryRequest(() =>
    apiClient.get(`/users/${id}`).then((response) => response.data)
  );
};

export const updateUser = async (id, updates) => {
  return retryRequest(() =>
    apiClient.put(`/users/${id}`, updates).then((response) => response.data)
  );
};

// Жанры
export const getGenres = async () => {
  return retryRequest(() =>
    apiClient.get(`/genres`).then((response) => response.data)
  );
};

// Работа с книгами
export const getBooks = async () => {
  return retryRequest(() =>
    apiClient.get(`/books`).then((response) => response.data)
  );
};

export const addBook = async (book) => {
  return retryRequest(() =>
    apiClient.post(`/books`, book).then((response) => response.data)
  );
};

export const getBookById = async (id) => {
  return retryRequest(() =>
    apiClient.get(`/books/${id}`).then((response) => response.data)
  );
};

export const deleteBook = async (id) => {
  return retryRequest(() =>
    apiClient.delete(`/books/${id}`).then((response) => response.data)
  );
};

// Работа с обменами
export const createExchange = async (exchange) => {
  return retryRequest(() =>
    apiClient.post(`/exchange`, exchange).then((response) => response.data)
  );
};

export const getExchangeById = async (id) => {
  return retryRequest(() =>
    apiClient.get(`/exchange/${id}`).then((response) => response.data)
  );
};

export const updateExchange = async (id, updates) => {
  return retryRequest(() =>
    apiClient.put(`/exchange/${id}`, updates).then((response) => response.data)
  );
};

export const getExchangesByUserId = async (id) => {
  return retryRequest(() =>
    apiClient.get(`/exchanges/${id}`).then((response) => response.data)
  );
};

export const getAllExchanges = async () => {
  return retryRequest(() =>
    apiClient.get(`/exchanges`).then((response) => response.data)
  );
};

export const deleteExchange = async (id) => {
  return retryRequest(() =>
    apiClient.delete(`/exchange/${id}`).then((response) => response.data)
  );
};
