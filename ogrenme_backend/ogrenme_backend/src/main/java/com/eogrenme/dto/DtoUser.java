package com.eogrenme.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class DtoUser {

    private Long id;
    @NotEmpty(message = "Ad alanı boşbırakılamaz")
    @Size(min = 3, max = 15, message = "content must be at most 15 characters, and has at least 3 character")
    private String name;
    @NotEmpty(message = "Soyad alanı boşbırakılamaz")
    @Size(min = 3, max = 20, message = "content must be at most 15 characters, and has at least 3 character")
    private String lastName;
    
    private String profilImage;

    @NotEmpty(message = "email alanı boşbırakılamaz")
    @Size(min =10, max = 15, message = "content must be at most 15 characters, and has at least ten character")
    private String email;

    private String bio;

    private int role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
