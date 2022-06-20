import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import StudentService from "../services/StudentService";
import '../App.css';

const STUDENTS_PATH = '/members';
export const USER_FIELD = 'user';

export const Login = () => {
  const [user, setUser] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useHistory()

  const handleLogin = () => {
    let student = { name: user, handStatus: "" };

    StudentService.createStudent(student)
      .then(() => {
        setCurrentUser(user);
        navigate.push(STUDENTS_PATH);
        navigate.go();
      })
      .catch((e) => {
        setErrorMessage("A problem has been occurred while submitting your login data");
      });
  }
  const handleClearError = () => {
    setErrorMessage(null);
  }
  return (
    <div className='content' id='loginContent'>
      <main className='login-container'>
        <span className='login-container__text'>Your Name:</span>
        <input className='login-container__input' type='text' onChange={e => setUser(e.target.value)} />
        <button className='login-container__btn-confirm' onClick={handleLogin}>Login</button>
      </main>
      {errorMessage && <div className="alert alert-danger alert-dismissible fade show">
        <strong>Error!</strong> {errorMessage}
        <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={handleClearError}></button>
      </div>}

    </div>
  )
}

export function getCurrentUser() {
  const userString = sessionStorage.getItem(USER_FIELD);
  return JSON.parse(userString);
}

export function setCurrentUser(user) {
  sessionStorage.setItem(USER_FIELD, JSON.stringify(user));
}