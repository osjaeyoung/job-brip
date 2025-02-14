import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {

  const navigate = useNavigate();

  const token = localStorage.getItem('authToken'); // 로그인 여부 확인

  useEffect(() => {
    if (!token) {
      navigate("/signin"); // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
    }
  }, [token, navigate]); // token과 navigate가 변경될 때마다 실행

  // 로그인 상태라면 자식 컴포넌트를 렌더링
  return token ? children : null;
}
