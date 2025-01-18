package com.eogrenme.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eogrenme.controller.IEnrollmentController;
import com.eogrenme.dto.DtoEnrollment;
import com.eogrenme.serviece.IServiceEnrollment;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rest/api/enrollment")
public class EnrollmentController implements IEnrollmentController{

@Autowired  IServiceEnrollment serviceEnrollment;

    @Override
    @PostMapping("/save")
    public ResponseEntity<DtoEnrollment> saveEnrollment(@RequestBody DtoEnrollment enrollmentDto) {
        DtoEnrollment savedEnrollment = serviceEnrollment.saveEnrollment(enrollmentDto);
        if (savedEnrollment != null) {
            return ResponseEntity.ok(savedEnrollment);
        }
        return ResponseEntity.badRequest().build();
    }

    @Override
    @GetMapping("/getAll")
    public ResponseEntity<List<DtoEnrollment>> gelAllEnrollment() {
        List<DtoEnrollment> enrollments = serviceEnrollment.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }

    @Override
    @GetMapping("/getByCourse/{id}")
    public ResponseEntity<List<DtoEnrollment>> getEnrollmentByCourseId(@PathVariable Long id) {
        List<DtoEnrollment> enrollments = serviceEnrollment.getEnrollmentsByCourseId(id);
        return ResponseEntity.ok(enrollments);
    }

    @Override
    @GetMapping("/getByUser/{id}")
    public ResponseEntity<List<DtoEnrollment>> getEnrollmentByUserId(@PathVariable Long id) {
        List<DtoEnrollment> enrollments = serviceEnrollment.getEnrollmentsByUserId(id);
        return ResponseEntity.ok(enrollments);
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteEnrollment(@PathVariable Long id) {
        Boolean deleted = serviceEnrollment.deleteEnrollment(id);
        if (deleted) {
            return ResponseEntity.ok("Enrollment deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    // Additional method to get enrollment by ID
    @GetMapping("/getById/{id}")
    public ResponseEntity<DtoEnrollment> getEnrollmentById(@PathVariable Long id) {
        DtoEnrollment enrollment = serviceEnrollment.getEnrollmentById(id);
        if (enrollment != null) {
            return ResponseEntity.ok(enrollment);
        }
        return ResponseEntity.notFound().build();
    }

}
