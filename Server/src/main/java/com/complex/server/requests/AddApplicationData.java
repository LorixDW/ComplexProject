package com.complex.server.requests;

import com.complex.server.model.ApplicationType;

public record AddApplicationData(
   String email,
   Integer eventId,
   String message,
   ApplicationType type
) {}
