package com.eogrenme.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DtoUserUI {

    @NotEmpty(message = "Firsname alanı boşbırakılamaz")
    @Size(min = 3, max = 15, message = "content must be at most 15 characters, and has at least 3 character")
    private String name;

    @NotEmpty(message = "Soyad alanı boşbırakılamaz")
    @Size(min = 3, max = 15, message = "content must be at most 15 characters, and has at least 3 character")
    private String lastName;

    private String profilImage;

    @NotEmpty(message = "email alanı boşbırakılamaz")
    @Size(min =10, max = 15, message = "content must be at most 15 characters, and has at least ten character")
    private String email;

    @NotEmpty(message = "Şifre alanı boşbırakılamaz")
    @Size(min =3, max = 10, message = "content must be at most 10 characters, and has at least one character")
    private String password;
   
    private int role;
}
