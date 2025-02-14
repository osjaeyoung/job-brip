export const supportStatus = {
  
  // 데이터 피커
  datePicker: {
    startDate: "2025-01-01",  // 시작일
    endDate: "2025-02-28",    // 마지막일
  },

  // 지원 현황
  applicationStats: {
    completed: 12,   // 지원완료
    viewed: 5,       // 열람
    notViewed: 8,    // 미열람
    cancelled: 10,   // 지원취소
  },

  // 지원 현황 리스트
  applicationList: [
    {
      companyName: "(주)국토해양환경기술단",  // 회사명
      jobTitle: "해양생태계분야(해조류/해초류)직원채용공고",  // 공고 내용
      applicationDate: "2025-01-15",  // 지원일
      viewDate: "2025-01-16",  // 열람일
      deadline: "2025-02-15",  // 접수 마감일
      removeApplication: () => console.log("지원내역삭제 - (주)국토해양환경기술단"),
      cancelApplication: () => console.log("지원취소 - (주)국토해양환경기술단"),
    },
    {
      companyName: "(주)국토해양환경기술단",
      jobTitle: "해양생태계분야(해조류/해초류)직원채용공고",
      applicationDate: "2025-01-18",
      viewDate: null,  // 열람 안 함
      deadline: "2025-02-20",
      removeApplication: () => console.log("지원내역삭제 - (주)국토해양환경기술단"),
      cancelApplication: () => console.log("지원취소 - (주)국토해양환경기술단"),
    }
  ]
};

