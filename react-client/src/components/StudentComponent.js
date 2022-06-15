import React from "react";
import StudentService from "../services/StudentService";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;

class StudentComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            students: [],
        }
        this.createStudentTest = this.createStudentTest.bind(this);
        this.deleteStudentTest = this.deleteStudentTest.bind(this);
        this.changeHandStatusTest = this.changeHandStatusTest.bind(this);
        this.findTableRowByName = this.findTableRowByName.bind(this);
        this.findStudentByName = this.findStudentByName.bind(this);
    }

    componentDidMount() {
        StudentService.getStudents().then((response) => {
            this.setState({ students: response.data });
        });
        if (!stompClient) {
            let Sock = new SockJS('http://localhost:8083/ws');
            stompClient = over(Sock);
            stompClient.connect({}, this.onConnected, this.onError);
        }
    }

    onConnected = () => {
        stompClient.subscribe('/classroom', this.onMessageReceived);
    }

    onMessageReceived = (payload) => {
        StudentService.getStudents().then((response) => {
            this.setState({ students: response.data });
        });
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.action) {
            case "JOIN":
                console.log(payloadData.studentName, " join us");
                break;
            case "LEAVE":
                console.log(payloadData.studentName, " leave");
                break;
            case "RAISE_HAND_UP_OR_DOWN":
                console.log(payloadData.studentName, "use hand action");
                break;
        }

    }

    onError = (err) => {
        console.log(err);
    }

    findTableRowByName(studentName) {
        let tableRef = document.getElementById("studentsTable");
        for (let row of tableRef.rows) {
            if (row.cells[0] != undefined && row.cells[0].innerHTML === studentName) {
                return row;
            }
        }
        return null;
    }

    findStudentByName(studentName) {
        let selectedStudent = null;
        this.state.students.map(
            student => {
                if (student.name === studentName) {
                    selectedStudent = student;
                }
            }
        )
        return selectedStudent;
    }

    render() {
        return (
            <div>
                <input type="text" id="nameInput" placeholder="Enter name"/>
                <button onClick={this.createStudentTest}>Create</button>
                <button onClick={this.changeHandStatusTest}>Hand</button>
                <button onClick={this.deleteStudentTest}>Delete</button>
                <h1 className="text-center">Students List</h1>
                <table id="studentsTable" className="table table-striped">
                    <thead>
                        <tr>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.students.map(
                                student =>
                                    <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>{student.handStatus}</td>
                                    </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    changeHandStatusTest() {
        let selectedName = document.getElementById("nameInput").value;
        let selectedStudent = this.findStudentByName(selectedName);
        if (selectedStudent) {
            let handContent;
            if (selectedStudent.handStatus === "✋") {
                selectedStudent.handStatus = "";
                StudentService.updateStudent(selectedStudent, selectedStudent.id);
                handContent = "Down";
            }
            else {
                selectedStudent.handStatus = "✋";
                StudentService.updateStudent(selectedStudent, selectedStudent.id);
                handContent = "Up";
            }
            if (stompClient) {
                let chatMessage = {
                    studentName: selectedName,
                    content: handContent,
                    action: "RAISE_HAND_UP_OR_DOWN"
                };
                stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            }
        }
    }

    createStudentTest() {
        let selectedName = document.getElementById("nameInput").value;
        var student = { name: selectedName, handStatus: "" };
        StudentService.createStudent(student);
        if (stompClient) {
            let chatMessage = {
                studentName: selectedName,
                content: "",
                action: "JOIN"
            };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        }
    }

    deleteStudentTest() {
        let selectedName = document.getElementById("nameInput").value;
        let selectedStudent = this.findStudentByName(selectedName);
        if (selectedStudent) {
            StudentService.deleteStudent(selectedStudent.id);
            if (stompClient) {
                let chatMessage = {
                    studentName: selectedName,
                    content: "",
                    action: "LEAVE"
                };
                stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            }
        }
        else {
            console.log("Not find")
        }
    }
}

export default StudentComponent