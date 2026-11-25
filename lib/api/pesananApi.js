import { fetchApi } from "./config";

export const buatPesanan = async (data) => {
  return await fetchApi("api/pesanan", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getPesananSaya = async () => {
  return await fetchApi("api/pesanan/saya");
};

export const getPesanan = async () => {
  return await fetchApi("api/pesanan");
};


export const updatePesanan = async(id,status)=>{
  return await fetchApi( `api/pesanan/${id}/status`,{
    method: "PUT",
    body: JSON.stringify(status),
  })
}
export const deletePesanan = async(id)=>{
  return await fetchApi( `api/pesanan/${id}`,{
    method: "DELETE",
    
  })
}
