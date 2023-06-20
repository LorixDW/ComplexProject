package com.complex.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "\"user\"")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String lName;

    @Column(nullable = false)
    private String fName;

    @Column(nullable = false)
    private String patronymic;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    private String emailCheckCode;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Role role;

    @OneToMany(mappedBy = "creator")
    private List<Event> events;

    @OneToMany(mappedBy = "user")
    private List<Participant> participants;

    @OneToMany(mappedBy = "user")
    private List<Application> applications;

    public User(String lName, String fName, String patronymic, String phone, String email, String password, Role role) {
        this.lName = lName;
        this.fName = fName;
        this.patronymic = patronymic;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.role = role;
        this.events = new ArrayList<>();
        this.participants = new ArrayList<>();
        this.applications = new ArrayList<>();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getName()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
