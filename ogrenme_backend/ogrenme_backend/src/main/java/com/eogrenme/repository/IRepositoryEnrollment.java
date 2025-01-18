package com.eogrenme.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eogrenme.entits.Enrollment;

public interface IRepositoryEnrollment extends JpaRepository<Enrollment, Long>{
    @Query("SELECT e FROM Enrollment e JOIN FETCH e.course c WHERE e.user.id = :userId")
    List<Enrollment> findByUserId(@Param("userId") Long userId);
    List<Enrollment> findByCourseId(Long courseId);
}
