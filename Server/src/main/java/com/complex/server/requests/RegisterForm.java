package com.complex.server.requests;

public record RegisterForm(
        String lName,
        String fName,
        String patronymic,
        String phone,
        String email,
        String password,
        Integer roleId
) {}
