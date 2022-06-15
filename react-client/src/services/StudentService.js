import axios from "axios";

const STUDENTS_REST_API_URL = 'http://localhost:8083/api/students';

class StudentService {
    getStudents() {
        return axios.get(STUDENTS_REST_API_URL);
    }
    createStudent(student){
        return axios.post(STUDENTS_REST_API_URL, student)
    }
    updateStudent(student, studentId){
        return axios.put(STUDENTS_REST_API_URL + '/' + studentId, student);
    }
    deleteStudent(studentId){
        return axios.delete(STUDENTS_REST_API_URL + '/' + studentId);
    }
}

export default new StudentService()