package com.youcode.cuisenio.features.auth.mapper;

import com.youcode.cuisenio.features.auth.dto.admin.UserDto;
import com.youcode.cuisenio.features.auth.dto.auth.response.RegisterResponse;
import com.youcode.cuisenio.features.auth.dto.auth.request.RegisterRequest;
import com.youcode.cuisenio.features.auth.dto.profile.response.ProfileResponse;
import com.youcode.cuisenio.features.auth.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    RegisterResponse userToRegisterResponse(User user);

    User registerRequestToUser(RegisterRequest registerRequest);

//    @Mapping(target = "id", source = "id")
//    @Mapping(target = "username", source = "username")
//    @Mapping(target = "lastName", source = "lastName")
//    @Mapping(target = "email", source = "email")
//    @Mapping(target = "registrationDate", source = "registrationDate")
    ProfileResponse userToProfileResponse(User user);

//    @Mapping(target = "id", source = "id")
//    @Mapping(target = "username", source = "username")
//    @Mapping(target = "lastName", source = "lastName")
//    @Mapping(target = "email", source = "email")
//    @Mapping(target = "registrationDate", source = "registrationDate")
    UserDto userToUserDto(User user);


}