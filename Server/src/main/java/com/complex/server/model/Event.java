package com.complex.server.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id", nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String summary;

    @Column(nullable = false)
    private String description;

    private String place;

    @Column(nullable = false)
    private LocalDateTime start;

    @Column(nullable = false, name = "\"end\"")
    private LocalDateTime end;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Privacy privacy;

    @Column(nullable = false)
    private Boolean deleted;

    @JoinColumn(nullable = false)
    @ManyToOne
    private User creator;

    @OneToMany(mappedBy = "event")
    private List<Participant> participants;

    @OneToMany(mappedBy = "event")
    private List<Application> applications;

    public Event(String title, String summary, String description, String place, LocalDateTime start, LocalDateTime end, Privacy privacy, Boolean deleted, User creator) {
        this.title = title;
        this.summary = summary;
        this.description = description;
        this.place = place;
        this.start = start;
        this.end = end;
        this.privacy = privacy;
        this.deleted = deleted;
        this.creator = creator;
        this.participants = new ArrayList<>();
        this.applications = new ArrayList<>();
    }
}
