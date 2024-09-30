import { Component, input, output } from '@angular/core';
import { Student } from '../app.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent {
  student = input.required<Student>();
  voluntaryStudent = output<Student>();

  onSelect() {
    this.voluntaryStudent.emit(this.student());
  }
}
