package com.youcode.cuisenio.features.auth.service;

import com.youcode.cuisenio.features.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    Page<User> listUsers(Pageable pageable);
    void blockUser(Long userId);
    void unblockUser(Long userId);
    void deleteUser(Long userId);
}