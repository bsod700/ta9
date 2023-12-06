import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent implements OnInit {

  @Input() selectedColor: string = '#000000';
  @Output() color = new EventEmitter<string>();

  baseColors: string[] = ['#000000', '#f44336', '#e91e62', '#9c27b0', '#673ab7', '#3e96f3', '#40a9f4', '#3abcd4', '#269688', '#faeb3b'];
  colorGrid: string[][] = [];
  isSelected = false;

  constructor(private elRef: ElementRef) {}
  
  ngOnInit(): void {
    this.colorGrid = this.baseColors.map(baseColor => this.generateShades(baseColor));
  }

  generateShades(baseColor: string): string[] {
    let shades = [];
  
    if (baseColor === '#000000') {
      for (let i = 9; i >= 1; i--) {
        const brightness = Math.round(255 * (i / 9));
        const hexBrightness = brightness.toString(16).padStart(2, '0');
        shades.push(`#${hexBrightness}${hexBrightness}${hexBrightness}`);
      }
    } else {
      // Generate shades for other colors
      for (let i = 1; i <= 9; i++) {
        shades.push(this.adjustBrightness(baseColor, 1 - (i * 0.1)));
      }
    }
  
    return shades;
  }

  adjustBrightness(color: string, factor: number): string {
    let hex = color.replace('#', '');
    let r = Math.round(parseInt(hex.substring(0, 2), 32) * factor);
    let g = Math.round(parseInt(hex.substring(2, 4), 32) * factor);
    let b = Math.round(parseInt(hex.substring(4, 6), 32) * factor);

    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  selectColor(color: string = '#000000'): void {
    this.selectedColor = color
    this.color.emit(color)
  }
  toggleColorPicker(): void {
    this.isSelected = !this.isSelected
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isSelected = false;
    }
  }
}
