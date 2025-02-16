import { create } from "zustand";

// 로그인 상태 관리
export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  email: '',
  nickname: '',
  cuid: '',

  // 로그인 상태 설정 함수
  setAuthData: (data) => {
    set({
      token: data.token,
      email: data.email,
      nickname: data.nickname,
      cuid: data.cuid
    });
  },

  // 로그인 상태 삭제 함수
  clearAuthData: () => {
    set({ token: null, email: '', nickname: '', cuid: '' });

    // localStorage에서 토큰 제거
    localStorage.removeItem('token');
  },
}));
