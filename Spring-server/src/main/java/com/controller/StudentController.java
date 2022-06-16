package com.controller;

import com.model.Student;
import com.model.StudentDto;
import com.service.StudentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(value = "/api/")
public class StudentController {
    @Autowired
    private ModelMapper modelMapper;
    private StudentService studentService;
    public StudentController(StudentService studentService){
        super();
        this.studentService = studentService;
    }
    @GetMapping("/students")
    public List<StudentDto> getStudents(){
        return studentService.getStudents().stream()
                .map(student -> modelMapper.map(student, StudentDto.class))
                .collect(Collectors.toList());
    }
    @PostMapping("/students")
    public ResponseEntity<StudentDto> createStudent(@RequestBody StudentDto studentDto) {
        Student studentRequest = modelMapper.map(studentDto, Student.class);

        Student post = studentService.createStudent(studentRequest);

        StudentDto studentResponse = modelMapper.map(post, StudentDto.class);

        return new ResponseEntity<StudentDto>(studentResponse, HttpStatus.CREATED);
    }
    @GetMapping("/students/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);

        StudentDto studentResponse = modelMapper.map(student, StudentDto.class);

        return ResponseEntity.ok().body(studentResponse);
    }
    @PutMapping("/students/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable Long id, @RequestBody StudentDto studentDto){
        Student studentRequest = modelMapper.map(studentDto, Student.class);

        Student post = studentService.updateStudent(id, studentRequest);

        StudentDto studentResponse = modelMapper.map(post, StudentDto.class);

        return ResponseEntity.ok().body(studentResponse);
    }
    @DeleteMapping("/students/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
