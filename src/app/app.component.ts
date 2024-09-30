import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { STUDENTS as STUDENTS_DATA } from './data/students';
import { Student } from './app.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StudentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    this.loadStudentsFromLocalStorage();
  }
  title = 'wheel-of-names';
  students: Student[] = STUDENTS_DATA;
  selectedStudent: Student | null = null;
  PROBABILITY_OF_SKIPPING_PER_REVIEW = 0.1;

  loadStudentsFromLocalStorage() {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      this.students = JSON.parse(savedStudents);
    }
  }

  saveStudentsToLocalStorage() {
    const studentsToSave = JSON.stringify(this.students);
    localStorage.setItem('students', studentsToSave);
  }

  resetStudents() {
    this.students.forEach((student) => {
      student.hasReviewed = 0;
    });
  }

  handleVoluntaryStudent(voluntaryStudent: Student) {
    this.selectedStudent = voluntaryStudent;
  }

  updateStudent(student: Student) {
    const foundStudent = this.students.find((s) => s.name === student.name);
    if (foundStudent && foundStudent.hasReviewed < 9) {
      foundStudent.hasReviewed += 1;
    }
  }

  confirmStudentReview() {
    if (this.selectedStudent) {
      this.updateStudent(this.selectedStudent);
      this.saveStudentsToLocalStorage();
      this.selectedStudent = null;
      console.log(this.students);
    }
  }
  cancelStudentReview() {
    this.selectedStudent = null;
  }

  randomStudentToReview() {
    const canditates: Student[] = this.students.filter((s) => {
      const probabilityOfSkipping =
        s.hasReviewed * this.PROBABILITY_OF_SKIPPING_PER_REVIEW;

      const randomValue = Math.random();
      return randomValue > probabilityOfSkipping;
    });

    this.selectedStudent =
      canditates[Math.floor(Math.random() * canditates.length)];
  }
}
