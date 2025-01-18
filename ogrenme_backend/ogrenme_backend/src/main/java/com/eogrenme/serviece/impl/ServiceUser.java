package com.eogrenme.serviece.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.eogrenme.entits.User;
import com.eogrenme.Md5.PasswordUtil;
import com.eogrenme.dto.DtoUser;
import com.eogrenme.dto.DtoUserIdEmail;
import com.eogrenme.dto.DtoUserUI;
import com.eogrenme.repository.IRepositoryUser;
import com.eogrenme.serviece.IServiceUser;

@Service
public class ServiceUser implements IServiceUser {

    @Autowired
    private IRepositoryUser repositoryUser;

    // id göre Kullanıcıyı getirir 
    @Override
    public DtoUser findUserById(Long id) {
        DtoUser dto = new DtoUser();
        Optional<User>optional = repositoryUser.findById(id);
        if(optional.isEmpty()){
            return null;
        }
       User userDb=optional.get();
       BeanUtils.copyProperties(userDb, dto);
        return dto;
    }

    // role kontrollu 
    @Override
    public DtoUserIdEmail checkUserRole(String email, String password) {
        String encryptedPassword = PasswordUtil.encryptWithMD5(password);
        Optional<User> userOptional = repositoryUser.findByEmailAndPassword(email, encryptedPassword);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            DtoUserIdEmail dtoUserIdEmail = new DtoUserIdEmail();
            BeanUtils.copyProperties(user,dtoUserIdEmail);
            if (user.getRole() == 1) {
                return dtoUserIdEmail;
            } else if (user.getRole() == 0) {
                return dtoUserIdEmail;
            }
        }
        return null; // Geçersiz giriş
    }

    // tüm kullanıcıları getirir
    //if ekle admin listelenmesin 
    @Override
    public List<DtoUser> getAllUserList() {
        List<DtoUser> dtoUserList = new ArrayList<>();
        List<User> userList = repositoryUser.findAll();
        for (User user : userList) {
            DtoUser dtoUser = new DtoUser();
            BeanUtils.copyProperties(user, dtoUser);
            dtoUserList.add(dtoUser);
        }
        return dtoUserList;
    }

    // Kullanıcı kayit etme method
    @Override
    public DtoUser userSave(DtoUserUI user) {
        // DtoUser class daki nesne tanımlıyoruz
        DtoUser dtoUser = new DtoUser();
        // User class daki nesne tanımlıyoruz
        User userdb = new User();
        // user veriler ve değerler userdb'ye copyalanıyor
        BeanUtils.copyProperties(user, userdb);
        // Şifreyi MD5 ile şifreliyoruz
        String encryptedPassword = PasswordUtil.encryptWithMD5(user.getPassword());
        userdb.setPassword(encryptedPassword);
        // Veritabanına kayit işlemi
        User dbUser = repositoryUser.save(userdb);
        // dbUser'daki değerleri dtoUser'e copyalıyoruz
        BeanUtils.copyProperties(dbUser, dtoUser);
        // değer geri dönüyor
        return dtoUser;
    }

    // Kullanıcı giriş method
    @Override
    public Boolean login(String email, String password) {
        String encryptedPassword = PasswordUtil.encryptWithMD5(password);
        Optional <User> user = repositoryUser.findByEmailAndPassword(email, encryptedPassword);
        return user.isPresent();
    }

    // Delete User SİLME method
    @Override
    public Boolean deleteUserById(Long id) {
        Optional<User>optional = repositoryUser.findById(id);
        if(optional.isPresent()){
            repositoryUser.delete(optional.get());
            return true;
        }
        return false;
    }

    @Override
    public Boolean updateUserById(Long id, DtoUser user) {

        if(id==null || user==null ){
            return null;
        }
        Optional<User> optional= repositoryUser.findById(id);
        if(optional.isEmpty()){
            return null;
        }
       // String encryptedPassword = PasswordUtil.encryptWithMD5(user.getPassword());
        User dbUser=optional.get();
        //veritabanındaki gelen verileri dto verileri ile güncelliyoruz
        dbUser.setName(user.getName());
        dbUser.setLastName(user.getLastName());
        dbUser.setProfilImage(user.getProfilImage());
        dbUser.setEmail(user.getEmail());
        dbUser.setBio(user.getBio());
        //md5 fonksiyondan geçir ve şifrele 
      //  String encryptedPassword = PasswordUtil.encryptWithMD5(user.getPassword());
      //  dbUser.setPassword(encryptedPassword);
        repositoryUser.save(dbUser);
        // Güncellenmiş Kullanıcı verilerini dto 
        return true;
    }

}
