package com.eogrenme.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.eogrenme.dto.DtoCategoryUI;

public interface ICategoryController {

    
    public DtoCategoryUI addCategory(DtoCategoryUI category );
    
    public List<DtoCategoryUI> getAllCategory();

    public ResponseEntity<String> deleteCategoryById(Long id);

    public DtoCategoryUI updateCategoryById(Long id, DtoCategoryUI category);
}
