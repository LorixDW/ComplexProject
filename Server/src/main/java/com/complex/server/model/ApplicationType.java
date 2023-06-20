package com.complex.server.model;

public enum ApplicationType {
    APPLICATION("Заявка на вступление"),
    INVITE("Приглашение");
    private String title;
    private ApplicationType(String title){
        this.title = title;
    }
    @Override
    public String toString() {
        return this.title;
    }
}
