import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TimeService } from '../../services/time.service';
import {MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { TableService } from '../../services/table.service';
import { Item } from '../../interfaces/item.interface';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { Observable, map } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-new-item',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, FormsModule, CommonModule, ColorPickerComponent],
  templateUrl: './new-item.component.html',
  styleUrl: './new-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewItemComponent implements OnInit {
  /**
 * Setter for itemIdToEdit. Updates component state based on the provided ID.
 * @param itemIdToEdit The ID of the item to edit, or null for a new item.
 */
  @Input('itemIdToEdit') set _itemIdToEdit(itemIdToEdit: number | null) {
    if(itemIdToEdit != null) {
      this.isHasId = true;
      this.itemIdToEdit = itemIdToEdit ;
    } else {
      this.isHasId = false;
      this.itemIdToEdit = null;
    }
    this.resetComponentState()
    this.title = itemIdToEdit == null ? this.config.title : this.config.update;
    this.getItemFromId(itemIdToEdit).subscribe(selectedItem => {
      if (selectedItem) {
        const editableItem = { ...selectedItem };
        this.setItemDataToForm(editableItem);
      }
    });
    itemIdToEdit = null;
  }
  @Output() saveItem = new EventEmitter<Item>();
  @Output() exitClick = new EventEmitter<boolean>();

  private timeService: TimeService = inject(TimeService);
  private tableService: TableService = inject(TableService);
  private userService: UserService = inject(UserService);

  config = {
    title: 'Create New',
    update: 'Update Item'
  };
  title!: string;

  formData!: Item;

  isHasId: boolean = false;
  itemIdToEdit!: number | null;

  /**
 * reset form & get user.
 */
  ngOnInit(): void {
    this.resetForm();
    this.userService.getUser().subscribe(username => this.formData.createdBy = username as string);
  }

  /**
 * Submits the form data, either updating an existing item or adding a new one.
 */
  onSubmit() {
    if(this.isHasId) {
      const currentDate = new Date();
      this.formData.lastUpdate = this.timeService.formatDate(currentDate);
      this.updateData(this.itemIdToEdit as number, this.formData);
    } else {
      this.addNewItem();
    }
    this.saveItem.emit(this.formData);
    this.resetForm();
    this.exitClick.emit(true);
    this.itemIdToEdit = null;
  }

  /**
 * Updates an existing item by its ID.
 * @param id The ID of the item to update.
 * @param data The updated item data.
 */
  updateData(id: number, data: Item) {
    if(id != null) {
      this.tableService.updateItemById(id,data);
    }
  }
 
  /**
 * Emits an event to signal form cancellation.
 */
  onCancel() {
    this.exitClick.emit(true);
  }

  /**
 * Emits an event to signal exiting the component.
 */
  onExitClick() {
    this.exitClick.emit(true);
  }

  /**
 * Updates the color in the form data.
 * @param color The new color value.
 */
  onColorChange(color: string): void {
    this.formData.color = color;
  }

  /**
 * Retrieves an item by its ID from the table service.
 * @param selectedId The ID of the item to retrieve.
 * @returns Observable of the selected item or null.
 */
  getItemFromId(selectedId: number | null): Observable<Item | null> {
    return this.tableService.getItems().pipe(
      map(data => data.find(item => item.id === selectedId) || null)
    );
  }
  
  /**
 * Sets the form data with the given item.
 * @param item The item to set in the form.
 */
  setItemDataToForm(item: Item): void {
    this.formData = item;
  }

  /**
 * Retrieves the current user's username.
 * @returns The username of the current user or null.
 */
  getCurrentUser(): string| null {
    return this.userService.getCurrentUser();
  }

  /**
 * Resets the component state to its default values.
 */
  resetComponentState() {
    this.title = this.config.title;
    this.resetForm();
  }

  /**
 * Resets the form fields to default values.
 */
  resetForm(): void {
    this.formData = {
      id: 0,
      description: '',
      name: '',
      color: '',
      createDate: '',
      lastUpdate: '',
      createdBy: ''
    };
  }

  /**
 * Adds a new item based on the current form data.
 */
  addNewItem(): void {
    const currentDate = new Date();
    let lastIndex = this.tableService.getItemsLength();
    this.formData.id = lastIndex++;
    this.formData.createDate = this.timeService.formatDate(currentDate);
    this.formData.lastUpdate = this.timeService.formatDate(currentDate);
    this.formData.createdBy = this.getCurrentUser() ?? '';
    this.tableService.saveItem(this.formData);
  }
}
