import { ToastMessageOptions } from "primeng/api";

export function errorToToast(err: Error, key?: string, severity = 'danger',) {
    return {
        summary: 'Error',
        detail: err.message,
        severity,
        key
    } as ToastMessageOptions;
}
