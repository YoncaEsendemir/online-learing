package com.eogrenme.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eogrenme.controller.ICommentController;
import com.eogrenme.dto.DtoComment;
import com.eogrenme.serviece.IServiceComment;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rest/api/comments")
public class CommentController implements ICommentController {

    @Autowired
    private IServiceComment serviceComment;

    @Override
    @PostMapping("/save")
    public ResponseEntity<DtoComment> createComment(@RequestBody DtoComment dtoComment) {
        DtoComment createdComment = serviceComment.createComment(dtoComment);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @Override
    @GetMapping("/getcomments/{courseId}")     
    public ResponseEntity<List<DtoComment>> getCommentsByCourse(@PathVariable(name="courseId",required = true) Long courseId) {
        List<DtoComment> comments = serviceComment.getCommentsByCourse(courseId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}

