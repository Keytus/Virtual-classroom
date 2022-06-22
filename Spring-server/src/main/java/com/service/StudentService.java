package com.service;

import com.model.Student;

import java.util.List;

public interface StudentService {
    public List<Student> getStudents();
    public Student createStudent(Student student);
    public Student getStudentById(Long id);
    public Student updateStudent(Long id,Student studentDetails);
    public void deleteStudent(Long id);
    public boolean isStudentExist(String name);
}
