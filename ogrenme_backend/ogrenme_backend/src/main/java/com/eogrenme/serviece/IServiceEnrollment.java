package com.eogrenme.serviece;
import java.util.List;


import com.eogrenme.dto.DtoEnrollment;
 

public interface IServiceEnrollment {

    DtoEnrollment saveEnrollment (DtoEnrollment enrollment);
    List<DtoEnrollment>getAllEnrollments();
    List<DtoEnrollment>getEnrollmentsByUserId(Long userId);
    List<DtoEnrollment>getEnrollmentsByCourseId(Long courseId);
    Boolean deleteEnrollment(Long id);
    DtoEnrollment getEnrollmentById(Long id);
}
