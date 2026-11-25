import{fetchApi} from './config';

export const loginUser = async(credential)=>{
    return await fetchApi('api/auth/login',{
        method:'POST',
        body:JSON.stringify(credential)
    });

};

export const registerUser = async (userData) => {
    return await fetchApi('api/auth/register',{
        method:'POST',
        body: JSON.stringify(userData)
    });
};