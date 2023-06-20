package com.complex.server.requests;

public record EditEvent(
   Integer id,
   String title,
   String summary,
   String description,
   String place,
   DateTime start,
   DateTime end
) {}
