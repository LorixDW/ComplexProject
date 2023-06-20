package com.complex.server.requests;

public record AddNotificationData(
        Integer eventId,
        String description,
        Integer days
) {}
