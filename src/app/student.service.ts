import { Injectable } from '@angular/core';
import { Student } from './app.model';
import { STUDENTS } from './data/students';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  students: Student[] = STUDENTS;
  PROBABILITY_OF_SKIPPING_PER_REVIEW = 0.1;

  constructor() {
    this.loadStudentsFromLocalStorage();
  }

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
    this.students.forEach((s) => (s.hasReviewed = 0));
  }

  updateStudentToReview(student: Student) {
    const foundStudent = this.students.find((s) => s.name === student.name);
    // 9 reviews mean 10% probability to be selected
    if (foundStudent && foundStudent.hasReviewed < 9) {
      foundStudent.hasReviewed += 1;
    }
  }

  randomStudentToReview(): Student | null {
    // with 0 rewiew: 0 * 0.2    ==> 0 vs [0 ..1] ==> 100% to be in the pool
    // with 3 reviews: 3 * 0.2   ==>  0.6 vs [0 ..1] ==> 40% to be in the pool
    const candidates: Student[] = this.students.filter((s) => {
      const probabilityOfSkipping =
        s.hasReviewed * this.PROBABILITY_OF_SKIPPING_PER_REVIEW;

      const randomValue = Math.random();
      return randomValue > probabilityOfSkipping;
    });

    return candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : null;
  }

  fakelRandomSelection(
    initialSpeed: number,
    maxTime: number,
    decelerationFactor: number,
    updateDisplayCallback: (student: Student) => void,
    onCompleteCallback: (selectedStudent: Student | null) => void,
  ) {
    const startTime = Date.now();

    const recursiveSelection = (currentSpeed: number) => {
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime > maxTime) {
        const selectedStudent = this.randomStudentToReview();
        onCompleteCallback(selectedStudent);
      } else {
        const randomIndex = Math.floor(Math.random() * this.students.length);
        updateDisplayCallback(this.students[randomIndex]);

        const newSpeed = currentSpeed + decelerationFactor;

        setTimeout(() => {
          recursiveSelection(newSpeed);
        }, currentSpeed);
      }
    };
    recursiveSelection(initialSpeed);
  }
}
