package com.model;

public class Message {
    private String studentName;
    private String content;
    private Action action;

    public Message() {}

    public Message(String userName, String content, Action action) {
        this.studentName = userName;
        this.content = content;
        this.action = action;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    @Override
    public String toString() {
        return "Message{" +
                "studentName='" + studentName + '\'' +
                ", content='" + content + '\'' +
                ", action=" + action +
                '}';
    }
}
