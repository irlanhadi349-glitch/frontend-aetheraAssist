import { fetchApi } from './config';

export const ambilLayanan = async () => {
  return await fetchApi('api/layanan', {
    method: 'GET',
  });
};

export const ambilDetailLayanan = async (id) => {
  return await fetchApi(`api/layanan/${id}`);
};

export const tambahLayanan = async (dataLayanan) => {
  return await fetchApi('api/layanan', {
    method: 'POST',
    body: JSON.stringify(dataLayanan),
  });
};

export const editLayanan = async (id, dataEditLayanan) => {
  return await fetchApi(`api/layanan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dataEditLayanan),
  });
};

export const hapusLayanan = async (id) => {
  return await fetchApi(`api/layanan/${id}`, {
    method: 'DELETE',
  });
};