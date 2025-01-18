package com.eogrenme.entits;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name",nullable = false)
    private String name;

    @Column(name = "lastName",nullable = false)
    private String lastName;

    @Column(name = "profilImage")
    private String profilImage;

    @Column(unique = true, nullable = false, name = "email")
    private String email;

    @Column(name="bio")
    private String bio;

    @Column(name = "password",nullable = false)
    private String password;

    @Column(name = "role",nullable = false)
    private int role;

    @CreationTimestamp
    @Column(name = "createAt")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updateAt")
    private LocalDateTime updatedAt;

}
