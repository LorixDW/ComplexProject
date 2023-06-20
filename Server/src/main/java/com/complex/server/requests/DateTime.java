package com.complex.server.requests;

public record DateTime(
        Integer year,
        Integer month,
        Integer day,
        Integer hour,
        Integer minute
) {}
