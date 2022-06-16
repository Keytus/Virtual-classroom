package com.model;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class StudentDto {
    private long id;
    @NotEmpty
    @Size(min = 3, message = "student name should have at least 3 characters")
    private String name;
    @NotNull
    private String handStatus;
}
