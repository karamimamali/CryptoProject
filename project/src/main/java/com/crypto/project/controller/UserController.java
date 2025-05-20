package com.crypto.project.controller;


import com.crypto.project.dao.entity.User;
import com.crypto.project.dto.response.UserResponseDTO;
import com.crypto.project.mapper.UserMapper;
import com.crypto.project.service.UserService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/users")
public class UserController {
    UserService userService;
    UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) auth.getPrincipal();

        return ResponseEntity.ok(userMapper.toUserResponseDTO(currentUser));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<User> users = userService.allUsers();

        List<UserResponseDTO> responseUsers = users.stream().map(userMapper::toUserResponseDTO).collect(Collectors.toList());

        return ResponseEntity.ok(responseUsers);
    }

}

