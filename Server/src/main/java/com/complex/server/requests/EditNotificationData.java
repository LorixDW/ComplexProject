package com.complex.server.requests;

public record EditNotificationData(
        Long id,
        String description,
        Integer days
) {}
