package com.eogrenme.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoEnrollment {
    private Long id;
    private Long userId;
    private DtoCourse courseId;
    private BigDecimal progress;
    private LocalDateTime createdAt;
}