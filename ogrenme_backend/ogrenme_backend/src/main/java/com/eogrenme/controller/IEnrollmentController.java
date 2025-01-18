package com.eogrenme.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.eogrenme.dto.DtoEnrollment;

public interface IEnrollmentController {

    ResponseEntity<DtoEnrollment> saveEnrollment(DtoEnrollment enrollmentDto);

    ResponseEntity <List <DtoEnrollment>> gelAllEnrollment();

    ResponseEntity <List <DtoEnrollment>> getEnrollmentByCourseId(Long id);

    ResponseEntity <List <DtoEnrollment>> getEnrollmentByUserId(Long id);

    ResponseEntity <String> deleteEnrollment(Long id);
}
