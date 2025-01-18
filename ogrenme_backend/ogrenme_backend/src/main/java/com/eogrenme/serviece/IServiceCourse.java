package com.eogrenme.serviece;

import java.util.List;
import com.eogrenme.dto.DtoCourseUI;

public interface IServiceCourse {

    DtoCourseUI addCourse(DtoCourseUI course, String videoUrl);
    DtoCourseUI updateCourse(Long id, DtoCourseUI course);
    boolean deleteCourse(Long id);
    List<DtoCourseUI> getAllCourses();
    DtoCourseUI getCourseById(Long id);
}
