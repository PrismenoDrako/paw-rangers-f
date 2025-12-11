import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    // GET
    get<T>(endpoint: string, params?: any, headers?: HttpHeaders): Observable<T> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
            params: httpParams,
            headers,
            withCredentials: true   // 👈 MUY IMPORTANTE
        });
    }

    // POST
    post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, {
            headers,
            withCredentials: true     // 👈 Necesario para login y todo lo demás
        });
    }

    // PUT
    put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, {
            headers,
            withCredentials: true
        });
    }

    // PATCH
    patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
        return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body, {
            headers,
            withCredentials: true
        });
    }

    // DELETE
    delete<T>(endpoint: string, params?: any, headers?: HttpHeaders): Observable<T> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }
        return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
            params: httpParams,
            headers,
            withCredentials: true
        });
    }

}
