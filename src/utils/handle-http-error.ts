import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

export function handleErrorResponse<T>(err: HttpErrorResponse, _: Observable<T>) {
    if (err.error) {
        return throwError(() => err.error as Error);
    }
    return throwError(() => err);
}
