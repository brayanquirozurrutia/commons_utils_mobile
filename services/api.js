import AxiosConfig from "../axiosConfig";
import {handleAxiosError} from "./error";

export const uploadImage = async (imageUri) => {
    const formData = new FormData();

    formData.append('file', {
        uri: imageUri,
        type: 'image/webp', // Cambiado a 'image/webp' si el tipo MIME es 'webp'
        name: 'photo.webp'
    });

    try {
        const response = await AxiosConfig.post(
            '/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};
