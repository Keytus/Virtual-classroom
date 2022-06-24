package com.model;

import com.annotation.UniqueName;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class StudentDto {
    private long id;
    @NotEmpty
    @UniqueName(message = "Name taken")
    @Size(min = 3, message = "Student name should have at least 3 characters")
    private String name;
    @NotNull
    private String handStatus;
}
