import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export function handleErrorResponse(err: HttpErrorResponse) {
    if (err.error) {
        return throwError(() => err.error as Error);
    }
    return throwError(() => err);
}
