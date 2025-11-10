import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ApiService } from './core/services/api.service';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, ButtonModule, ToastModule, JsonPipe],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App implements OnInit {
	protected readonly title = signal('paw-rangers-f');
	data: any;

	constructor(private messageService: MessageService, private apiService: ApiService) { }


	ngOnInit(): void {
		this.apiService.get('doctypes').subscribe(
		{
			next: res => this.data = res,
			error: err => console.error(err)
		});
	}


	show() {
		this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
	}
}
