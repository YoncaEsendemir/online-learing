package com.eogrenme.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.eogrenme.MultipartUpload.UploadFileMulti;
import com.eogrenme.MultipartUpload.UploadFileVideoMulti;
import com.eogrenme.controller.ICourseController;
import com.eogrenme.dto.CourseSearchCriteria;
import com.eogrenme.dto.DtoCourseUI;
import com.eogrenme.serviece.IServiceCourse;

import jakarta.annotation.PostConstruct;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rest/api/course")
public class CourseController implements ICourseController {

    @Autowired
    IServiceCourse iServieceCourse;
    
    @Autowired
    ObjectMapper objectMapper;

    @PostConstruct
    public void setup() {
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DtoCourseUI> addCourse(
            @RequestPart(value = "course") String courseJson,
            @RequestPart(value = "imageUrl") MultipartFile imageFile,
            @RequestPart(value ="url") MultipartFile videoFile) {
        try {
            DtoCourseUI course = objectMapper.readValue(courseJson, DtoCourseUI.class);

            String uploadedUrl = UploadFileMulti.uploadFile(imageFile);
            course.setImageUrl(uploadedUrl);

            String uploadVideoUrl = UploadFileVideoMulti.uploadVideoFile(videoFile);
        
            DtoCourseUI dtoCourseUI = iServieceCourse.addCourse(course, uploadVideoUrl);
            if (dtoCourseUI == null) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(dtoCourseUI);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping(value="/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> deleteCourse(@PathVariable(name="id", required = true) Long id) {
        if(iServieceCourse.deleteCourse(id)) {
            return ResponseEntity.ok("Kurs Silindi");
        }
        return ResponseEntity.status(404).body("Kurs bulunamadı");
    }

    @GetMapping("/getAll")
    @Override
    public ResponseEntity<List<DtoCourseUI>> getAllCourses() {
        List<DtoCourseUI> courses = iServieceCourse.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/getById/{id}")
    @Override
    public ResponseEntity<DtoCourseUI> getCourseById(@PathVariable Long id) {
        DtoCourseUI course = iServieceCourse.getCourseById(id);
        if (course != null) {
            return ResponseEntity.ok(course);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    @Override
    public ResponseEntity<DtoCourseUI> updateCourse(
            @PathVariable Long id, 
            @RequestPart(value = "course") String courseJson,
            @RequestPart(value = "imageUrl", required = false) MultipartFile imageFile) {
        try {
            DtoCourseUI courseDto = objectMapper.readValue(courseJson, DtoCourseUI.class);

            if (imageFile != null && !imageFile.isEmpty()) {
                String uploadedUrl = UploadFileMulti.uploadFile(imageFile);
                courseDto.setImageUrl(uploadedUrl);
            }

            DtoCourseUI updatedCourse = iServieceCourse.updateCourse(id, courseDto);
            if (updatedCourse == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(updatedCourse);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

        @PostMapping("/search")
    public ResponseEntity<List<DtoCourseUI>> searchCourses(@RequestBody CourseSearchCriteria criteria) {
        List<DtoCourseUI> courses = iServieceCourse.searchCourses(criteria);
        return ResponseEntity.ok(courses);
    }
}

