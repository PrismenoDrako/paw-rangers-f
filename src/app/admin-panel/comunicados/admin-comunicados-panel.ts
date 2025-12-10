import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComunicadosService } from '../../user-app/features/notifications/services/comunicados.service';
import { NotificationItem } from '../../user-app/features/notifications/models/notification.model';

@Component({
  selector: 'app-admin-comunicados-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-comunicados-panel.html',
  styleUrls: ['./admin-comunicados-panel.scss'],
})
export class AdminComunicadosPanelComponent implements OnInit {
  form!: FormGroup;
  comunicados: NotificationItem[] = [];
  previewUrl: string | null = null;
  avatarUrl: string | null = null;
  showPreview = false;
  previewItem: NotificationItem | null = null;
  publisherName = 'PawRangers';
  minDate = '';
  editingId: string | null = null;

  categorias = [
    { label: 'Evento', value: 'evento' },
    { label: 'Producto', value: 'producto' },
    { label: 'Servicio', value: 'servicio' },
    { label: 'Ayuda social', value: 'social' },
  ];

  badges = [
    { label: 'Ninguno', value: '' },
    { label: 'Nuevo', value: 'nuevo' },
    { label: 'Importante', value: 'importante' },
  ];

  constructor(private fb: FormBuilder, private comunicadosService: ComunicadosService) {}

  ngOnInit(): void {
    this.minDate = this.getMinDateString();
    this.form = this.fb.group({
      message: ['', Validators.required],
      context: ['', Validators.required],
      category: ['evento', Validators.required],
      date: [this.minDate, Validators.required],
      image: [''],
      avatar: [''],
      targetUrl: ['', Validators.pattern(/^(https?:\/\/.+)?$/)],
      badge: [''],
      publisher: [this.publisherName, Validators.required],
    });
    this.load();
  }

  load(): void {
    this.comunicados = this.comunicadosService.list();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const createdAt = new Date(value.date).getTime();
    const now = Date.now();
    if (!createdAt || createdAt < now - 30_000) {
      alert('La fecha/hora debe ser actual o futura. No se permiten fechas pasadas.');
      return;
    }

    const publishAt = createdAt;
    const basePayload: Record<string, unknown> = {
      publishAt,
      ...(value.badge ? { badge: value.badge } : {}),
      ...(value.publisher ? { publisherName: value.publisher } : {}),
      ...(this.avatarUrl ? { avatar: this.avatarUrl } : {}),
    };

    if (this.editingId) {
      const prev = this.comunicados.find((c) => c.id === this.editingId);
      const firstPublished =
        (prev?.payload && (prev.payload['firstPublishedAt'] as number)) ||
        (prev && prev.createdAt <= now ? prev.createdAt : null);
      if (firstPublished) {
        basePayload['firstPublishedAt'] = firstPublished;
      } else if (publishAt <= now) {
        basePayload['firstPublishedAt'] = publishAt;
      }

      this.comunicadosService.update(this.editingId, {
        message: value.message,
        context: value.context,
        image: this.previewUrl ?? value.image,
        createdAt: publishAt,
        targetUrl: value.targetUrl,
        category: value.category,
        payload: {
          ...basePayload,
          updatedAt: now,
        },
      });
    } else {
      if (publishAt <= now) {
        basePayload['firstPublishedAt'] = publishAt;
      }
      this.comunicadosService.create({
        id: 'com-' + Date.now().toString(36),
        message: value.message,
        context: value.context,
        image: this.previewUrl ?? value.image,
        date: value.date,
        type: 'foro',
        category: value.category,
        read: false,
        targetUrl: value.targetUrl,
        payload: basePayload,
      });
    }

    this.form.reset({
      message: '',
      context: '',
      category: 'evento',
      date: this.minDate,
      image: '',
      avatar: '',
      targetUrl: '',
      badge: '',
      publisher: this.publisherName,
    });
    this.previewUrl = null;
    this.avatarUrl = null;
    this.showPreview = false;
    this.previewItem = null;
    this.editingId = null;
    this.load();
  }

  delete(id: string): void {
    this.comunicadosService.remove(id);
    this.load();
  }

  handleImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagen demasiado grande (máximo 5MB).');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.form.patchValue({ image: this.previewUrl });
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.previewUrl = null;
    this.form.patchValue({ image: '' });
  }

  handleAvatar(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert('Avatar demasiado grande (máximo 2MB).');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
      this.form.patchValue({ avatar: this.avatarUrl });
    };
    reader.readAsDataURL(file);
  }

  clearAvatar(): void {
    this.avatarUrl = null;
    this.form.patchValue({ avatar: '' });
  }

  openPreview(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    const createdAt = new Date(value.date ?? new Date()).getTime();
    this.previewItem = {
      id: 'preview',
      message: value.message,
      context: value.context,
      image: this.previewUrl ?? value.image,
      timestamp: 'Vista previa',
      createdAt,
      type: 'foro',
      category: value.category,
      read: false,
      targetUrl: value.targetUrl,
      payload: {
        ...(value.badge ? { badge: value.badge } : {}),
        ...(value.publisher ? { publisherName: value.publisher } : {}),
        ...(this.avatarUrl ? { avatar: this.avatarUrl } : {}),
      },
    };
    this.showPreview = true;
  }

  closePreview(): void {
    this.showPreview = false;
  }

  startEdit(item: NotificationItem): void {
    this.editingId = item.id;
    this.avatarUrl = item.payload?.['avatar'] ? String(item.payload['avatar']) : null;
    this.previewUrl = item.image ?? null;
    this.form.patchValue({
      message: item.message,
      context: item.context,
      category: item.category,
      date: this.toLocalDateTime(item.createdAt),
      image: item.image ?? '',
      avatar: this.avatarUrl ?? '',
      targetUrl: item.targetUrl ?? '',
      badge: item.payload?.['badge'] ?? '',
      publisher: item.payload?.['publisherName'] ?? this.publisherName,
    });
  }

  private toLocalDateTime(timestamp: number): string {
    const d = new Date(timestamp);
    d.setSeconds(0, 0);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  private getMinDateString(): string {
    const now = new Date();
    now.setSeconds(0, 0);
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  getUpdatedAt(payload?: Record<string, unknown>): number | null {
    if (!payload) return null;
    const val = payload['updatedAt'];
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const parsed = Date.parse(val);
      return isNaN(parsed) ? null : parsed;
    }
    if (val instanceof Date) return val.getTime();
    return null;
  }
}
