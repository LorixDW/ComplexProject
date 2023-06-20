package com.complex.server.security.jwt;

public record SecondFactorData(
        String email,
        String code
) {}
