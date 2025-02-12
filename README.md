# job-brip
브립 레포지토리

# jwt Token
POST http://localhost:8080/api/user/sample
Key : Authorization
Value : Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzM5MzQwNTE3LCJleHAiOjE3Mzk0MjY5MTd9.RgSpzjdD7icRWaA_merVi_El2c5j7CB6Dgv3EH3FCnQYn7KMjMIUPny6lXfp7B-gCfeef2xuyk30F-PAmHKQbQ
(로그인 후 전달 받은 토큰)

# react 로그인 요청 코드 (확인용샘플)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.result === 'success') {
        // 로그인 성공 처리
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', data.email);
        
        // 메인 페이지로 이동
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('로그인 처리 중 오류가 발생했습니다.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

# Swagger UI 접속방법
Swagger UI: http://localhost:8080/swagger-ui.html
API Docs (JSON): http://localhost:8080/v3/api-docs