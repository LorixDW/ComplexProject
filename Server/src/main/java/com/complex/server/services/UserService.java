package com.complex.server.services;

import com.complex.server.model.Role;
import com.complex.server.model.User;
import com.complex.server.repositories.RoleRepository;
import com.complex.server.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository){
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public List<User> GetAllUsers(){
        return userRepository.findAll();
    }
    public List<Role> GetAllRoles(){
        return roleRepository.findAll();
    }
    public Role GetRoleByID(Integer id){
        return roleRepository.findAll().stream().filter(r -> Objects.equals(r.getId(), id)).findFirst().orElse(null);
    }
    public Integer AddUser(User user){
        if(user.getLName() != null && user.getFName() != null && user.getPatronymic() != null && user.getPhone() != null && user.getEmail() != null && user.getPassword() != null && user.getRole() != null){
            if(userRepository.findAll().stream().noneMatch(u -> Objects.equals(u.getEmail(), user.getEmail()))){
                userRepository.save(user);
                return 200;
            }
            else {
                return 409;
            }
        }
        else {
            return 400;
        }
    }
    public Integer SaveUser(User user){
        if(userRepository.findAll().stream().noneMatch(u -> Objects.equals(u.getId(), user.getId()))){
            return 404;
        }
        else {
            if(userRepository.findAll().stream().noneMatch(u -> Objects.equals(u.getEmail(), user.getEmail()) && !Objects.equals(u.getId(), user.getId()))){
                userRepository.save(user);
                return 200;
            }
            else {
                return 409;
            }
        }
    }
    public List<User> GetRoleUsers(Role role){
        return userRepository.findAll().stream().filter(user -> Objects.equals(user.getRole().getId(), role.getId())).collect(Collectors.toList());
    }
    public User GetUserByID(Integer id){
        return userRepository.findAll().stream().filter(user -> Objects.equals(user.getId(), id)).findFirst().orElse(null);
    }
    public User GetUserByEmailAndPassword(String email, String password){
        return userRepository.findAll().stream().filter(user -> Objects.equals(user.getEmail(), email) && Objects.equals(user.getPassword(), password)).findFirst().orElse(null);
    }
    public User GetByEmail(String email){
        return userRepository.findByEmail(email);
    }
}
