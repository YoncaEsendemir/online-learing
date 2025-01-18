package com.eogrenme.repository;

import com.eogrenme.entits.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IRepositoryUser extends JpaRepository<User,Long>{

    Optional <User> findByEmailAndPassword(String email, String password);
}
