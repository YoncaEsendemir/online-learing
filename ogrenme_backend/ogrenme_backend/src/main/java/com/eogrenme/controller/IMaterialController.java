package com.eogrenme.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import com.eogrenme.dto.DtoCourseMaterialUI;

public interface IMaterialController {

    ResponseEntity<String> deleteMaterial(Long id);

    ResponseEntity<DtoCourseMaterialUI> updateMaterial(Long id, DtoCourseMaterialUI materialUI);

    ResponseEntity<List<DtoCourseMaterialUI>> getMaterials(Long id);

}