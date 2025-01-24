package com.eogrenme.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//long id ekle
//private Long id;   // Kurs ID'si
//private String name;   // Kurs ismi

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseSearchCriteria {
    private String courseName;   // Kurs adı
    private String category;    // Kurs kategorisi
}
