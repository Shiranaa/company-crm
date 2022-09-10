import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  emailValidity = '';
  passwordValidity = '';
  loginResult = '';
  @ViewChild('emailField') emailField!: ElementRef;
  @ViewChild('passwordField') passwordField!: ElementRef;

  loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: Validators.required,
    }),
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.emailField.nativeElement.focus();
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.emailValidity = this.emailField.nativeElement.validationMessage;
      this.passwordValidity =
        this.passwordField.nativeElement.validationMessage;
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/customers-component']),
      error: (err) => {
        console.error(err);
        this.loginResult = err.error;
      },
    });
  }
}
