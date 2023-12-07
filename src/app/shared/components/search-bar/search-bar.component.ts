import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  /**
 * EventEmitter to emit the search term to parent components.
 */
  @Output() searchEvent = new EventEmitter<string>();

  searchTerm: string = '';

  /**
 * Emits the entered search term to the parent component.
 * @param value The search term entered by the user.
 */
  search(value: string) {
    this.searchEvent.emit(value);
  }
}
