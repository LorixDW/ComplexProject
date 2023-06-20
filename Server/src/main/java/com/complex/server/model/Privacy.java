package com.complex.server.model;

public enum Privacy {
    OPEN("open", 1),
    HALF_OPEN("Полуоткрытое", 2),
    PRIVATE("Закрытое", 3);
    private final String title;
    private final Integer id;
    Privacy(String title, Integer id ){
        this.title = title;
        this.id = id;
    }

    @Override
    public String toString() {
        return title;
    }
}
