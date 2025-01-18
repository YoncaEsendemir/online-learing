package com.eogrenme.serviece;
import java.util.List;
import com.eogrenme.dto.DtoUser;
import com.eogrenme.dto.DtoUserIdEmail;
import com.eogrenme.dto.DtoUserUI;


public interface IServiceUser {

    public DtoUser userSave(DtoUserUI user);

    public List<DtoUser> getAllUserList();

    public Boolean login(String email, String password);
    
    public DtoUserIdEmail checkUserRole(String email, String password);

    public DtoUser findUserById(Long id);
    
    public Boolean deleteUserById(Long id);

    public Boolean updateUserById(Long id , DtoUser user);
}
