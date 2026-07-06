import toast from 'react-hot-toast';

// Custom toast configurations
const toastConfig = {
    success: {
        duration: 3000,
        style: {
            background: '#1A1A1A',
            color: '#F5F5F5',
            border: '1px solid rgba(212, 175, 55, 0.3)',
        },
        iconTheme: {
            primary: '#D4AF37',
            secondary: '#1A1A1A',
        },
    },
    error: {
        duration: 4000,
        style: {
            background: '#1A1A1A',
            color: '#F5F5F5',
            border: '1px solid rgba(239, 68, 68, 0.3)',
        },
        iconTheme: {
            primary: '#ef4444',
            secondary: '#1A1A1A',
        },
    },
    loading: {
        style: {
            background: '#1A1A1A',
            color: '#F5F5F5',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        },
    },
};

export const useToast = () => {
    const showSuccess = (message) => {
        toast.success(message, toastConfig.success);
    };

    const showError = (message) => {
        toast.error(message, toastConfig.error);
    };

    const showLoading = (message) => {
        return toast.loading(message, toastConfig.loading);
    };

    const dismiss = (toastId) => {
        toast.dismiss(toastId);
    };

    const promise = (promiseFn, messages) => {
        return toast.promise(
            promiseFn,
            {
                loading: messages.loading || 'Chargement...',
                success: messages.success || 'Succès !',
                error: messages.error || 'Une erreur est survenue',
            },
            {
                success: toastConfig.success,
                error: toastConfig.error,
                loading: toastConfig.loading,
            }
        );
    };

    return {
        success: showSuccess,
        error: showError,
        loading: showLoading,
        dismiss,
        promise,
    };
};
