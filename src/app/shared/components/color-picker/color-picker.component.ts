import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent {

  /**
 * Sets the selected color and initializes the color grid.
 * If no color is selected, generates a random color.
 * @param selectedColor The initial color value.
 */
  @Input('selectedColor') set _selectedColor(selectedColor: string) {
    selectedColor = selectedColor ? selectedColor : this.generateRandomColor();
    this.selectedColor = selectedColor;
    this.colorGrid = this.baseColors.map(baseColor => this.generateShades(baseColor));
    this.selectColor(this.selectedColor);
  };
  
  // Emits the selected color value.
  @Output() color = new EventEmitter<string>();

  // Base colors for generating color shades.
  baseColors: string[] = ['#000000', '#f44336', '#e91e62', '#9c27b0', '#673ab7', '#3e96f3', '#40a9f4', '#3abcd4', '#269688', '#faeb3b'];

  // 2D array representing the color grid.
  colorGrid: string[][] = [];

  // Flag to indicate if the color picker is active.
  isSelected = false;

  // Holds the currently selected color.
  selectedColor!: string;

  // Injects the ElementRef for DOM access.
  private elRef: ElementRef = inject(ElementRef);

  /**
 * Generates an array of color shades based on the base color.
 * @param baseColor The base color to generate shades from.
 * @returns An array of color shades.
 */
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

  /**
 * Adjusts the brightness of a color.
 * @param color The original color in hex format.
 * @param factor The factor by which to adjust the brightness.
 * @returns The adjusted color in hex format.
 */
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

  /**
 * Generates a random hex color.
 * @returns A random hex color string.
 */
  generateRandomColor(): string {
    const randomHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${randomHex()}${randomHex()}${randomHex()}`;
  }

  /**
 * Sets the selected color and emits it.
 * @param color The color to select.
 */
  selectColor(color: string = '#000000'): void {
    this.selectedColor = color;
    this.color.emit(this.selectedColor);
  }

  /**
 * Toggles the visibility of the color picker.
 */
  toggleColorPicker(): void {
    this.isSelected = !this.isSelected;
  }

  /**
 * Closes the color picker if a click occurs outside it.
 * @param event The DOM click event.
 */
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isSelected = false;
    }
  }
}
