import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardApi = {
  getLastStudySession: () => api.get('/dashboard/last_study_session'),
  getStudyProgress: () => api.get('/dashboard/study_progress'),
  getQuickStats: () => api.get('/dashboard/quick-stats'),
};

export const studyActivitiesApi = {
  getAll: () => api.get('/study_activities'),
  getById: (id: string) => api.get(`/study_activities/${id}`),
  getStudySessions: (id: string) => api.get(`/study_activities/${id}/study_sessions`),
  create: (data: any) => api.post('/study_activities', data),
};

export const wordsApi = {
  getAll: (page: number = 1) => api.get(`/words?page=${page}`),
  getById: (id: string) => api.get(`/words/${id}`),
};

export const groupsApi = {
  getAll: (page: number = 1) => api.get(`/groups?page=${page}`),
  getById: (id: string) => api.get(`/groups/${id}`),
  getWords: (id: string, page: number = 1) => api.get(`/groups/${id}/words?page=${page}`),
  getStudySessions: (id: string, page: number = 1) => api.get(`/groups/${id}/study_sessions?page=${page}`),
};

export const studySessionsApi = {
  getAll: (page: number = 1) => api.get(`/study_sessions?page=${page}`),
  getById: (id: string) => api.get(`/study_sessions/${id}`),
  getWords: (id: string, page: number = 1) => api.get(`/study_sessions/${id}/words?page=${page}`),
};

export const settingsApi = {
  resetHistory: () => api.post('/reset_history'),
  fullReset: () => api.post('/full_reset'),
};

export default api;
