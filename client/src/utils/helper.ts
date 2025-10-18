import { toast } from "react-toastify";

export const notifySuccess = (message) => {
    toast.success(message);
};

// Toast Function for error
export const notifyError = (message) => {
    toast.error(message);
};