import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { Student } from './app.model';
import { StudentService } from './student.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StudentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private studentService: StudentService) {}

  selectedStudent: Student | null = null;
  displayStudent: Student | null = null;
  isDrawing = false;

  get students() {
    return this.studentService.students;
  }

  resetStudents() {
    this.studentService.resetStudents();
  }

  handleVoluntaryStudent(voluntaryStudent: Student) {
    this.selectedStudent = voluntaryStudent;
  }

  confirmStudentReview() {
    if (this.selectedStudent) {
      this.studentService.updateStudentToReview(this.selectedStudent);
      this.studentService.saveStudentsToLocalStorage();
      this.selectedStudent = null;
    }
  }

  cancelStudentReview() {
    this.selectedStudent = null;
  }

  saveStudentsToLocalStorage() {
    const studentsToSave = JSON.stringify(this.students);
    localStorage.setItem('students', studentsToSave);
  }

  randomStudentToReview() {
    this.selectedStudent = null;
    this.isDrawing = true;
    const initialSpeed = 80;
    const decelerationSpeed = 5;
    const maxTime = 3000;

    this.studentService.fakelRandomSelection(
      initialSpeed,
      maxTime,
      decelerationSpeed,

      (student: Student) => {
        this.displayStudent = student;
      },
      (selectedStudent: Student | null) => {
        this.isDrawing = false;
        this.selectedStudent = selectedStudent;
      },
    );
  }
}
