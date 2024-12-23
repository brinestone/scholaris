import { ToastMessageOptions } from "primeng/api";

export function errorToToast(err: Error, key?: string, severity = 'error',) {
    return {
        summary: 'Error',
        detail: err.message,
        severity,
        key
    } as ToastMessageOptions;
}
