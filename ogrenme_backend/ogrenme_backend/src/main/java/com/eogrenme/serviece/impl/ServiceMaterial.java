package com.eogrenme.serviece.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eogrenme.dto.DtoCourseMaterialUI;
import com.eogrenme.entits.Course;
import com.eogrenme.entits.CourseMaterial;
import com.eogrenme.repository.IRepositoryCourse;
import com.eogrenme.repository.IRepositoryCourseMaterialRepository;
import com.eogrenme.serviece.IServiceMaterial;

@Service
public class ServiceMaterial implements IServiceMaterial {

    @Autowired
    IRepositoryCourseMaterialRepository materialRepository;

    @Autowired
    IRepositoryCourse courseRepository;

    @Override
    public Boolean deteletMaterial(Long id) {
        // id var olup olmadığına bakılıyor
        if (id != null) {
            // materal tabloda veri olup olmadığına bakılıyor varsa optional içine atıyoruz
            Optional<CourseMaterial> optional = materialRepository.findById(id);
            if (optional.isPresent()) {
                CourseMaterial deleteMaterial = optional.get();
                // veri tabınından sılınıyor
                materialRepository.delete(deleteMaterial);
                return true;
            }
        }
        return false;
    }

    @Override
    public List<DtoCourseMaterialUI> getMaterialsByCourseId(Long coursId) {
        if (coursId == null) {
            return null;
        }
        Course course = courseRepository.findById(coursId)
                // orElseThrow devreye girer ve bir IllegalArgumentException hatası fırlatır.
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + coursId));
        return course.getMaterials().stream()
                .map(this::ConvertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DtoCourseMaterialUI updateMaterial( Long materialId, DtoCourseMaterialUI materialUI) {
        
        CourseMaterial material = materialRepository.findById(materialId)
          .orElseThrow(() -> new IllegalArgumentException("Material not found: " + materialId));
                   
        material.setTitle(materialUI.getTitle());
        material.setType(materialUI.getType());

        material = materialRepository.save(material);
        return ConvertToDto(material);

        /* 
        DtoCourseMaterialUI dtoCourseMaterialUI = new DtoCourseMaterialUI();
        Optional <CourseMaterial>optional= materialRepository.findById(materialId);
        if(optional.isPresent()){
         CourseMaterial dbMaterial = optional.get();
         dbMaterial.setTitle(materialUI.getTitle());
         dbMaterial.setType(materialUI.getType());
        CourseMaterial updateMaterial = materialRepository.save(dbMaterial);
        BeanUtils.copyProperties(updateMaterial,dtoCourseMaterialUI);
         return dtoCourseMaterialUI;
        }
        return null;*/
    }


    private DtoCourseMaterialUI ConvertToDto(CourseMaterial material) {
        DtoCourseMaterialUI dto = new DtoCourseMaterialUI();
        dto.setId(material.getId());
        dto.setTitle(material.getTitle());
        dto.setType(material.getType());

        return dto;
    }

}
