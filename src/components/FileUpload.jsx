import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import FileIcon from '../assets/images/sub/File_Icon.svg';

export default function FileUpload({ onChange }) {
  const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일 상태
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    let validFiles = [];
    let errors = [];

    // 업로드된 파일 중 유효한 파일만 필터링
    acceptedFiles.forEach((file) => {
      if (uploadedFiles.length + validFiles.length >= 3) {
        errors.push('최대 3개의 파일만 업로드할 수 있습니다.');
      } else if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} 파일 크기가 5MB를 초과합니다.`);
      } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
        errors.push(`${file.name} 파일 형식은 JPEG 또는 PNG만 지원합니다.`);
      } else {
        validFiles.push(file);
      }
    });

    // 에러 메시지 설정
    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
    } else {
      setErrorMessage('');
      // 유효한 파일 상태에 추가
      setUploadedFiles((prevFiles) => {
        const newFiles = [...prevFiles, ...validFiles];
        // 부모 컴포넌트로 파일을 전달
        onChange(newFiles);
        return newFiles;
      });
    }
  }, [uploadedFiles, onChange]); // uploadedFiles와 onChange 상태 변경 시 콜백 호출

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.jpg, .jpeg, .png', // 파일 형식 필터링
    multiple: true, // 여러 파일 선택 허용
  });

  // 파일 미리보기 렌더링
  const renderFilePreview = (file) => {
    const fileURL = URL.createObjectURL(file);
    return (
      <div key={file.name} style={filePreviewStyle}>
        <img src={fileURL} alt={file.name} style={imagePreviewStyle} />
        <span>{file.name}</span>
      </div>
    );
  };

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <img src={FileIcon} alt="file-icon" style={icon} />
        <p style={infoText}><span style={color}>파일 업로드</span> 또는 파일 드래그앤드롭</p>
        <p style={fileText}>PNG, JPG, up to 5MB</p>
        {errorMessage && <p style={errorText}>{errorMessage}</p>}
      </div>

      <div style={fileListContainer}>
        {uploadedFiles.length > 0 && (
          <div style={fileListStyle}>
            {uploadedFiles.map((file) => renderFilePreview(file))}
          </div>
        )}
      </div>
    </div>
  );
}

// 스타일 적용 (드래그 앤 드랍 영역 디자인)
const dropzoneStyle = {
  height: '130px',
  border: '1px dashed #E0E2E7',
  padding: '25px 20px 20px 20px',
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: '5px',
  marginTop: '20px',
};

const icon = {
  display: 'block',
  margin: '0 auto 7px',
};

const infoText = {
  marginBottom: '8px',
  fontSize: '14px',
  color: '#6F727A',
  fontWeight: '600',
};

const fileText = {
  fontSize: '14px',
  color: '#6F727A',
};

const color = {
  color: '#2E65F3',
};

const errorText = {
  marginTop: '10px',
  fontSize: '14px',
  color: '#F44336', // 빨간색 에러 메시지
};

const fileListContainer = {
  marginTop: '20px',
};

const fileListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
};

const filePreviewStyle = {
  margin: '10px',
  textAlign: 'center',
  width: '100px',
};

const imagePreviewStyle = {
  display: 'block',
  margin: '0 auto 10px',
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '5px',
};
