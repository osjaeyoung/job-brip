import axios from 'axios';

const client = axios.create({
  baseURL: 'https://light-dolls-repair.loca.lt/api/user',
  headers: { 'Content-Type': 'application/json' },
});

//로그인 api
export async function login(email, password) {
  try {
    const response = await client.post('/login', { email, password });
    localStorage.setItem('token', response.data.token);

    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
  }
}

//닉네임체크 api
export async function checkNickname(nickname) {
  try {
    const response = await client.post('/check-nickname', { nickname });
    return response.data.exists;
  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error);
    return false;
  }
}

//회원가입 api
export async function signUp(name, nickname, email, password) {
  try {
    const response = await client.post('/register', { name, nickname, email, password});
    localStorage.setItem('token', response.data.token);

    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    return false;
  }
}