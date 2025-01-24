package com.eogrenme.serviece.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import com.eogrenme.entits.User;
import com.eogrenme.entits.Course;
import com.eogrenme.dto.DtoEnrollment;

import com.eogrenme.entits.Enrollment;
import com.eogrenme.repository.IRepositoryCourse;
import com.eogrenme.repository.IRepositoryEnrollment;
import com.eogrenme.repository.IRepositoryUser;
import com.eogrenme.serviece.IServiceEnrollment;

@Service
public class ServiceEnrollment implements IServiceEnrollment {
    @Autowired 
    private IRepositoryEnrollment repositoryEnrollment;

    @Autowired
    private IRepositoryCourse repositoryCourse;

    @Autowired
    private IRepositoryUser repositoryUser;

    @Override
    public Boolean deleteEnrollment(Long id) {
       Optional <Enrollment> op = repositoryEnrollment.findById(id);
       if(op.isEmpty()){
      throw new EmptyResultDataAccessException("Değer bulunamdı boş değer !",1);
       }
       repositoryEnrollment.delete(op.get());
        return true;
    }

    @Override
    public List<DtoEnrollment> getAllEnrollments() {
        List <DtoEnrollment> dtoEnrollments =repositoryEnrollment.findAll().stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());

        if(dtoEnrollments.isEmpty()){
         throw new NoSuchElementException("Kullanıcı kayit bulunamdadı"); 
        }
        return dtoEnrollments;
    }

    @Override
    public DtoEnrollment getEnrollmentById(Long id) {
        Optional <Enrollment> op = repositoryEnrollment.findById(id);
        return op.map(this::convertToDto).orElse(null);
    }

    @Override
    public List<DtoEnrollment> getEnrollmentsByCourseId(Long courseId) {
        List <DtoEnrollment> erollmentsbyCourseId=repositoryEnrollment.findByCourseId(courseId).stream()
        .map(this::convertToDto)
         .collect(Collectors.toList());

         if(erollmentsbyCourseId.isEmpty()){
         throw new NoSuchElementException("Bu kurs id göre kayitlar ");
         }
         return erollmentsbyCourseId;
    }


    @Override
    public List<DtoEnrollment> getEnrollmentsByUserId(Long userId) {
        List<Enrollment> enrollments = repositoryEnrollment.findByUserId(userId);
        if (enrollments.isEmpty()) {
            throw new NoSuchElementException("Bu kullanıcı için kayıt bulunamadı");
        }
        return enrollments.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    @Override
    public DtoEnrollment saveEnrollment(DtoEnrollment enrollment) {
        // Önce mevcut kaydı kontrol et
        Optional<Enrollment> existingEnrollment = repositoryEnrollment.findByUserIdAndCourseId(
            enrollment.getUserId(), enrollment.getCourseId());
        
        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("Bu kullanıcı zaten bu kursa kayıtlı!");
        }

        Enrollment enrollmentDb = new Enrollment();
        User user = repositoryUser.findById(enrollment.getUserId())
                      .orElseThrow(()->new RuntimeException("Kullanıcı bulunamadı !"));
        Course course =repositoryCourse.findById(enrollment.getCourseId())
                        .orElseThrow(()->new RuntimeException("Course bulunamadı"));
                        
                        enrollmentDb.setUser(user);
                        enrollmentDb.setCourse(course);
                     //   enrollmentDb.setProgress(enrollment.getProgress());
                        enrollmentDb.setCreatedAt(LocalDateTime.now());

                        Enrollment savedEnrollmentDb= repositoryEnrollment.save(enrollmentDb);

                        return convertToDto(savedEnrollmentDb);
    }


    private DtoEnrollment  convertToDto(Enrollment enrollment){
        DtoEnrollment dto= new DtoEnrollment();
        BeanUtils.copyProperties(enrollment, dto);
        dto.setCourseId(enrollment.getCourse().getId());
        dto.setUserId(enrollment.getUser().getId());
        dto.setCourseTitle(enrollment.getCourse().getTitle()); 
        dto.setCourseImage(enrollment.getCourse().getImageUrl()); 
        dto.setCourseDescription(enrollment.getCourse().getDescription()); 
      
        return dto;
    }

}

