import { Component, OnInit } from '@angular/core';
import { PetService } from '../../services/pet.service';
import { AccesoService } from '../../services/acceso.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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

@Component({
  selector: 'app-editar-pet',
  templateUrl: './editar-pet.component.html',
  styleUrls: ['./editar-pet.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, FormsModule, ReactiveFormsModule]
})
export class EditarPetComponent implements OnInit {
  pet: Pet = {
    id: 0,
    nome: '',
    idade: 0,
    tipo: '',
    raca: '',
    porte: '',
    castrado: false,
    donoId: 0,
    paraAdocao: false,
    imagens: []
  };
  isEditMode = false;
  petId: number | null = null;
  novasImagens: File[] = [];  // Armazena novas imagens selecionadas para upload

  constructor(
    private petService: PetService,
    private accesoService: AccesoService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.petId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.petId) {
      this.loadPetData();
    } else {
      console.error('ID do Pet é null.');
    }
  }

  loadPetData() {
    if (this.petId !== null) {
      this.petService.getPet(this.petId).subscribe(
        (data: Pet) => {
          this.pet = data;
          console.log('Pet carregado:', this.pet);
        },
        (error) => {
          console.error('Erro ao carregar dados do pet:', error);
        }
      );
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges() {
    if (this.petId !== null) {
      this.petService.updatePet(this.petId, this.pet).subscribe(
        (response) => {
          console.log('Dados do pet atualizados com sucesso!');
          this.toggleEditMode();
          alert('Dados do pet atualizados com sucesso!');
          this.router.navigate(['/inicio']);
        },
        (error) => {
          console.error('Erro ao atualizar dados do pet:', error);
        }
      );
    }
  }

  cancelEdit() {
    this.toggleEditMode();
    this.loadPetData();
  }

  deletePet() {
    if (this.petId !== null) {
      const confirmDelete = confirm('Tem certeza de que deseja excluir este pet?');
      if (confirmDelete) {
        this.petService.deletePet(this.petId).subscribe(
          () => {
            console.log('Pet excluído com sucesso.');
            this.router.navigate(['/inicio']);
          },
          (error) => {
            console.error('Erro ao excluir o pet:', error);
          }
        );
      }
    }
  }

  // Manipular seleção de múltiplas imagens para upload
  onImagesChange(event: any) {
    this.novasImagens = Array.from(event.target.files);
  }

  // Fazer upload das novas imagens selecionadas
  uploadImages() {
    if (this.petId !== null && this.novasImagens.length > 0) {
      this.petService.uploadImages(this.petId, this.novasImagens).subscribe(
        (response: any) => {
          if (response.imagePaths) {
            this.pet.imagens.push(...response.imagePaths);
            console.log('Imagens salvas com sucesso:', response.imagePaths);
          }
        },
        (error) => {
          console.error('Erro ao enviar imagens:', error);
        }
      );
    }
  }

  removeImage(index: number) {
    this.pet.imagens.splice(index, 1);  // Remove a imagem do array
  }
}
