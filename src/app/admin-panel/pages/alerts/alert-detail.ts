import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null;

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule, CardModule],
  templateUrl: './alert-detail.html',
  styleUrl: './alert-detail.scss',
})
export class AlertDetail {
  alert = {
    id: 'ALT-1990',
    title: 'Gato gris desaparecido hace 3 días',
    type: 'Desaparición',
    status: 'Pendiente',
    zone: 'Guayaquil · Sur',
    reporter: 'Luis Torres',
    createdAt: 'Ayer 18:12',
    description: 'Se reporta desaparición de gato gris de 3 años. Último avistamiento en calle principal hace 2 días. Lleva collar azul con campana.',
  };

  history = [
    { label: 'Reporte recibido y clasificado', when: 'Ayer 18:12', actor: 'Sistema' },
    { label: 'Moderador asignado: Ana Silva', when: 'Hoy 08:05', actor: 'Coordinación' },
    { label: 'En revisión: solicitando evidencia adicional', when: 'Hoy 09:20', actor: 'Ana Silva' },
  ];

  private readonly tagSeverityMap: Record<string, TagSeverity> = {
    Pendiente: 'warn',
    'En revisión': 'info',
    Aprobada: 'success',
    Rechazada: 'danger',
    Resuelta: 'success',
  };

  statusSeverity(status: string): TagSeverity {
    return this.tagSeverityMap[status] ?? 'info';
  }

  approve() {
    this.alert.status = 'Aprobada';
  }

  reject() {
    this.alert.status = 'Rechazada';
  }

  resolve() {
    this.alert.status = 'Resuelta';
  }
}
