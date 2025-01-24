package com.eogrenme.repository;

import com.eogrenme.entits.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IRepositoryUser extends JpaRepository<User,Long>{

    Optional <User> findByEmailAndPassword(String email, String password);

    @Query("SELECT u FROM User u WHERE u.name LIKE %:username% OR u.email LIKE %:email%")
    List<User> searchUsers(@Param("username") String username, @Param("email") String email);
}
