package com.youcode.cuisenio.features.auth.entity;

public enum Role {
    USER,
    ADMIN;


    public static Role getDefault() {
        return USER;
    }
}