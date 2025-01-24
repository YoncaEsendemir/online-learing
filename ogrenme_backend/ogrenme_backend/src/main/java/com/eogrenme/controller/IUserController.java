package com.eogrenme.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.eogrenme.dto.DtoSearchCriteria;
import com.eogrenme.dto.DtoUser;
import com.eogrenme.dto.DtoUserIdEmail;
import com.eogrenme.dto.DtoUserUI;

public interface IUserController {

    public ResponseEntity<DtoUser> userSave(DtoUserUI user);

    public ResponseEntity<DtoUserIdEmail> login(DtoUserUI user);

     public List<DtoUser> getAllUserList();

     public DtoUser findUserById(Long id);

     public ResponseEntity<String> deleteUserById(Long id);

     public ResponseEntity<String> updateUserById(Long id, String userJson, MultipartFile profilImage);

     public ResponseEntity<List<DtoUser>>searchUsers(DtoSearchCriteria criteria);

}
