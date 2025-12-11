import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { DocType } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DocTypeService {
  private readonly baseUrl = 'http://localhost:3000';
  private docTypesSubject = new BehaviorSubject<DocType[]>([]);
  
  readonly docTypes$ = this.docTypesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadDocTypes();
  }

  private loadDocTypes(): void {
    this.http.get<any>(`${this.baseUrl}/doctypes`, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        const docTypes = response.data || [];
        this.docTypesSubject.next(docTypes);
      },
      error: (error) => {
        console.error('Error cargando tipos de documento:', error);
      }
    });
  }

  getDocTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/doctypes`, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        const docTypes = response.data || [];
        this.docTypesSubject.next(docTypes);
      })
    );
  }

  getDocTypeLength(docTypeId: number): number {
    const docTypes = this.docTypesSubject.value;
    const docType = docTypes.find(dt => dt.id === docTypeId);
    return docType?.length || 0;
  }
}
