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
export class NewItemComponent implements OnInit, OnChanges {
  @Input() itemIdToEdit: number | null = null;
  @Output() saveItem = new EventEmitter<number | null>();
  @Output() exitClick = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<Item>()

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

  formData = {
    id: 0,
    description: '',
    name: '',
    color: '',
    createdDate: '',
    lastUpdate: '',
    createdBy: 'YourUserName'
  };


  ngOnInit(): void {
    this.title = this.itemIdToEdit == null ? this.config.title : this.config.update
    console.log('from new item ', this.getCurrentUser());
    this.store.select(UserSelectors.selectUsername).subscribe(username => this.formData.createdBy = username as string)
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemIdToEdit'] && this.itemIdToEdit != null) {
      this.title = this.itemIdToEdit == null ? this.config.title : this.config.update;
      
      this.getItemFromId(this.itemIdToEdit).subscribe(selectedItem => {
        console.log('selectedItem ', selectedItem);
        
        if (selectedItem) {
          this.setItemDataToForm(selectedItem);
          console.log('formData', this.formData);
        }
      });
    }
  }
  onSubmit() {
    const currentDate = new Date();
    let lastIndex = this.tableService.getItemsLength()
    this.formData.id = lastIndex++
    this.formData.createdDate = this.timeService.formatDate(currentDate);
    this.formData.lastUpdate = this.timeService.formatDate(currentDate);
    const formData = this.formData as unknown as Item
    console.log('Form Data:', formData);
    this.tableService.saveItem(formData);
    this.submit.emit(formData)
    // this.resetForm()
  }
  updateData(id: number, data: Item) {
    if(id)
      this.tableService.updateItemById(id,data);
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
  getItemFromId(selectedId: number): Observable<Item | null> {
    return this.tableService.getItems().pipe(
      map(data => data.find(item => item.id === selectedId) || null)
    );
  }
  
  setItemDataToForm(item: Item): void {
    this.formData.description = item.description
    this.formData.name = item.name
    this.formData.color = item.color
  }
  getCurrentUser(): string| null {
    return this.userService.getCurrentUser()
  }
  resetForm(): void {
    this.formData.description = ''
    this.formData.name = ''
    this.formData.color = ''
  }
}
