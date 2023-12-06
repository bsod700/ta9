import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
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
import { Store } from '@ngrx/store';
import { AppState } from '../../store/core/app.state';
import * as UserSelectors from '../../store/user/selectors/user.selectors';
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
  @Input('itemIdToEdit') set _itemIdToEdit(itemIdToEdit: number | null) {
    if(itemIdToEdit != null) {
      console.log('ther is id!');
      
      this.isHasId = true
      this.itemIdToEdit = itemIdToEdit 
    } else {
      this.isHasId = false
      this.itemIdToEdit = null
    }
    this.resetComponentState()
    this.title = itemIdToEdit == null ? this.config.title : this.config.update
    this.getItemFromId(itemIdToEdit).subscribe(selectedItem => {
      if (selectedItem) {
        const editableItem = { ...selectedItem };
        this.setItemDataToForm(editableItem);
      }
    });
    itemIdToEdit = null
  }
  @Output() saveItem = new EventEmitter<Item>();
  @Output() exitClick = new EventEmitter<boolean>();

  private timeService: TimeService = inject(TimeService);
  private tableService: TableService = inject(TableService);
  private userService: UserService = inject(UserService);
  private store: Store<AppState> = inject(Store<AppState>)

  @ViewChild('itemForm') itemForm!: NgForm
  config = {
    title: 'Create New',
    update: 'Update Item'
  }
  title!: string;

  formData!: Item

  isHasId: boolean = false
  itemIdToEdit!: number | null

  ngOnInit(): void {
    this.resetForm();
    this.store.select(UserSelectors.selectUsername).subscribe(username => this.formData.createdBy = username as string)
  }

  onSubmit() {
    if(this.isHasId) {
      const currentDate = new Date();
      this.formData.lastUpdate = this.timeService.formatDate(currentDate);
      this.updateData(this.itemIdToEdit as number, this.formData)
    } else {
      this.addNewItem()
    }
    this.saveItem.emit(this.formData);
    this.resetForm();
    this.exitClick.emit(true);
  }

  updateData(id: number, data: Item) {
    if(id) {
      console.log('updateData data', data, ' id ', id);

      this.tableService.updateItemById(id,data);
    }
      
  }
 
  onCancel() {
    this.exitClick.emit(true);
  }

  onExitClick() {
    this.exitClick.emit(true);
  }

  onColorChange(color: string): void {
    this.formData.color = color
  }

  getItemFromId(selectedId: number | null): Observable<Item | null> {
    return this.tableService.getItems().pipe(
      map(data => data.find(item => item.id === selectedId) || null)
    );
  }
  
  setItemDataToForm(item: Item): void {
    this.formData = item
  }

  getCurrentUser(): string| null {
    return this.userService.getCurrentUser()
  }

  resetComponentState() {
    this.title = this.config.title;
    this.resetForm();
  }

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

  addNewItem(): void {
    const currentDate = new Date();
    let lastIndex = this.tableService.getItemsLength()
    this.formData.id = lastIndex++
    this.formData.createDate = this.timeService.formatDate(currentDate);
    this.formData.lastUpdate = this.timeService.formatDate(currentDate);
    this.formData.createdBy = this.getCurrentUser() ?? ''
    console.log('Form Data:', this.formData);
    this.tableService.saveItem(this.formData);
    
  }
}
