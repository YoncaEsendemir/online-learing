package com.eogrenme.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoUserIdEmail {

    private Long id;

    private String name;

    private int role;
}
