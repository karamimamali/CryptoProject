package com.crypto.project.service;


import com.crypto.project.dao.entity.User;
import com.crypto.project.dao.repository.UserRepository;
import com.crypto.project.dto.request.LoginUserRequestDTO;
import com.crypto.project.dto.request.RegisterUserRequestDTO;
import com.crypto.project.dto.response.SignupUserResponseDTO;
import com.crypto.project.mapper.UserMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    AuthenticationManager authenticationManager;
    UserMapper userMapper;

    public SignupUserResponseDTO signup(RegisterUserRequestDTO input) {

        User user = new User()
                .setUsername(input.username())
                .setPublicKey(input.publicKey())
                .setPassword(passwordEncoder.encode(input.password()));
        User savedUser = userRepository.save(user);

        return userMapper.toSignupUserResponseDTO(savedUser);
    }

    public User authenticate(LoginUserRequestDTO input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.username(),
                        input.password()
                )
        );

        return userRepository.findByUsername(input.username())
                .orElseThrow();
    }
}

