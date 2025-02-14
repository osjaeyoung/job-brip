import axios from "axios";

const API_URL = 'http://jobbrit.loca.lt/api/notices';

export default async function fetchNotices() {
  try {
    const response = await axios.get(API_URL);
    console.log(response); 
    return response.data.content;
  } catch (error) {
    console.error('공지사항을 가져오는 데 실패했습니다.', error);
    throw error;
  }
}
