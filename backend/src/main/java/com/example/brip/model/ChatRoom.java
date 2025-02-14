package com.example.brip.model;

import java.util.HashSet;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor  // 기본 생성자 추가
public class ChatRoom {
    private String roomId;
    private String name;
    private String type; // GROUP, DM
    private int maxUsers;
    private String imageUrl;
    private Set<String> userIds = new HashSet<>();
}