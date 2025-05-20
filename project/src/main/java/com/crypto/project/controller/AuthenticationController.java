package com.crypto.project.controller;


import com.crypto.project.dao.entity.User;
import com.crypto.project.dto.request.LoginUserRequestDTO;
import com.crypto.project.dto.request.RegisterUserRequestDTO;
import com.crypto.project.dto.response.LoginUserResponseDTO;
import com.crypto.project.dto.response.SignupUserResponseDTO;
import com.crypto.project.mapper.UserMapper;
import com.crypto.project.service.AuthenticationService;
import com.crypto.project.util.JwtService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/auth")
public class AuthenticationController {
    JwtService jwtService;
    AuthenticationService authenticationService;
    UserMapper userMapper;

    @PostMapping("/signup")
    public ResponseEntity<SignupUserResponseDTO> register(@RequestBody RegisterUserRequestDTO registerUserRequestDTO) {
        SignupUserResponseDTO registeredUser = authenticationService.signup(registerUserRequestDTO);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponseDTO> login(@RequestBody LoginUserRequestDTO loginUserRequestDTO) {
        User authenticatedUser = authenticationService.authenticate(loginUserRequestDTO);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginUserResponseDTO loginUserResponseDTO = new LoginUserResponseDTO(jwtToken, jwtService.getExpirationTime());

        return ResponseEntity.status(HttpStatus.OK).body(loginUserResponseDTO);
    }
}
