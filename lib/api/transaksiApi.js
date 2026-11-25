import { fetchApi } from './config';

export const getTransaksi = async () => {
    return await fetchApi('api/transaksi', {
        method: 'GET',
    });
};
export const getTransaksiById = async () => {
    return await fetchApi('api/transaksi/saya', {
        method: 'GET',
    });
};


export const buatTransaksi = async (dataTransaksi) => {
    return await fetchApi('api/transaksi', {
        method: 'POST',
        body: JSON.stringify(dataTransaksi),
    });
};

export const updateStatusTransaksi = async (id, statusBayar) => {
    const payload = typeof statusBayar === "boolean" ? { statusBayar } : statusBayar;
    return await fetchApi(`api/transaksi/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
};

export const deleteTransaksi = async (id) => {
    return await fetchApi(`api/transaksi/${id}`, {
        method: 'DELETE',
  
    });
};
