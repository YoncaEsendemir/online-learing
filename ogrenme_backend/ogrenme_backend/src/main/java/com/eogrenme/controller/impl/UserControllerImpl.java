package com.eogrenme.controller.impl;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.eogrenme.MultipartUpload.UploadUserProfil;
import com.eogrenme.controller.IUserController;
import com.eogrenme.dto.DtoUser;
import com.eogrenme.dto.DtoUserIdEmail;
import com.eogrenme.dto.DtoUserUI;
import com.eogrenme.serviece.IServiceUser;


import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rest/api/user")
public class UserControllerImpl implements IUserController {

    @Autowired
    private IServiceUser servieceUser;
    @Autowired
    ObjectMapper objectMapper;



    @PostMapping(value = "/save")
    @Override
    public  ResponseEntity<DtoUser>  userSave( @RequestBody @Valid DtoUserUI user) {
     try{
         // kullanıcı kayit et 
         DtoUser dtoUser= servieceUser.userSave(user);
         if (dtoUser == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(dtoUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping(path = "/list")
    @Override
    public List<DtoUser> getAllUserList() {
        return servieceUser.getAllUserList();
    }

    @PostMapping("/login")
    @Override
    public ResponseEntity<DtoUserIdEmail> login(@RequestBody DtoUserUI user) {
        DtoUserIdEmail dtoUserIdEmail = servieceUser.checkUserRole(user.getEmail(), user.getPassword());
        if (dtoUserIdEmail == null) {
            return ResponseEntity.badRequest().build();
        } else {
            return ResponseEntity.ok(dtoUserIdEmail);
        }
    }

    @DeleteMapping("/delet/{id}")
    @Override
    public ResponseEntity<String> deleteUserById(@PathVariable(name = "id", required = true) Long id) {
        if (servieceUser.deleteUserById(id) != null) {
            String message = "Kullanici Silindi";
            if (message != null) {
                return ResponseEntity.ok(message);
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/list/{id}")
    @Override
    public DtoUser findUserById(@PathVariable(name = "id", required = true) Long id) {
        return servieceUser.findUserById(id);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> updateUserById(
            @PathVariable(name = "id", required = true) Long id,
            @RequestPart(value = "user") @Valid String userJson,
            @RequestPart(value = "profilImage", required = false) MultipartFile profilImage) {
        try {
            DtoUser user = objectMapper.readValue(userJson, DtoUser.class);

            String uploadProfilUrl = null;
            if (profilImage != null && !profilImage.isEmpty()) {
                uploadProfilUrl = UploadUserProfil.uploadFile(profilImage);
                user.setProfilImage(uploadProfilUrl);
            }

            if (servieceUser.updateUserById(id, user)) {
                return ResponseEntity.ok("Kullanici Güncellendi");
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}

