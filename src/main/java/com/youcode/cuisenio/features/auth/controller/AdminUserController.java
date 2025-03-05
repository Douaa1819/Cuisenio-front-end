package com.youcode.cuisenio.features.auth.controller;


import com.youcode.cuisenio.features.auth.dto.admin.UserDto;
import com.youcode.cuisenio.features.auth.mapper.UserMapper;
import com.youcode.cuisenio.features.auth.service.AdminUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/admin/users")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final UserMapper userMapper;

    public AdminUserController(AdminUserService adminUserService, UserMapper userMapper) {
        this.adminUserService = adminUserService;
        this.userMapper = userMapper;
    }

    @GetMapping
    public ResponseEntity<Page<UserDto>> listUsers(Pageable pageable) {
        Page<UserDto> userDtos = adminUserService.listUsers(pageable)
                .map(userMapper::userToUserDto);
        return ResponseEntity.ok(userDtos);
    }

    @PutMapping("/{userId}/block")
    public ResponseEntity<Void> blockUser(@PathVariable Long userId) {
        adminUserService.blockUser(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/unblock")
    public ResponseEntity<Void> unblockUser(@PathVariable Long userId) {
        adminUserService.unblockUser(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminUserService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}