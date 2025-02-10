package com.example.brip.model;

import java.util.HashSet;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatRoom {
    private String roomId;
    private String name;
    private String type; // GROUP, DM
    private int maxUsers;
    private String imageUrl;
    private Set<String> userIds = new HashSet<>();
}