package com.eogrenme.controller.impl;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eogrenme.controller.IMaterialController;
import com.eogrenme.dto.DtoCourseMaterialUI;
import com.eogrenme.serviece.IServiceMaterial;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rest/api/materal")
public class MaterialController implements IMaterialController {
    @Autowired
    IServiceMaterial serviceMaterial;

    @DeleteMapping("/delete/{id}")
    @Override
    public ResponseEntity<String> deleteMaterial(@PathVariable(name = "id", required = false) Long id) {
        if (serviceMaterial.deteletMaterial(id) != null) {
            String message = "Material Silindi";
            if (message != null) {
                return ResponseEntity.ok(message);
            }
        }
        return ResponseEntity.status(401).body("Geçersiz Kategori bilgileri");
    }
    
    @GetMapping("/getMaterial/{id}")
    @Override
    public ResponseEntity<List<DtoCourseMaterialUI>> getMaterials(
            @PathVariable(name = "id", required = true) Long id) {
                List<DtoCourseMaterialUI> materialList = serviceMaterial.getMaterialsByCourseId(id);
       
        return ResponseEntity.ok(materialList);
    }

    @PutMapping("/update/{id}")
    @Override
    public ResponseEntity<DtoCourseMaterialUI> updateMaterial(@PathVariable(name="id",required = true) Long id, @RequestBody DtoCourseMaterialUI materialUI) {
        if(id==null){
            return ResponseEntity.status(401).body(null);
        }
      DtoCourseMaterialUI dtoMaterialUI= serviceMaterial.updateMaterial(id, materialUI);
        return ResponseEntity.ok(dtoMaterialUI);
    }

}
