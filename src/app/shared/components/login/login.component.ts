import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  username: string = '';

  constructor(private userService: UserService) {}

  onSave(): void {
    this.userService.saveUsername(this.username);
  }
}
