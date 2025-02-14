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
    private Map<WebSocketSession, String> sessionUserIds = new HashMap<>();  // session별 userId 저장
    private Map<WebSocketSession, String> sessionCuid = new HashMap<>();     // 암호화된 token 저장
    private Map<WebSocketSession, String> sessionNicknames = new HashMap<>();  // session별 nickname 저장

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private SqlSession sqlSession;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("접속");
        sessions.add(session);
        System.out.println("접속성공");

        try {
            JSONObject message = new JSONObject();
            message.put("protocol", "CONNECTION_SUCCESS");
            session.sendMessage(new TextMessage(message.toString()));
        } catch (IOException e) {
            System.err.println("접속 성공 메시지 전송 실패: " + e.getMessage());
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            JSONObject msg = (JSONObject) new JSONParser().parse(message.getPayload());
            String protocol = msg.get("protocol").toString();
            switch(protocol) {
                case "AUTH": handleAuth(session, msg); break;
                case "REQUEST_ROOM_LIST": sendRoomList(session); break;
                case "CREATE_ROOM": createRoom(session, msg); break;
                case "JOIN_ROOM": joinRoom(session, msg); break;
                case "CHAT": handleChat(session, msg); break;
                case "LEAVE_ROOM": leaveRoom(session, msg); break;
            }
        } catch (ParseException e) {
            System.out.println("handle err:"+e.toString());
            e.printStackTrace();
        }
    }

    private void handleAuth(WebSocketSession session, JSONObject msg) {
        String cuid = msg.get("cuid").toString();
        String token = msg.get("token").toString();
        String nickname = msg.get("nickname").toString();  
        if (jwtTokenProvider.validateToken(token)) {
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            sessionUserIds.put(session, userId);      // 복호화된 userId 저장
            sessionCuid.put(session, cuid);        // 원본 token 저장
            sessionNicknames.put(session, nickname);  // nickname 저장
            try {
                JSONObject response = new JSONObject();
                response.put("protocol", "AUTH_SUCCESS");
                session.sendMessage(new TextMessage(response.toString()));
            } catch (IOException e) {
                e.printStackTrace();
            }
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
        sqlSession.insert("org.mybatis.chat.insertChatRoom", params);
    
        try {
            // 방 생성 성공 응답 전송
            JSONObject response = new JSONObject();
            response.put("protocol", "ROOM_CREATED");
            response.put("roomId", roomId);
            session.sendMessage(new TextMessage(response.toString()));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sendRoomList(WebSocketSession session) {
        try {
            System.out.println("sendRoomList: 방요청받음");
            List<Map> rooms = sqlSession.selectList("org.mybatis.chat.selectAllRooms");
            // JSONObject를 명시적으로 생성하고 데이터 추가
            JSONObject response = new JSONObject();
            response.put("protocol", "ROOM_LIST");
            response.put("rooms", rooms);
            
            // 전송 전 JSON 문자열 확인
            String jsonResponse = response.toString();
            System.out.println("Sending JSON: " + jsonResponse);
            
            session.sendMessage(new TextMessage(jsonResponse));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void broadcastRoomList() {
        try {
            List<Map> rooms = sqlSession.selectList("org.mybatis.chat.selectAllRooms");
            JSONObject message = new JSONObject(Map.of("protocol", "ROOM_LIST", "rooms", rooms));
            for (WebSocketSession s : sessions) {
                s.sendMessage(new TextMessage(message.toString()));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
     
    private void joinRoom(WebSocketSession session, JSONObject msg) {
        try {
            String roomId = msg.get("roomId").toString();
            
            // DB에서 방 정보 조회
            Map<String, Object> room = sqlSession.selectOne("org.mybatis.chat.selectRoomById", roomId);
            
            if (room != null) {
                // 새로운 ChatRoom 객체 생성 및 메모리에 저장
                if (!chatRooms.containsKey(roomId)) {
                    ChatRoom chatRoom = new ChatRoom(
                        roomId,
                        room.get("name").toString(),
                        room.get("type").toString(),
                        Integer.parseInt(room.get("maxUsers").toString()),
                        room.get("imageUrl").toString(),
                        new HashSet<>()
                    );
                    chatRooms.put(roomId, chatRoom);
                }
                
                ChatRoom chatRoom = chatRooms.get(roomId);
                
                // 인원 수 체크
                if (chatRoom.getUserIds().size() < chatRoom.getMaxUsers()) {
                    chatRoom.getUserIds().add(session.getId());
                    
                    List<Map<String, Object>> chatHistory = sqlSession.selectList("org.mybatis.chat.selectMessagesByRoomId", roomId);
                    System.out.println("채팅 히스토리: " + chatHistory);  // 채팅 히스토리 로그

                    // 입장 성공 메시지 전송
                    JSONObject response = new JSONObject();
                    response.put("protocol", "JOIN_ROOM_SUCCESS");
                    response.put("roomId", roomId);
                    response.put("chatHistory", chatHistory);

                    String responseStr = response.toString();
                    System.out.println("전송할 메시지: " + responseStr);  // 전송할 메시지 로그
                    
                    session.sendMessage(new TextMessage(response.toString()));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
     
    private void handleChat(WebSocketSession session, JSONObject msg) {
        try {
            String roomId = msg.get("roomId").toString();
            ChatRoom room = chatRooms.get(roomId);
            String userId = sessionUserIds.get(session);      // DB 저장용 복호화된 userId
            String cuid = sessionCuid.get(session);        // 클라이언트 전송용 token
            String nickname = sessionNicknames.get(session);

            if (room != null && room.getUserIds().contains(session.getId())) {
                JSONObject chatMsg = new JSONObject();
                chatMsg.put("protocol", "CHAT");
                chatMsg.put("roomId", roomId);
                chatMsg.put("content", msg.get("content"));
                chatMsg.put("senderCuid", cuid);              // 발송한 uid전송
                chatMsg.put("senderNickname", nickname);
                chatMsg.put("time", LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
                
                // DB 저장
                Map<String, Object> params = new HashMap<>();
                params.put("roomId", roomId);
                params.put("senderId", cuid);
                params.put("content", msg.get("content"));
                params.put("senderNickname", nickname);
                sqlSession.insert("org.mybatis.chat.insertChatMessage", params);

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
            //broadcastRoomList();
        }
    }    
}