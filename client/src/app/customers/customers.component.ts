import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import {
  AddCustomer,
  Customer,
  EditCustomer,
  sortColumn,
} from '../shared/types';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  customers!: Array<Customer>;
  searchFieldValue!: string;
  searchTerm!: string;
  showForm = false;
  showNotification = false;
  username = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.username = authService.getUsername();
  }

  logout() {
    this.authService.logout();
  }

  customerForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  customerEditForm = new FormGroup({
    id: new FormControl('', {
      validators: [Validators.required],
    }),
    editName: new FormControl('', {
      validators: [Validators.required],
    }),
    editEmail: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    editPhone: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  onSumbit() {
    if (!this.customerForm.valid) {
      return;
    }

    this.apiService
      .addCustomer(this.customerForm.value as AddCustomer)
      .subscribe({
        next: (data: Customer) => {
          this.getCustomers();
          this.showNotification = true;
        },
        error: (err) => console.error(err),
      });
  }

  notificationClosed(state: boolean) {
    this.showForm = false;
    this.customerForm.reset();
    this.showNotification = state;
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {
    this.apiService.getCustomersList().subscribe({
      next: (data: Array<Customer>) => {
        this.customers = data;
      },
      error: (err) => console.error(err),
      // complete: () => console.log(`complete`)
    });
  }

  toggleEditMode(id: number) {
    const nameElement = document.querySelector(
      `#customer-${id.toString()}-name`
    );
    nameElement!.innerHTML = `<input value="${
      nameElement!.innerHTML
    }" formControlName="editName"/>`;
    const emailElement = document.querySelector(
      `#customer-${id.toString()}-email`
    );
    emailElement!.innerHTML = `<input value=${
      emailElement!.innerHTML
    } formControlName="editEmail"/>`;
    const phoneElement = document.querySelector(
      `#customer-${id.toString()}-phone`
    );
    phoneElement!.innerHTML = `<input value=${
      phoneElement!.innerHTML
    } formControlName="editPhone" />  
    <button
    id="editCustomer"
    type="submit"
    class="btn btn-primary"
  >
    Edit
  </button>
  <input style="display: none;" value=${id} formControlName="id" />
  `;
    document.getElementById('editCustomer')?.addEventListener('click', () => {
      this.editCustomer(id.toString());
    });
  }

  editCustomer(id: string) {
    const editedCustomer = {
      id,
      name: (
        document.querySelector(
          '[formcontrolname="editName"]'
        ) as HTMLInputElement
      ).value,
      email: (
        document.querySelector(
          '[formcontrolname="editEmail"]'
        ) as HTMLInputElement
      ).value,
      phone: (
        document.querySelector(
          '[formcontrolname="editPhone"]'
        ) as HTMLInputElement
      ).value,
    };

    if (
      !editedCustomer.name ||
      !editedCustomer.email ||
      !editedCustomer.phone
    ) {
      console.log(editedCustomer);
      alert('edit info is not valid');
      return;
    }

    this.apiService.editCustomer(editedCustomer as EditCustomer).subscribe({
      next: (data: Customer) => {
        this.getCustomers();
        this.showNotification = true;
      },
      error: (err) => console.error(err),
    });
  }

  deleteCustomer(id: number) {
    const result = confirm('Are you sure you want to delete this customer?');
    if (result) {
      this.apiService.deleteCustomer(id).subscribe({
        next: (data: any) => {
          this.getCustomers();
        },
        error: (err) => console.error(err),
      });
    }
  }
}
