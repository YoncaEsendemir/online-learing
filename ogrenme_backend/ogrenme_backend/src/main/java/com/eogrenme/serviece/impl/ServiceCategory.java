package com.eogrenme.serviece.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.eogrenme.entits.Category;
import com.eogrenme.dto.DtoCategoryUI;
import com.eogrenme.repository.IRepositoryCategory;
import com.eogrenme.serviece.IServiceCategory;

@Repository
public class ServiceCategory implements IServiceCategory {

@Autowired
private IRepositoryCategory repositoryCategory;

@Override
public Boolean deleteCategoryById(Long id) {
   if(id==null){
    return null;
   }
   Optional<Category> optional= repositoryCategory.findById(id);
   if(optional.isEmpty()){
    return null;
   }
   repositoryCategory.delete(optional.get());
   return true;
}

@Override
public DtoCategoryUI addCategory(DtoCategoryUI category) {
    DtoCategoryUI dtoCategoryUI =new DtoCategoryUI();
    Category categorydb = new Category();
    BeanUtils.copyProperties(category,categorydb);
    Category dBcategory=repositoryCategory.save(categorydb);
    BeanUtils.copyProperties(dBcategory, dtoCategoryUI);
    return dtoCategoryUI;
}

@Override
public List<DtoCategoryUI> getAllCategory() {
  List <DtoCategoryUI> dtoCategoryUI=new ArrayList<>();
  List<Category> categoryList= new ArrayList<>();
     categoryList = repositoryCategory.findAll();
    for(Category cate : categoryList ){
         DtoCategoryUI dtocate = new DtoCategoryUI();
        BeanUtils.copyProperties(cate,dtocate);
        dtoCategoryUI.add(dtocate);
    } 
    return dtoCategoryUI;
}

@Override
public DtoCategoryUI updateCategoryById(Long id, DtoCategoryUI category) {
   // önce id bul sonra optionali nesnesine atta ve set ile güncelle  
   DtoCategoryUI dtoCategoryUI =new DtoCategoryUI();
   if(id == null || category == null){
    return null;
   }
   // ID ile ilgili kategoriyi bulmaya çalış
   Optional<Category> optional=repositoryCategory.findById(id);
   if(optional.isEmpty()){
    return null;
   }
   Category dbCategory=optional.get();
   // Veritabanındaki kategoriyi DTO'dan gelen verilerle güncelle
    dbCategory.setName(category.getName());
    dbCategory.setDescription(category.getDescription());
    Category updatedCategory= repositoryCategory.save(dbCategory);
    //Güncellenmiş kategori verilerini DTO sınıfına kolayca kopyalamak için kullanılıyor.
    BeanUtils.copyProperties(updatedCategory,dtoCategoryUI);
    return dtoCategoryUI;
}



}
