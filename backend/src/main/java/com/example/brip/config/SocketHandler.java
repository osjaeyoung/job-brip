package com.example.brip.config;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.example.brip.model.ChatRoom;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Set;
import java.util.UUID;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import org.springframework.web.socket.TextMessage;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

@Component
public class SocketHandler extends TextWebSocketHandler {
    private Set<WebSocketSession> sessions = new HashSet<>();
    private Map<String, ChatRoom> chatRooms = new HashMap<>();

    @Autowired
    private SqlSession sqlSession;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        sendRoomList(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            JSONObject msg = (JSONObject) new JSONParser().parse(message.getPayload());
            String protocol = msg.get("protocol").toString();
            switch(protocol) {
                case "CREATE_ROOM": createRoom(session, msg); break;
                case "JOIN_ROOM": joinRoom(session, msg); break;
                case "CHAT": handleChat(session, msg); break;
                case "LEAVE_ROOM": leaveRoom(session, msg); break;
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    private void createRoom(WebSocketSession session, JSONObject msg) {
        String roomId = UUID.randomUUID().toString();
        Map<String, Object> params = new HashMap<>();
        params.put("roomId", roomId);
        params.put("name", msg.get("name"));
        params.put("type", msg.get("type"));
        params.put("maxUsers", msg.get("maxUsers"));
        params.put("imageUrl", msg.get("imageUrl"));
        
        sqlSession.insert("insertChatRoom", params);
        broadcastRoomList();
    }

    private void sendRoomList(WebSocketSession session) {
        try {
            List<Map> rooms = sqlSession.selectList("selectAllRooms");
            session.sendMessage(new TextMessage(new JSONObject(
                Map.of("protocol", "ROOM_LIST", "rooms", rooms)
            ).toString()));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void broadcastRoomList() {
        try {
            List<Map> rooms = sqlSession.selectList("selectAllRooms");
            JSONObject message = new JSONObject(Map.of("protocol", "ROOM_LIST", "rooms", rooms));
            for (WebSocketSession s : sessions) {
                s.sendMessage(new TextMessage(message.toString()));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
     }
     
    private void joinRoom(WebSocketSession session, JSONObject msg) {
        String roomId = msg.get("roomId").toString();
        ChatRoom room = chatRooms.get(roomId);
        if (room != null && room.getUserIds().size() < room.getMaxUsers()) {
            room.getUserIds().add(session.getId());
            broadcastRoomList();
        }
     }
     
    private void handleChat(WebSocketSession session, JSONObject msg) {
        try {
            String roomId = msg.get("roomId").toString();
            ChatRoom room = chatRooms.get(roomId);
            if (room != null && room.getUserIds().contains(session.getId())) {
                JSONObject chatMsg = new JSONObject();
                chatMsg.put("protocol", "CHAT");
                chatMsg.put("roomId", roomId);
                chatMsg.put("content", msg.get("content"));
                chatMsg.put("sender", session.getId());
                chatMsg.put("time", LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
                
                // DB 저장
                Map<String, Object> params = new HashMap<>();
                params.put("roomId", roomId);
                params.put("senderId", session.getId());
                params.put("content", msg.get("content"));
                sqlSession.insert("insertChatMessage", params);

                // 브로드캐스트
                for (WebSocketSession s : sessions) {
                    if (room.getUserIds().contains(s.getId())) {
                        s.sendMessage(new TextMessage(chatMsg.toString()));
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
     
     private void leaveRoom(WebSocketSession session, JSONObject msg) {
        String roomId = msg.get("roomId").toString();
        ChatRoom room = chatRooms.get(roomId);
        if (room != null) {
            room.getUserIds().remove(session.getId());
            broadcastRoomList();
        }
     }    
}