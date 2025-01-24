package com.eogrenme.controller;
import com.eogrenme.dto.CourseSearchCriteria;
import com.eogrenme.dto.DtoCourseUI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ICourseController {
    
    ResponseEntity<DtoCourseUI> addCourse(String courseJson, MultipartFile imageFile, MultipartFile videoFile);
    
    ResponseEntity<DtoCourseUI> updateCourse(Long id, String courseJson, MultipartFile imageFile);

   
    ResponseEntity<String> deleteCourse(Long id);


    ResponseEntity<List<DtoCourseUI>> getAllCourses();

  
    ResponseEntity<DtoCourseUI> getCourseById( Long id);

    ResponseEntity<List<DtoCourseUI>>searchCourses(CourseSearchCriteria criteria);
}
