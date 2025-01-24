package com.eogrenme.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.eogrenme.dto.DtoComment;

public interface ICommentController {

    ResponseEntity<DtoComment> createComment(DtoComment dtoComment);
    ResponseEntity<List<DtoComment>> getCommentsByCourse(Long courseId);

}

