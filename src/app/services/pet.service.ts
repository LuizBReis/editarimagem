import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Pet {
  id: number;
  nome: string;
  idade: number;
  tipo: string;
  raca: string;
  porte: string;
  castrado: boolean;
  donoId: number;
  paraAdocao: boolean;
  imagens: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = 'http://localhost:3000/pets';  // URL da API

  constructor(private http: HttpClient) {}

  // Método para cadastrar um novo pet
  cadastrarPet(petData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, petData); // Faz a requisição POST com os dados do pet
  }
  
  // Método para obter um pet pelo ID
  getPet(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }

  // Método para atualizar os dados do pet
  updatePet(id: number, pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/${id}`, pet);
  }

  // Método para excluir um pet
  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método para fazer upload de múltiplas imagens para um pet específico
  uploadImages(id: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('imagens', file)); // A chave 'imagens' deve corresponder ao esperado no backend
    return this.http.post<any>(`${this.apiUrl}/${id}/uploadImages`, formData); // Endpoint para upload múltiplo de imagens
  }

  // Método para obter todos os pets para adoção
  getPetsParaAdocao(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/adocao`); // Faz a requisição GET para listar pets disponíveis para adoção
  }
}
