// FileUtil.java
package com.example.brip.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

public class FileUtil {
    
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final String UPLOAD_BASE_DIR = "/uploads";

    // 파일 사이즈 체크
    public static void validateFileSize(MultipartFile file) throws IllegalArgumentException {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("파일 크기는 5MB를 초과할 수 없습니다.");
        }
    }

    // 이미지 파일 확장자 체크
    public static void validateImageExtension(String originalFilename) throws IllegalArgumentException {
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("파일 이름이 없습니다.");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        if (!extension.equals("jpg") && !extension.equals("jpeg") && !extension.equals("png")) {
            throw new IllegalArgumentException("JPG, PNG 형식의 이미지만 업로드 가능합니다.");
        }
    }

    // 파일 업로드 공통 메소드
    public static String uploadFile(MultipartFile file, String directory) throws IOException {
        // 파일 이름 생성
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        // 업로드 경로 생성
        String uploadDir = UPLOAD_BASE_DIR + "/" + directory;
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        
        // 파일 저장
        String filePath = uploadDir + "/" + fileName;
        File dest = new File(filePath);
        //file.transferTo(dest);
        
        // URL 반환
        return "/" + directory + "/" + fileName;
    }

    // 프로필 이미지 업로드 전용 메소드
    public static String uploadProfileImage(MultipartFile image) throws IOException {
        validateFileSize(image);
        validateImageExtension(image.getOriginalFilename());
        return uploadFile(image, "profile");
    }

    // 문의사항 이미지 업로드 전용 메소드
    public static String uploadInquiryImage(MultipartFile image) throws IOException {
        validateFileSize(image);
        validateImageExtension(image.getOriginalFilename());
        return uploadFile(image, "inquiry");
    }
}