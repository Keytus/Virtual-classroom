package com.annotation;

import com.service.StudentService;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class UniqueNameValidator implements ConstraintValidator<UniqueName, String> {
    private final StudentService studentService;
    private String message;
    public UniqueNameValidator(StudentService studentService){
        super();
        this.studentService = studentService;
    }
    @Override
    public void initialize(UniqueName constraintAnnotation) {
        message = constraintAnnotation.message();
    }
    @Override
    public boolean isValid(String name, ConstraintValidatorContext context) {
        return !studentService.isStudentExist(name);
    }
}
