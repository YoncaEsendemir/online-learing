package com.eogrenme.serviece.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eogrenme.dto.DtoComment;
import com.eogrenme.entits.Comment;
import com.eogrenme.entits.Course;
import com.eogrenme.entits.User;
import com.eogrenme.repository.IRepositoryComment;
import com.eogrenme.repository.IRepositoryCourse;
import com.eogrenme.repository.IRepositoryUser;
import com.eogrenme.serviece.IServiceComment;

@Service
public class ServiceComment implements IServiceComment {

    @Autowired
    private IRepositoryComment repositoryComment;

    @Autowired
    private IRepositoryCourse repositoryCourse;

    @Autowired
    private IRepositoryUser repositoryUser;

    @Override
    public DtoComment createComment(DtoComment dtoComment) {
        Course course = repositoryCourse.findById(dtoComment.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User user = repositoryUser.findById(dtoComment.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setContent(dtoComment.getContent());
        comment.setCourse(course);
        comment.setUser(user);

        Comment savedComment = repositoryComment.save(comment);
        return convertToDto(savedComment);
    }

    @Override
    public List<DtoComment> getCommentsByCourse(Long courseId) {
        List<Comment> comments = repositoryComment.findByCourseId(courseId);
        return comments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private DtoComment convertToDto(Comment comment) {
        DtoComment dto = new DtoComment();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCourseId(comment.getCourse().getId());
        dto.setCourseTitle(comment.getCourse().getTitle());
        dto.setUserId(comment.getUser().getId());
        dto.setUserName(comment.getUser().getName());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}

