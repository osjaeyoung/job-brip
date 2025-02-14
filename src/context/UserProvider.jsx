import React, { createContext, useState, useEffect } from 'react';

// 1. Context 생성
export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // 로딩 상태

  useEffect(() => {
    // 로컬스토리지에서 사용자 정보 로드
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));  // 로컬스토리지에서 데이터를 user 상태에 저장
    }
    setLoading(false);  // 로딩이 끝났음을 알려줌
  }, []);  // 최초 렌더링 시에만 실행

  // 로그인 함수
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));  // 로컬스토리지에 user 데이터 저장
    setUser(userData);  // user 상태 업데이트
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('user');  // 로컬스토리지에서 user 데이터 제거
    setUser(null);  // user 상태 초기화
  };

  // 사용자 정보 업데이트 함수
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);  // user 상태 업데이트
    localStorage.setItem('user', JSON.stringify(updatedUserData));  // 로컬스토리지에도 저장
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
