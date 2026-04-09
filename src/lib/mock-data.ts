
export type Role = 'admin' | 'teacher' | 'student' | 'parent' | 'accountant';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
}

export interface Student extends User {
  gradeLevel: string;
  attendance: number;
  gpa: number;
  enrolledCourses: string[];
}

export interface Course {
  id: string;
  title: string;
  teacherId: string;
  schedule: string;
  room: string;
  capacity: number;
  enrolled: number;
}

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Dr. Sarah Smith', role: 'admin', email: 'sarah.smith@academia.edu', avatar: 'https://picsum.photos/seed/12/100/100' },
  { id: '2', name: 'Prof. James Wilson', role: 'teacher', email: 'james.wilson@academia.edu', avatar: 'https://picsum.photos/seed/22/100/100' },
  { id: '3', name: 'Alex Johnson', role: 'student', email: 'alex.j@student.edu', avatar: 'https://picsum.photos/seed/32/100/100' },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 'S1', name: 'Emma Davis', role: 'student', email: 'emma.d@student.edu', gradeLevel: '10th Grade', attendance: 98, gpa: 3.8, enrolledCourses: ['C1', 'C3'], avatar: 'https://picsum.photos/seed/s1/100/100' },
  { id: 'S2', name: 'Liam Garcia', role: 'student', email: 'liam.g@student.edu', gradeLevel: '10th Grade', attendance: 92, gpa: 3.5, enrolledCourses: ['C1', 'C2'], avatar: 'https://picsum.photos/seed/s2/100/100' },
  { id: 'S3', name: 'Olivia Martinez', role: 'student', email: 'olivia.m@student.edu', gradeLevel: '11th Grade', attendance: 95, gpa: 3.9, enrolledCourses: ['C2', 'C4'], avatar: 'https://picsum.photos/seed/s3/100/100' },
  { id: 'S4', name: 'Noah Brown', role: 'student', email: 'noah.b@student.edu', gradeLevel: '9th Grade', attendance: 88, gpa: 3.2, enrolledCourses: ['C1', 'C4'], avatar: 'https://picsum.photos/seed/s4/100/100' },
];

export const MOCK_COURSES: Course[] = [
  { id: 'C1', title: 'Advanced Mathematics', teacherId: '2', schedule: 'Mon/Wed 9:00 AM', room: 'B102', capacity: 30, enrolled: 28 },
  { id: 'C2', title: 'World History', teacherId: '2', schedule: 'Tue/Thu 11:00 AM', room: 'A204', capacity: 25, enrolled: 22 },
  { id: 'C3', title: 'Introduction to Physics', teacherId: '2', schedule: 'Mon/Wed 1:30 PM', room: 'Lab 3', capacity: 20, enrolled: 18 },
  { id: 'C4', title: 'Modern Literature', teacherId: '5', schedule: 'Fri 10:00 AM', room: 'C101', capacity: 35, enrolled: 30 },
];
