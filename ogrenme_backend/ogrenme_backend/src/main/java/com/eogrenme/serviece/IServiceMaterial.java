package com.eogrenme.serviece;

import java.util.List;

import com.eogrenme.dto.DtoCourseMaterialUI;

public interface IServiceMaterial {

  //List <DtoCourseMaterialUI> getAllMaterial();

  Boolean deteletMaterial(Long id);

  DtoCourseMaterialUI updateMaterial(Long materialId , DtoCourseMaterialUI materialUI);

  List <DtoCourseMaterialUI> getMaterialsByCourseId(Long coursId);
}
