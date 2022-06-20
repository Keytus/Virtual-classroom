import React from "react";
import StudentService from "../services/StudentService";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { getCurrentUser, USER_FIELD } from "./LoginComponent";
import { useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Dropdown } from 'react-bootstrap'

var stompClient = null;
const LOGIN_PATH = '/login';

export const Students = () => {
    const navigate = useHistory();
    const [students, setStudents] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        connected: false
    });

    useEffect(() => {
        connect();
    }, []);

    const connect = () => {
        StudentService.getStudents().then((response) => {
            setStudents(response.data);
            if (!stompClient) {
                let Sock = new SockJS('http://localhost:8083/ws');
                stompClient = over(Sock);
                stompClient.connect({}, onConnected, onError);
            }
        });
    }

    const onConnected = () => {
        setUserData({ "username": getCurrentUser(), "connected": true });
        stompClient.subscribe('/classroom', onMessageReceived);
        studentJoin();
    }

    const studentJoin = () => {
        if (stompClient) {
            let chatMessage = {
                studentName: userData.username,
                content: "",
                action: "JOIN"
            };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        }
    }

    const onMessageReceived = (payload) => {
        sleep(50);
        StudentService.getStudents().then((response) => {
            setStudents(response.data);
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

    const onError = (err) => {
        console.log(err);
    }

    const sleep = (milliseconds) => {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    const findStudentByName = (studentName) => {
        let selectedStudent = null;
        students.map(
            student => {
                if (student.name === studentName) {
                    selectedStudent = student;
                }
            }
        )
        return selectedStudent;
    }

    const changeHandStatusTest = () => {
        let selectedStudent = findStudentByName(userData.username);
        let handUpDown = document.getElementById('handUpDown');
        if (selectedStudent) {
            let handContent;
            if (selectedStudent.handStatus === "✋") {
                selectedStudent.handStatus = "";
                handUpDown.innerHTML = "Raise hand up";
                StudentService.updateStudent(selectedStudent, selectedStudent.id);
                handContent = "Down";
            }
            else {

                selectedStudent.handStatus = "✋";
                handUpDown.innerHTML = "Raise hand down";
                StudentService.updateStudent(selectedStudent, selectedStudent.id);
                handContent = "Up";
            }
            if (stompClient) {
                let chatMessage = {
                    studentName: userData.username,
                    content: handContent,
                    action: "RAISE_HAND_UP_OR_DOWN"
                };
                stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            }
        }
    }

    const handleLogout = () => {
        let selectedStudent = findStudentByName(userData.username);
        if (selectedStudent) {
            StudentService.deleteStudent(selectedStudent.id)
                .then(() => {
                    if (stompClient) {
                        let chatMessage = {
                            studentName: userData.username,
                            content: "",
                            action: "LEAVE"
                        };
                        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
                    }
                    sessionStorage.removeItem(USER_FIELD);
                    navigate.push(LOGIN_PATH);
                    navigate.go();
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        else {
            console.log("Not find")
        }
    }

    return (
        <div className="content">
            <header>
                <nav className="navbar navbar-light bg-light header__navbar">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" menuVariant="dark" id="dropdown-actions">
                            Actions
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item id="handUpDown" onClick={changeHandStatusTest}>Raise hand up</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-student">
                            {userData.username}
                        </Dropdown.Toggle>

                        <Dropdown.Menu align={{ lg: 'end' }}>
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </nav>
            </header>
            <main className="main-students">
                <label>Class members
                    <table id="studentsTable" className="main-students__table table-responsive table-sm">
                        <thead>
                            <tr>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                students.map(
                                    student =>
                                        <tr key={student.id}>
                                            <td style={{ width: "98.00%" }}>{student.name}</td>
                                            <td style={{ width: "2.00%" }}>{student.handStatus}</td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                </label>
            </main>
        </div>
    )
}


const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
        style={{ cursor: "pointer" }}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        &#x25bc;
    </span>
));