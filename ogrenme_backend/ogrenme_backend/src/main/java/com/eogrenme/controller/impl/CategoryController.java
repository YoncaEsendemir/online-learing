package com.eogrenme.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eogrenme.controller.ICategoryController;
import com.eogrenme.dto.DtoCategoryUI;
import com.eogrenme.serviece.IServiceCategory;
import jakarta.validation.Valid;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rest/api/category")
public class CategoryController implements ICategoryController{

@Autowired
private IServiceCategory servieceCategory;

    @DeleteMapping("/delete-category/{id}")
    @Override
    public ResponseEntity<String> deleteCategoryById(@PathVariable(name="id",required = true) Long id) {
       if(servieceCategory.deleteCategoryById(id)!=null){
        String message= "Kategori Silindi";
        if(message!=null){
            return ResponseEntity.ok(message);
        }
       }
       return ResponseEntity.status(401).body("Geçersiz Kategori bilgileri");
    }

    @PostMapping("/save-category")
    @Override
    public DtoCategoryUI addCategory(@RequestBody @Valid DtoCategoryUI category) {
        return servieceCategory.addCategory(category);
    }

    @GetMapping("/all-category")
    @Override
    public List<DtoCategoryUI> getAllCategory() {
        return servieceCategory.getAllCategory();
    }

    @PutMapping("/update-category/{id}")
    @Override
    public DtoCategoryUI updateCategoryById(@PathVariable(name="id",required =true)Long id, @RequestBody @Valid DtoCategoryUI category) {
        return servieceCategory.updateCategoryById(id, category);
    }

}
