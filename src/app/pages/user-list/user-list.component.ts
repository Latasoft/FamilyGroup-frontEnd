import { Component, Inject, inject } from '@angular/core';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [PaginationComponent,RouterLink,CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent   {
    users: User[] = [];
    currentPage: number = 1;
    totalPages: number = 1;


  private userService=inject(UserService);
  private router = inject(Router);

  ngOnInit(){
    this.getUsers(this.currentPage, 10);

  }

  getUsers(page: number, limit: number) {
    this.userService.getAllUsers(page, limit).subscribe(
      (response) => {
        this.users=response.users;
        
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
      },
      (error) => {
        this.users = [];
      }
    );
  }

  handleAction(_id: string): void {
    this.router.navigate(['/usuarios'], { queryParams: { _id: _id } });
  }

  onPageChange(newPage: number) {
    this.getUsers(newPage, 10); // Límite fijo, puede hacerse dinámico
  }
}
