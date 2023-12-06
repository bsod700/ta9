import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Img } from '../../interfaces/img.interface';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() buttonConfig!: {
    img: Img
  }
}
