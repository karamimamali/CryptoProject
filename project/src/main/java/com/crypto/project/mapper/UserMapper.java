package com.crypto.project.mapper;


import com.crypto.project.dao.entity.User;
import com.crypto.project.dto.response.LoginUserResponseDTO;
import com.crypto.project.dto.response.SignupUserResponseDTO;
import com.crypto.project.dto.response.UserResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    LoginUserResponseDTO toLoginUserResponseDTO(User user);
    SignupUserResponseDTO toSignupUserResponseDTO(User user);
    UserResponseDTO toUserResponseDTO(User user);
}
