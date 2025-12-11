import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { PetService } from '../../../../../core/services/pet.service';

@Component({
  selector: 'app-test-pet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CardModule
  ],
  template: `
    <p-card class="w-full max-w-2xl mx-auto mt-5">
      <h2>🧪 Prueba de Crear Mascota</h2>
      
      <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-column gap-3 mt-4">
        <div>
          <label>Nombre *</label>
          <input pInputText formControlName="name" placeholder="Ej: Max" class="w-full" />
        </div>

        <div>
          <label>Edad (años) *</label>
          <input pInputNumber formControlName="age" placeholder="Ej: 5" class="w-full" />
        </div>

        <div>
          <label>ID Especie (1=Perro, 2=Gato, 3=Ave) *</label>
          <input pInputNumber formControlName="speciesId" placeholder="1" class="w-full" />
        </div>

        <div>
          <label>ID Raza (1=Labrador, 2=Bulldog, 3=Persa, 4=Siamés) *</label>
          <input pInputNumber formControlName="breedId" placeholder="1" class="w-full" />
        </div>

        <button pButton type="submit" label="Crear Mascota" [disabled]="form.invalid || loading"></button>
      </form>

      <div class="mt-4 p-3 bg-gray-100 border-radius rounded">
        <h4>📝 Logs:</h4>
        <pre class="text-xs overflow-auto max-h-96">{{ logs }}</pre>
      </div>
    </p-card>

    <p-toast position="top-center"></p-toast>
  `,
  styles: [`
    :host ::ng-deep .p-card {
      max-width: 600px;
    }
  `],
  providers: [MessageService]
})
export class TestPetComponent {
  private petService = inject(PetService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  form: FormGroup;
  loading = false;
  logs = 'Esperando entrada...\n';

  constructor() {
    this.form = this.fb.group({
      name: ['Max', [Validators.required]],
      age: [5, [Validators.required, Validators.min(0)]],
      speciesId: [1, [Validators.required]],
      breedId: [1, [Validators.required]]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const data = this.form.value;
    
    this.addLog('='.repeat(50));
    this.addLog('🚀 Enviando datos:');
    this.addLog(JSON.stringify(data, null, 2));
    this.addLog('='.repeat(50));

    this.petService.createUserPet(data).subscribe({
      next: (response) => {
        this.addLog('✅ ÉXITO - Respuesta del servidor:');
        this.addLog(JSON.stringify(response, null, 2));
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Mascota creada correctamente',
          life: 3000
        });

        this.loading = false;
      },
      error: (err) => {
        this.addLog('❌ ERROR - Detalles:');
        this.addLog('Status: ' + err.status);
        this.addLog('Message: ' + err.message);
        this.addLog('Error Body:');
        this.addLog(JSON.stringify(err.error, null, 2));
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || err.message || 'Error desconocido',
          life: 5000
        });

        this.loading = false;
      }
    });
  }

  private addLog(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.logs += `[${timestamp}] ${message}\n`;
    console.log(message);
  }
}
