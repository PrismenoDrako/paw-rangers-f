import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FullMapComponent, MapReportMarker, MarkerType } from '../../components/full-map/full-map';
import { MapExplorerService } from '../../services/map-explorer.service';

interface TypeFilter {
  id: MarkerType;
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-map-explorer',
  standalone: true,
  imports: [CommonModule, RouterModule, FullMapComponent],
  templateUrl: './map-explorer.html',
  styleUrls: ['./map-explorer.scss']
})
export class MapExplorerPage implements OnInit {
  filters: TypeFilter[] = [
    { id: 'lost', label: 'Perdidos', active: true },
    { id: 'found', label: 'Encontrados', active: true },
    { id: 'alert', label: 'Alertas', active: true }
  ];

  allMarkers: MapReportMarker[] = [];
  filteredMarkers: MapReportMarker[] = [];
  focusId?: string;
  lastFocused?: MapReportMarker;

  constructor(private mapService: MapExplorerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.allMarkers = this.mapService.getMarkers();
    this.filteredMarkers = [...this.allMarkers];

    const focus = this.route.snapshot.queryParamMap.get('focus');
    if (focus) this.focusId = focus;
  }

  toggleFilter(id: MarkerType): void {
    this.filters = this.filters.map((filter) =>
      filter.id === id ? { ...filter, active: !filter.active } : filter
    );
    this.applyFilters();
  }

  onMarkerFocused(marker: MapReportMarker): void {
    this.lastFocused = marker;
  }

  private applyFilters(): void {
    const activeTypes = this.filters.filter((f) => f.active).map((f) => f.id);
    this.filteredMarkers = this.allMarkers.filter((m) => activeTypes.includes(m.type));
  }
}
