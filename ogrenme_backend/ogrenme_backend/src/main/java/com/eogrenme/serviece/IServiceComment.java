package com.eogrenme.serviece;

import java.util.List;

import com.eogrenme.dto.DtoComment;

public interface IServiceComment {
    DtoComment createComment(DtoComment dtoComment);
    
    List<DtoComment> getCommentsByCourse(Long courseId);
}