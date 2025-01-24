package com.eogrenme.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.eogrenme.entits.Comment;

@Repository
public interface IRepositoryComment extends JpaRepository<Comment,Long> {
    List<Comment> findByCourseId(Long courseId);

       @Modifying
    @Query("DELETE FROM Comment c WHERE c.user.id = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
