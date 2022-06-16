package com.model;

import javax.persistence.*;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "name", unique=true)
    private String name;
    @Column(name = "hand_status")
    private String handStatus;

    public Student(){}

    public Student(String name, String handStatus) {
        this.name = name;
        this.handStatus = handStatus;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHandStatus() {
        return handStatus;
    }

    public void setHandStatus(String handStatus) {
        this.handStatus = handStatus;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", handStatus='" + handStatus + '\'' +
                '}';
    }
}
