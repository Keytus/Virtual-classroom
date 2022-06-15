package com.controller;

import com.model.Student;
import com.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(value = "/api/")
public class StudentController {
    @Autowired
    private StudentRepository studentRepository;
    @GetMapping("/students")
    public List<Student> getUsers(){
        return this.studentRepository.findAll();
    }
    @PostMapping("/students")
    public Student createUser(@RequestBody Student user) {
        return this.studentRepository.save(user);
    }
    @GetMapping("/students/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student user = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not exist with id :" + id));
        return ResponseEntity.ok(user);
    }
    @PutMapping("/students/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails){
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not exist with id :" + id));

        student.setName(studentDetails.getName());
        student.setHandStatus(studentDetails.getHandStatus());

        Student updatedUser = studentRepository.save(student);
        return ResponseEntity.ok(updatedUser);
    }
    @DeleteMapping("/students/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteStudent(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not exist with id :" + id));

        studentRepository.delete(student);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
