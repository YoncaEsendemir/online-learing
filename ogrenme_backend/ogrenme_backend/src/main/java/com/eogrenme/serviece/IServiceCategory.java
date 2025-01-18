package com.eogrenme.serviece;

import java.util.List;
import com.eogrenme.dto.DtoCategoryUI;


public interface IServiceCategory {

    public DtoCategoryUI addCategory(DtoCategoryUI category );
    
    public List<DtoCategoryUI> getAllCategory();

    public Boolean deleteCategoryById(Long id);

    public DtoCategoryUI updateCategoryById(Long id, DtoCategoryUI category);
}
