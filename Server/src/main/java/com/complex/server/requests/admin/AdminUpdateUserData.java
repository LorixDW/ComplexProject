package com.complex.server.requests.admin;

public record AdminUpdateUserData(
        String oldEmail,
        String lName,
        String fName,
        String patronymic,
        String phone,
        String email
) { }
